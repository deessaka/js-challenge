import { access, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { randomUUID } from 'node:crypto'

import { ApiClient } from '../api_client.js'
import { ConfigStore } from '../config_store.js'
import type { Challenge, User } from '../types.js'
import { ANSI, BOX, moveTo, padRight, stringWidth, THEME } from './ansi.js'
import { CodeEditor } from './code_editor.js'
import { ExerciseTree } from './exercise_tree.js'
import { HelpModal } from './help_modal.js'
import { InstructionsView } from './instructions_view.js'
import { LoginModal } from './login_modal.js'
import { FocusPanel, StatusBar } from './status_bar.js'
import { TestModal } from './test_modal.js'

export function inferStarterCode(challenge: Challenge): string {
  if (
    challenge.starterCode &&
    challenge.starterCode.trim() &&
    !challenge.starterCode.includes("console.log('Hello')")
  ) {
    return challenge.starterCode
  }

  const desc = challenge.description || ''
  // 1. Search for function call in examples: e.g. "number([[10,0],[3,5]]) ➔ 5" or "removeChar('...') ➔"
  const exampleMatch = desc.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*(?:[➔→\uF0E0]|===|->)/)
  if (exampleMatch) {
    const fnName = exampleMatch[1]
    const rawArgs = exampleMatch[2].trim()
    let params = 'input'
    if (rawArgs.includes(',')) {
      const count = rawArgs.split(',').length
      params = ['a', 'b', 'c', 'd', 'e'].slice(0, Math.min(5, count)).join(', ')
    } else if (rawArgs.startsWith('"') || rawArgs.startsWith("'")) {
      params = 'str'
    } else if (rawArgs.startsWith('[')) {
      params = 'arr'
    } else if (/^\d+$/.test(rawArgs)) {
      params = 'num'
    } else if (rawArgs) {
      params = 'input'
    }

    return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(${params}) {\n  // Votre solution ici\n  \n}\n`
  }

  // 2. Fallback to general function call in description
  const generalMatch = desc.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/)
  const stopWords = ['et', 'ou', 'le', 'la', 'un', 'une', 'des', 'les', 'pour', 'dans', 'avec', 'par', 'sur', 'bus']
  if (generalMatch && !stopWords.includes(generalMatch[1].toLowerCase())) {
    const fnName = generalMatch[1]
    return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(input) {\n  // Votre solution ici\n  \n}\n`
  }

  return `// #${challenge.number} — ${challenge.title}\n\nfunction solution(input) {\n  // Votre solution ici\n  \n}\n`
}

interface PanelLayout {
  is3Columns: boolean
  leftWidth: number
  midWidth: number
  rightWidth: number
  mainHeight: number
  editorLeft: number
}

export class TuiApp {
  private api: ApiClient
  private store: ConfigStore
  private user: User | null = null
  private activePanel: FocusPanel = 'tree'

  private tree = new ExerciseTree()
  private editor = new CodeEditor()
  private instructions = new InstructionsView()
  private testModal = new TestModal()
  private statusBar = new StatusBar()
  private loginModal = new LoginModal()
  private helpModal = new HelpModal()

  private isRunning = false
  private isAuthenticating = false
  private loadedExerciseSlug: string | null = null
  private layout: PanelLayout | null = null
  private spinnerTimer: NodeJS.Timeout | null = null

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.store = new ConfigStore(env)
    const apiBaseUrl = String(env.JS_CHALLENGE_API_URL || 'http://localhost:3333')
    this.api = new ApiClient(apiBaseUrl, () => this.store.read().then((c) => c.token))
  }

  async start(): Promise<number> {
    const config = await this.store.read()
    this.isRunning = true

    this.setupTerminal()
    this.drawLoading('Initialisation de JS Challenge...')

    if (!config.token) {
      this.isAuthenticating = true
      this.render()
    } else {
      try {
        await this.loadInitialData()
      } catch (err) {
        this.isAuthenticating = true
        this.loginModal.errorMessage = err instanceof Error ? err.message : 'Erreur d’authentification'
      }
    }

    this.render()
    await this.runEventLoop()
    this.cleanupTerminal()

    return 0
  }

  private setupTerminal(): void {
    if (input.isTTY && input.setRawMode) {
      input.setRawMode(true)
    }
    input.resume()
    output.write(ANSI.enterAltScreen)
    output.write(ANSI.hideCursor)
    output.write(ANSI.clearScreen)
    output.write('\x1b[?1000h\x1b[?1002h\x1b[?1006h')

    output.on('resize', () => {
      this.render()
    })
  }

  private cleanupTerminal(): void {
    if (this.spinnerTimer) clearInterval(this.spinnerTimer)
    output.write('\x1b[?1006l\x1b[?1002l\x1b[?1000l')
    if (input.isTTY && input.setRawMode) {
      input.setRawMode(false)
    }
    input.pause()
    output.write(ANSI.showCursor)
    output.write(ANSI.leaveAltScreen)
  }

  private drawLoading(message: string): void {
    const rows = output.rows || 24
    const cols = output.columns || 80
    const msg = `${THEME.primary}${ANSI.bold}⏳ ${message}${ANSI.reset}`
    output.write(ANSI.clearScreen)
    output.write(moveTo(Math.floor(rows / 2), Math.floor((cols - stringWidth(message)) / 2)))
    output.write(msg)
  }

  private async loadInitialData(): Promise<void> {
    this.user = await this.api.getMe()
    this.statusBar.setUser(this.user)

    const challengesRes = await this.api.listChallenges(1, 200)
    this.tree.setChallenges(challengesRes.data)

    const selected = this.tree.getSelectedChallenge()
    if (selected) {
      await this.selectChallenge(selected)
    }
  }

  private async selectChallenge(challenge: Challenge): Promise<void> {
    this.loadedExerciseSlug = challenge.slug
    try {
      const fullChallenge = await this.api.getChallenge(challenge.slug)
      this.instructions.setChallenge(fullChallenge)

      const isLocked = !fullChallenge.isUnlocked
      const lockMsg = isLocked
        ? `Cet exercice (#${fullChallenge.number}) est verrouillé. Terminez l’exercice #${Math.max(1, fullChallenge.number - 1)} pour le débloquer.`
        : ''

      const localFilePath = resolve(`${challenge.slug}.js`)
      let codeToLoad = inferStarterCode(fullChallenge)

      if (!isLocked) {
        try {
          await access(localFilePath)
          const existing = await readFile(localFilePath, 'utf8')
          if (
            existing.trim() &&
            !existing.includes("console.log('Hello');") &&
            !existing.includes('function bus(input)')
          ) {
            codeToLoad = existing
          } else {
            await writeFile(localFilePath, codeToLoad, { encoding: 'utf8', mode: 0o600 })
          }
        } catch {
          await writeFile(localFilePath, codeToLoad, { encoding: 'utf8', mode: 0o600 })
        }
      }

      this.editor.setText(codeToLoad, isLocked, lockMsg)
    } catch (err) {
      this.statusBar.showNotification(`Erreur: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  private startSpinnerAnimation(): void {
    if (this.spinnerTimer) clearInterval(this.spinnerTimer)
    this.spinnerTimer = setInterval(() => {
      this.testModal.tickSpinner()
      this.render()
    }, 80)
  }

  private stopSpinnerAnimation(): void {
    if (this.spinnerTimer) {
      clearInterval(this.spinnerTimer)
      this.spinnerTimer = null
    }
  }

  private async testCodeLocally(): Promise<void> {
    const currentChallenge = this.instructions.challenge
    if (!currentChallenge) return

    if (!currentChallenge.isUnlocked) {
      this.statusBar.showNotification('🔒 Cet exercice est verrouillé. Débloquez-le d’abord !')
      return
    }

    const code = this.editor.getText()
    const localFilePath = resolve(`${currentChallenge.slug}.js`)
    await writeFile(localFilePath, code, { encoding: 'utf8' })

    this.testModal.open(true, `Vérification de ${currentChallenge.title}...`)
    this.startSpinnerAnimation()
    this.render()

    const startTime = Date.now()

    try {
      const submission = await this.api.createSubmission({
        challengeId: currentChallenge.id,
        code,
        dryRun: true,
      })

      const elapsed = Date.now() - startTime
      this.stopSpinnerAnimation()
      this.testModal.setSubmission(submission, true, elapsed)

      if (submission.accepted) {
        this.statusBar.showNotification('✓ Tests réussis en console ! [Ctrl+S] pour valider.')
      } else {
        this.statusBar.showNotification('✗ Échec de certains tests.')
      }
    } catch (err) {
      this.stopSpinnerAnimation()
      this.testModal.setError(err instanceof Error ? err.message : String(err))
    }

    this.render()
  }

  private async submitCurrentCode(): Promise<void> {
    const currentChallenge = this.instructions.challenge
    if (!currentChallenge) return

    if (!currentChallenge.isUnlocked) {
      this.statusBar.showNotification('🔒 Cet exercice est verrouillé.')
      return
    }

    const code = this.editor.getText()
    const localFilePath = resolve(`${currentChallenge.slug}.js`)
    await writeFile(localFilePath, code, { encoding: 'utf8' })

    this.testModal.open(false, `Validation officielle de ${currentChallenge.title}...`)
    this.startSpinnerAnimation()
    this.render()

    const startTime = Date.now()

    try {
      const submission = await this.api.createSubmission({
        challengeId: currentChallenge.id,
        code,
        idempotencyKey: randomUUID(),
        dryRun: false,
      })

      const elapsed = Date.now() - startTime
      this.stopSpinnerAnimation()
      this.testModal.setSubmission(submission, false, elapsed)

      if (submission.accepted) {
        currentChallenge.isCompleted = true
        this.statusBar.showNotification(`🎉 Validé avec succès ! (+${currentChallenge.points} pts)`)
        const challengesRes = await this.api.listChallenges(1, 200)
        this.tree.setChallenges(challengesRes.data)
      }
    } catch (err) {
      this.stopSpinnerAnimation()
      this.testModal.setError(err instanceof Error ? err.message : String(err))
    }

    this.render()
  }

  private async handleLoginSubmit(): Promise<void> {
    const token = this.loginModal.token.trim()
    if (!token) {
      this.loginModal.errorMessage = 'Le token ne peut pas être vide.'
      this.render()
      return
    }

    this.loginModal.isLoading = true
    this.render()

    try {
      const savedConfig = await this.store.read()
      const apiBaseUrl = String(process.env.JS_CHALLENGE_API_URL || savedConfig.apiBaseUrl || 'http://localhost:3333')
      await this.store.save({ apiBaseUrl, token })
      this.api = new ApiClient(apiBaseUrl, () => Promise.resolve(token))

      await this.loadInitialData()
      this.isAuthenticating = false
      this.loginModal.clear()
      this.statusBar.showNotification(`Connecté en tant que ${this.user?.username}`)
    } catch (err) {
      this.loginModal.isLoading = false
      this.loginModal.errorMessage = err instanceof Error ? err.message : 'Token invalide'
    }

    this.render()
  }

  private runEventLoop(): Promise<void> {
    return new Promise((resolve) => {
      const onData = async (chunk: Buffer) => {
        const text = chunk.toString('utf8')

        // Handle Mouse SGR events: \x1b[<btn;col;row[Mm]
        const mouseMatch = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/.exec(text)
        if (mouseMatch) {
          const btn = Number(mouseMatch[1])
          const col = Number(mouseMatch[2])
          const row = Number(mouseMatch[3])
          const isPress = mouseMatch[4] === 'M'
          await this.handleMouseEvent(btn, col, row, isPress)
          this.render()
          return
        }

        // Global Quit: Ctrl+C (\x03) or Ctrl+Q (\x11)
        if (text === '\u0003' || text === '\u0011') {
          input.off('data', onData)
          this.isRunning = false
          resolve()
          return
        }

        // If Test Modal is open
        if (this.testModal.isOpen) {
          if (text === '\u0013' || text === '\x1b[17~') {
            // Ctrl+S inside modal triggers official submit
            await this.submitCurrentCode()
            return
          }
          if (text === '\x1b' || text === '\r' || text === '\n') {
            this.testModal.close()
            this.activePanel = 'editor'
            this.statusBar.setActivePanel('editor')
            this.render()
            return
          }
          if (text === '\x1b[A' || text === 'k') {
            this.testModal.scrollUp(1)
            this.render()
            return
          }
          if (text === '\x1b[B' || text === 'j') {
            this.testModal.scrollDown(1)
            this.render()
            return
          }
          return
        }

        // Help Modal Toggle: ? or F1 (\x1bOP)
        if ((text === '?' && !this.isAuthenticating && !this.tree.isSearching && this.activePanel !== 'editor') || text === '\x1bOP') {
          this.helpModal.toggle()
          this.render()
          return
        }

        // If Help modal is open, any Esc or ? closes it
        if (this.helpModal.isOpen) {
          if (text === '\x1b' || text === '?' || text === '\r' || text === '\n') {
            this.helpModal.isOpen = false
            this.render()
          }
          return
        }

        // Login modal input handling
        if (this.isAuthenticating) {
          if (text === '\r' || text === '\n') {
            await this.handleLoginSubmit()
            return
          }
          if (text === '\u007f' || text === '\b') {
            this.loginModal.handleBackspace()
            this.render()
            return
          }
          for (const char of text) {
            if (char.charCodeAt(0) >= 32) {
              this.loginModal.insertChar(char)
            }
          }
          this.render()
          return
        }

        // Tree Search Mode Input Handling
        if (this.tree.isSearching) {
          if (text === '\r' || text === '\n') {
            this.tree.isSearching = false
            const sel = this.tree.getSelectedChallenge()
            if (sel) await this.selectChallenge(sel)
            this.render()
            return
          }
          if (text === '\x1b') {
            this.tree.cancelSearch()
            this.render()
            return
          }
          if (text === '\u007f' || text === '\b') {
            this.tree.backspaceSearch()
            const sel = this.tree.getSelectedChallenge()
            if (sel) await this.selectChallenge(sel)
            this.render()
            return
          }
          for (const char of text) {
            if (char.charCodeAt(0) >= 32) {
              this.tree.insertSearchChar(char)
            }
          }
          const sel = this.tree.getSelectedChallenge()
          if (sel) await this.selectChallenge(sel)
          this.render()
          return
        }

        // Navigation between panels via Tab
        if (text === '\t') {
          this.cycleActivePanel(1)
          this.render()
          return
        }
        if (text === '\x1b[Z') {
          // Shift+Tab
          this.cycleActivePanel(-1)
          this.render()
          return
        }

        // Direct panel jumps with numbers outside editor
        if (this.activePanel !== 'editor') {
          if (text === '1') {
            this.activePanel = 'tree'
            this.statusBar.setActivePanel('tree')
            this.render()
            return
          }
          if (text === '2') {
            this.activePanel = 'instructions'
            this.statusBar.setActivePanel('instructions')
            this.render()
            return
          }
          if (text === '3') {
            this.activePanel = 'editor'
            this.statusBar.setActivePanel('editor')
            this.render()
            return
          }
        }

        // Action: Test locally without submission -> Ctrl+T (\x14) or F5 (\x1b[15~)
        if (text === '\u0014' || text === '\x1b[15~') {
          await this.testCodeLocally()
          return
        }

        // Action: Submit & Validate -> Ctrl+S (\x13) or F6 (\x1b[17~)
        if (text === '\u0013' || text === '\x1b[17~') {
          await this.submitCurrentCode()
          return
        }

        // Action: Refresh -> Ctrl+R (\x12)
        if (text === '\u0012') {
          this.drawLoading('Actualisation...')
          await this.loadInitialData()
          this.statusBar.showNotification('Exercices actualisés.')
          this.render()
          return
        }

        // Direct panel key routing
        if (this.activePanel === 'tree') {
          this.handleTreeKey(text)
        } else if (this.activePanel === 'instructions') {
          this.handleInstructionsKey(text)
        } else if (this.activePanel === 'editor') {
          this.handleEditorKey(text)
        }

        this.render()
      }

      input.on('data', onData)
    })
  }

  private cycleActivePanel(dir: number): void {
    const panels: FocusPanel[] = this.layout?.is3Columns
      ? ['tree', 'instructions', 'editor']
      : ['tree', 'editor']

    const curIdx = panels.indexOf(this.activePanel)
    const nextIdx = (curIdx + dir + panels.length) % panels.length
    this.activePanel = panels[nextIdx]
    this.statusBar.setActivePanel(this.activePanel)
  }

  private async handleMouseEvent(btn: number, col: number, row: number, isPress: boolean): Promise<void> {
    if (!this.layout || !isPress) return

    if (this.helpModal.isOpen) {
      this.helpModal.isOpen = false
      return
    }

    if (this.testModal.isOpen) {
      if (btn === 64) {
        this.testModal.scrollUp(2)
        return
      }
      if (btn === 65) {
        this.testModal.scrollDown(2)
        return
      }
      this.testModal.close()
      return
    }

    const { is3Columns, leftWidth, midWidth, editorLeft } = this.layout

    // 1. Mouse Wheel Scroll Up (btn === 64)
    if (btn === 64) {
      if (col <= leftWidth + 1) {
        this.tree.moveUp()
        const sel = this.tree.getSelectedChallenge()
        if (sel && sel.slug !== this.loadedExerciseSlug) await this.selectChallenge(sel)
      } else if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
        this.instructions.scrollUp(2)
      } else {
        this.editor.moveUp()
      }
      return
    }

    // 2. Mouse Wheel Scroll Down (btn === 65)
    if (btn === 65) {
      if (col <= leftWidth + 1) {
        this.tree.moveDown()
        const sel = this.tree.getSelectedChallenge()
        if (sel && sel.slug !== this.loadedExerciseSlug) await this.selectChallenge(sel)
      } else if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
        this.instructions.scrollDown(2)
      } else {
        this.editor.moveDown()
      }
      return
    }

    // 3. Left Mouse Click (btn === 0)
    if (btn === 0) {
      // Clicked on Tree (Left Column)
      if (col <= leftWidth + 1) {
        this.activePanel = 'tree'
        this.statusBar.setActivePanel('tree')
        const treeStartRow = 5
        if (row >= treeStartRow) {
          const clickedIndex = this.tree.scrollOffset + (row - treeStartRow)
          const challenges = this.tree.getFilteredChallenges()
          if (clickedIndex >= 0 && clickedIndex < challenges.length) {
            this.tree.selectedIndex = clickedIndex
            await this.selectChallenge(challenges[clickedIndex])
          }
        }
        return
      }

      // Clicked on Middle Column (Instructions in 3-column mode)
      if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
        this.activePanel = 'instructions'
        this.statusBar.setActivePanel('instructions')
        return
      }

      // Clicked on Right Column (Editor)
      if (col >= editorLeft) {
        this.activePanel = 'editor'
        this.statusBar.setActivePanel('editor')
        const gutterWidth = Math.max(3, String(this.editor.lines.length).length + 1)
        this.editor.handleClick(row - 2, col - editorLeft, gutterWidth)
        return
      }
    }
  }

  private handleTreeKey(key: string): void {
    if (key === '/' || key === '\x06') {
      this.tree.startSearch()
      return
    }
    if (key === 'f') {
      this.tree.cycleFilter()
      const sel = this.tree.getSelectedChallenge()
      if (sel) this.selectChallenge(sel)
      return
    }

    if (key === '\x1b[A' || key === 'k') {
      this.tree.moveUp()
      const sel = this.tree.getSelectedChallenge()
      if (sel && sel.slug !== this.loadedExerciseSlug) this.selectChallenge(sel)
    } else if (key === '\x1b[B' || key === 'j') {
      this.tree.moveDown()
      const sel = this.tree.getSelectedChallenge()
      if (sel && sel.slug !== this.loadedExerciseSlug) this.selectChallenge(sel)
    } else if (key === '\x1b[5~') {
      this.tree.pageUp(10)
    } else if (key === '\x1b[6~') {
      this.tree.pageDown(10)
    } else if (key === '\r' || key === '\n') {
      const sel = this.tree.getSelectedChallenge()
      if (sel && !sel.isUnlocked) {
        this.statusBar.showNotification(`🔒 L’exercice #${sel.number} est verrouillé.`)
      } else {
        this.activePanel = 'editor'
        this.statusBar.setActivePanel('editor')
      }
    }
  }

  private handleInstructionsKey(key: string): void {
    if (key === '\x1b[A' || key === 'k') {
      this.instructions.scrollUp(1)
    } else if (key === '\x1b[B' || key === 'j') {
      this.instructions.scrollDown(1)
    } else if (key === '\x1b') {
      this.activePanel = 'tree'
      this.statusBar.setActivePanel('tree')
    }
  }

  private handleEditorKey(key: string): void {
    if (key === '\x1b') {
      this.activePanel = 'tree'
      this.statusBar.setActivePanel('tree')
      return
    }

    if (this.editor.isLocked) {
      this.statusBar.showNotification('🔒 Exercice verrouillé : écriture désactivée.')
      return
    }

    if (key === '\x1b[A') {
      this.editor.moveUp()
    } else if (key === '\x1b[B') {
      this.editor.moveDown()
    } else if (key === '\x1b[C') {
      this.editor.moveRight()
    } else if (key === '\x1b[D') {
      this.editor.moveLeft()
    } else if (key === '\x1b[H' || key === '\x1b[1~') {
      this.editor.moveHome()
    } else if (key === '\x1b[F' || key === '\x1b[4~') {
      this.editor.moveEnd()
    } else if (key === '\x1b[5~') {
      this.editor.pageUp(10)
    } else if (key === '\x1b[6~') {
      this.editor.pageDown(10)
    } else if (key === '\r' || key === '\n') {
      this.editor.handleEnter()
    } else if (key === '\u007f' || key === '\b') {
      this.editor.handleBackspace()
    } else if (key === '\x1b[3~') {
      this.editor.handleDelete()
    } else {
      for (const char of key) {
        if (char.charCodeAt(0) >= 32) {
          this.editor.insertChar(char)
        }
      }
    }
  }

  private computeLayout(rows: number, cols: number): PanelLayout {
    const is3Columns = cols >= 105
    const statusBarHeight = 1
    const mainHeight = rows - statusBarHeight

    if (is3Columns) {
      const leftWidth = Math.min(32, Math.max(28, Math.floor(cols * 0.24)))
      const midWidth = Math.min(50, Math.max(36, Math.floor(cols * 0.36)))
      const rightWidth = Math.max(20, cols - leftWidth - midWidth - 4)
      const editorLeft = leftWidth + midWidth + 3

      return {
        is3Columns: true,
        leftWidth,
        midWidth,
        rightWidth,
        mainHeight,
        editorLeft,
      }
    } else {
      const leftWidth = Math.min(30, Math.max(24, Math.floor(cols * 0.28)))
      const rightWidth = Math.max(20, cols - leftWidth - 3)

      return {
        is3Columns: false,
        leftWidth,
        midWidth: 0,
        rightWidth,
        mainHeight,
        editorLeft: leftWidth + 2,
      }
    }
  }

  private render(): void {
    if (!this.isRunning) return

    const rows = Math.max(20, output.rows || 24)
    const cols = Math.max(60, output.columns || 80)

    let buffer = ANSI.syncStart + moveTo(1, 1)

    if (this.isAuthenticating) {
      buffer += ANSI.clearScreen
      const modalLines = this.loginModal.render(rows, cols)
      const startRow = Math.max(1, Math.floor((rows - modalLines.length) / 2))
      for (let i = 0; i < modalLines.length; i += 1) {
        buffer += moveTo(startRow + i, Math.max(1, Math.floor((cols - 74) / 2))) + modalLines[i]
      }
      buffer += ANSI.syncEnd
      output.write(buffer)
      return
    }

    const layout = this.computeLayout(rows, cols)
    this.layout = layout

    // Content rows height (mainHeight - 2 for top/bottom borders)
    const contentRows = layout.mainHeight - 2

    const treeLines = this.tree.render(contentRows, layout.leftWidth, this.activePanel === 'tree')

    if (layout.is3Columns) {
      // Top Border
      const p1Title = ` 📂 Exercices `
      const p1Color = this.activePanel === 'tree' ? THEME.primary + ANSI.bold : THEME.textMuted
      const p1BarLen = Math.max(0, layout.leftWidth - stringWidth(p1Title) + 1)
      const topCol1 = `${THEME.border}${BOX.roundedTopLeft}${BOX.horizontal}${p1Color}${p1Title}${THEME.border}${BOX.horizontal.repeat(p1BarLen)}`

      const p2Title = ` 📖 Consignes `
      const p2Color = this.activePanel === 'instructions' ? THEME.primary + ANSI.bold : THEME.textMuted
      const p2BarLen = Math.max(0, layout.midWidth - stringWidth(p2Title) + 1)
      const topCol2 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p2Color}${p2Title}${THEME.border}${BOX.horizontal.repeat(p2BarLen)}`

      const editorAction = this.editor.isLocked ? '[🔒 Bloqué]' : '[Ctrl+T: Tester │ Ctrl+S: Valider]'
      const p3Title = ` 💻 Solution JavaScript `
      const p3Color = this.activePanel === 'editor' ? THEME.primary + ANSI.bold : THEME.textMuted
      const p3Tag = ` ${THEME.textDim}${editorAction}${THEME.border} `
      const p3Prefix = `${p3Color}${p3Title}${p3Tag}`
      const p3BarLen = Math.max(0, layout.rightWidth - stringWidth(p3Title) - stringWidth(editorAction) - 2)
      const topCol3 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p3Prefix}${THEME.border}${BOX.horizontal.repeat(p3BarLen)}${BOX.roundedTopRight}${ANSI.reset}`

      buffer += moveTo(1, 1) + `${topCol1}${topCol2}${topCol3}`

      const instructionLines = this.instructions.render(contentRows, layout.midWidth, this.activePanel === 'instructions')
      const editorLines = this.editor.render(contentRows, layout.rightWidth, this.activePanel === 'editor')

      for (let r = 0; r < contentRows; r += 1) {
        const col1 = treeLines[r] || ' '.repeat(layout.leftWidth)
        const col2 = instructionLines[r] || ' '.repeat(layout.midWidth)
        const col3 = editorLines[r] || ' '.repeat(layout.rightWidth)

        const div = `${THEME.border}${BOX.vertical}${ANSI.reset}`

        buffer += moveTo(r + 2, 1) + `${div}${col1}${div}${col2}${div}${col3}${div}`
      }

      // Bottom Border
      const bot1 = `${THEME.border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(layout.leftWidth + 1)}`
      const bot2 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.midWidth + 1)}`
      const bot3 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.rightWidth + 1)}${BOX.roundedBottomRight}${ANSI.reset}`
      buffer += moveTo(layout.mainHeight, 1) + `${bot1}${bot2}${bot3}`
    } else {
      // 2-Column Layout
      const p1Title = ` 📂 Exercices `
      const p1Color = this.activePanel === 'tree' ? THEME.primary + ANSI.bold : THEME.textMuted
      const p1BarLen = Math.max(0, layout.leftWidth - stringWidth(p1Title) + 1)
      const topCol1 = `${THEME.border}${BOX.roundedTopLeft}${BOX.horizontal}${p1Color}${p1Title}${THEME.border}${BOX.horizontal.repeat(p1BarLen)}`

      const editorAction = this.editor.isLocked ? '[🔒 Bloqué]' : '[Ctrl+T: Tester │ Ctrl+S: Valider]'
      const p2Title = ` 💻 Solution JavaScript `
      const p2Color = this.activePanel === 'editor' ? THEME.primary + ANSI.bold : THEME.textMuted
      const p2Tag = ` ${THEME.textDim}${editorAction}${THEME.border} `
      const p2BarLen = Math.max(0, layout.rightWidth - stringWidth(p2Title) - stringWidth(editorAction) - 2)
      const topCol2 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p2Color}${p2Title}${p2Tag}${THEME.border}${BOX.horizontal.repeat(p2BarLen)}${BOX.roundedTopRight}${ANSI.reset}`

      buffer += moveTo(1, 1) + `${topCol1}${topCol2}`

      const editorLines = this.editor.render(contentRows, layout.rightWidth, this.activePanel === 'editor')

      for (let r = 0; r < contentRows; r += 1) {
        const col1 = treeLines[r] || ' '.repeat(layout.leftWidth)
        const col2 = editorLines[r] || ' '.repeat(layout.rightWidth)

        const div = `${THEME.border}${BOX.vertical}${ANSI.reset}`
        buffer += moveTo(r + 2, 1) + `${div}${col1}${div}${col2}${div}`
      }

      const bot1 = `${THEME.border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(layout.leftWidth + 1)}`
      const bot2 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.rightWidth + 1)}${BOX.roundedBottomRight}${ANSI.reset}`
      buffer += moveTo(layout.mainHeight, 1) + `${bot1}${bot2}`
    }

    // Status bar at bottom
    const statusLines = this.statusBar.render(cols)
    buffer += moveTo(rows, 1) + statusLines[0]

    // Floating Test Modal Overlay (when active)
    if (this.testModal.isOpen) {
      const modalLines = this.testModal.render(rows, cols)
      const modalWidth = stringWidth(modalLines[0])
      const startRow = Math.max(1, Math.floor((rows - modalLines.length) / 2))
      const startCol = Math.max(1, Math.floor((cols - modalWidth) / 2))

      for (let i = 0; i < modalLines.length; i += 1) {
        buffer += moveTo(startRow + i, startCol) + modalLines[i]
      }
    }

    // Floating Help Modal Overlay
    if (this.helpModal.isOpen) {
      const helpLines = this.helpModal.render(rows, cols)
      const modalWidth = stringWidth(helpLines[0])
      const startRow = Math.max(1, Math.floor((rows - helpLines.length) / 2))
      const startCol = Math.max(1, Math.floor((cols - modalWidth) / 2))

      for (let i = 0; i < helpLines.length; i += 1) {
        buffer += moveTo(startRow + i, startCol) + helpLines[i]
      }
    }

    buffer += ANSI.syncEnd
    output.write(buffer)
  }
}
