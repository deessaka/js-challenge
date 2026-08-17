import type { Challenge } from '../types.js'
import { ANSI, padRight, truncate } from './ansi.js'

export class ExerciseTree {
  challenges: Challenge[] = []
  selectedIndex = 0
  scrollOffset = 0
  filterText = ''

  setChallenges(challenges: Challenge[]): void {
    this.challenges = challenges
    if (this.selectedIndex >= this.challenges.length) {
      this.selectedIndex = Math.max(0, this.challenges.length - 1)
    }
  }

  getFilteredChallenges(): Challenge[] {
    if (!this.filterText) return this.challenges
    const query = this.filterText.toLowerCase()
    return this.challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.slug.toLowerCase().includes(query) ||
        String(challenge.number).includes(query)
    )
  }

  getSelectedChallenge(): Challenge | null {
    const list = this.getFilteredChallenges()
    return list[this.selectedIndex] || null
  }

  moveUp(): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
  }

  moveDown(): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.min(list.length - 1, this.selectedIndex + 1)
  }

  pageUp(pageSize: number): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.max(0, this.selectedIndex - pageSize)
  }

  pageDown(pageSize: number): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.min(list.length - 1, this.selectedIndex + pageSize)
  }

  selectBySlug(slug: string): void {
    const list = this.getFilteredChallenges()
    const index = list.findIndex((challenge) => challenge.slug === slug || String(challenge.number) === slug)
    if (index !== -1) this.selectedIndex = index
  }

  render(height: number, width: number, isFocused: boolean): string[] {
    const list = this.getFilteredChallenges()
    const lines: string[] = []
    const completedCount = this.challenges.filter((challenge) => challenge.isCompleted).length
    const unlockedCount = this.challenges.filter((challenge) => challenge.isUnlocked).length
    const total = this.challenges.length

    const header = `${ANSI.bold}${ANSI.cyan}EXERCICES${ANSI.reset} ${ANSI.dim}(${completedCount}/${total})${ANSI.reset}`
    lines.push(` ${padRight(header, width - 2)}`)
    lines.push(
      ` ${padRight(
        `${ANSI.dim}${unlockedCount} disponibles · ${total - unlockedCount} verrouillés${
          this.filterText ? ` · filtre : ${this.filterText}` : ''
        }${ANSI.reset}`,
        width - 2
      )}`
    )
    lines.push(`${ANSI.gray}${'─'.repeat(width)}${ANSI.reset}`)

    const availableHeight = Math.max(1, height - 3)
    if (this.selectedIndex < this.scrollOffset) this.scrollOffset = this.selectedIndex
    if (this.selectedIndex >= this.scrollOffset + availableHeight) {
      this.scrollOffset = this.selectedIndex - availableHeight + 1
    }

    if (!list.length) {
      lines.push(padRight(`${ANSI.dim}Aucun exercice trouvé.${ANSI.reset}`, width))
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.slice(0, height)
    }

    for (let index = 0; index < availableHeight; index += 1) {
      const itemIndex = this.scrollOffset + index
      if (itemIndex >= list.length) {
        lines.push(' '.repeat(width))
        continue
      }

      const item = list[itemIndex]
      const selected = itemIndex === this.selectedIndex
      const status = item.isCompleted
        ? `${ANSI.brightGreen}✓${ANSI.reset}`
        : item.isUnlocked
          ? `${ANSI.brightYellow}●${ANSI.reset}`
          : `${ANSI.gray}·${ANSI.reset}`
      const title = truncate(`${item.number}. ${item.title}`, Math.max(5, width - 9))
      const content = `${status} ${title}`

      if (selected) {
        const background = isFocused ? ANSI.bgBlue + ANSI.white : ANSI.bgDarkGray + ANSI.white
        lines.push(`${background} ${padRight(content, width - 2)} ${ANSI.reset}`)
      } else {
        lines.push(padRight(`  ${content}`, width))
      }
    }

    return lines.slice(0, height)
  }
}
