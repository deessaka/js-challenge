import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Box, Text, useInput } from 'ink'
import type { Challenge } from '../types.js'
import { COLORS } from './theme.js'

const JS_KEYWORDS = new Set([
  'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch',
  'finally', 'throw', 'async', 'await', 'class', 'extends', 'super', 'this',
  'new', 'typeof', 'instanceof', 'import', 'export', 'from', 'as', 'yield',
  'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'
])

interface CodeEditorViewProps {
  challenge: Challenge
  initialCode: string
  onSaveCode: (code: string) => Promise<void>
  onTestLocally: (code: string) => void
  onSubmitSolution: (code: string) => void
  onBack: () => void
  visibleLinesCount?: number
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  challenge,
  initialCode,
  onSaveCode,
  onTestLocally,
  onSubmitSolution,
  onBack,
  visibleLinesCount = 16,
}) => {
  const [lines, setLines] = useState<string[]>(() => {
    const split = initialCode.split(/\r?\n/)
    return split.length > 0 ? split : ['']
  })
  const [cursorRow, setCursorRow] = useState(0)
  const [cursorCol, setCursorCol] = useState(0)
  const [scrollRow, setScrollRow] = useState(0)
  const [isSaved, setIsSaved] = useState(true)

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentCodeRef = useRef<string>(initialCode)

  // Reset editor ONLY when the challenge ID changes
  useEffect(() => {
    const split = initialCode.split(/\r?\n/)
    setLines(split.length > 0 ? split : [''])
    setCursorRow(0)
    setCursorCol(0)
    setScrollRow(0)
    setIsSaved(true)
    currentCodeRef.current = initialCode
  }, [challenge.id])

  // Auto-scroll viewport
  useEffect(() => {
    if (cursorRow < scrollRow) {
      setScrollRow(cursorRow)
    } else if (cursorRow >= scrollRow + visibleLinesCount) {
      setScrollRow(cursorRow - visibleLinesCount + 1)
    }
  }, [cursorRow, scrollRow, visibleLinesCount])

  // Debounced code persistence to avoid re-render feedback loop
  const scheduleSave = useCallback(
    (newLines: string[]) => {
      const code = newLines.join('\n')
      currentCodeRef.current = code
      setIsSaved(false)

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(async () => {
        await onSaveCode(code)
        setIsSaved(true)
      }, 300)
    },
    [onSaveCode]
  )

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    await onSaveCode(currentCodeRef.current)
    setIsSaved(true)
  }, [onSaveCode])

  // Syntax highlighter for line segments
  const renderHighlightedSegment = useCallback((text: string, keyPrefix: string) => {
    if (!text) return null

    const tokens: React.ReactNode[] = []
    let idx = 0
    const len = text.length

    while (idx < len) {
      // Comments
      if (text[idx] === '/' && text[idx + 1] === '/') {
        tokens.push(
          <Text key={`${keyPrefix}-c-${idx}`} color={COLORS.textMuted} italic>
            {text.slice(idx)}
          </Text>
        )
        break
      }

      // Strings
      if (text[idx] === "'" || text[idx] === '"' || text[idx] === '`') {
        const quote = text[idx]
        let str = quote
        idx += 1
        while (idx < len && text[idx] !== quote) {
          if (text[idx] === '\\' && idx + 1 < len) {
            str += text[idx] + text[idx + 1]
            idx += 2
          } else {
            str += text[idx]
            idx += 1
          }
        }
        if (idx < len) {
          str += text[idx]
          idx += 1
        }
        tokens.push(
          <Text key={`${keyPrefix}-s-${idx}`} color={COLORS.success}>
            {str}
          </Text>
        )
        continue
      }

      // Numbers
      if (/\d/.test(text[idx])) {
        let num = ''
        while (idx < len && /[\d._xb]/.test(text[idx])) {
          num += text[idx]
          idx += 1
        }
        tokens.push(
          <Text key={`${keyPrefix}-n-${idx}`} color={COLORS.warning}>
            {num}
          </Text>
        )
        continue
      }

      // Identifiers / Keywords
      if (/[a-zA-Z_$]/.test(text[idx])) {
        let word = ''
        while (idx < len && /[a-zA-Z0-9_$]/.test(text[idx])) {
          word += text[idx]
          idx += 1
        }
        if (JS_KEYWORDS.has(word)) {
          tokens.push(
            <Text key={`${keyPrefix}-kw-${idx}`} color={COLORS.secondary} bold>
              {word}
            </Text>
          )
        } else if (idx < len && text[idx] === '(') {
          tokens.push(
            <Text key={`${keyPrefix}-fn-${idx}`} color={COLORS.primary}>
              {word}
            </Text>
          )
        } else {
          tokens.push(
            <Text key={`${keyPrefix}-id-${idx}`} color={COLORS.text}>
              {word}
            </Text>
          )
        }
        continue
      }

      // Symbols & Operators
      if (/[=+\-*/%&|^!<>?:;.,{}()[\]]/.test(text[idx])) {
        tokens.push(
          <Text key={`${keyPrefix}-sym-${idx}`} color={COLORS.cyan}>
            {text[idx]}
          </Text>
        )
        idx += 1
        continue
      }

      tokens.push(
        <Text key={`${keyPrefix}-raw-${idx}`} color={COLORS.text}>
          {text[idx]}
        </Text>
      )
      idx += 1
    }

    return tokens
  }, [])

  // Keyboard handler
  useInput((input, key) => {
    // Actions: Ctrl+T -> Flush save and test locally
    if (key.ctrl && input === 't') {
      flushSave()
      onTestLocally(currentCodeRef.current)
      return
    }

    // Actions: Ctrl+S -> Flush save and submit officially
    if (key.ctrl && input === 's') {
      flushSave()
      onSubmitSolution(currentCodeRef.current)
      return
    }

    // Escape -> Return to previous screen (Consignes)
    if (key.escape) {
      flushSave()
      onBack()
      return
    }

    if (!challenge.isUnlocked) return

    // Navigation: Up
    if (key.upArrow) {
      setCursorRow((r) => {
        const nextR = Math.max(0, r - 1)
        setCursorCol((c) => Math.min(c, (lines[nextR] || '').length))
        return nextR
      })
      return
    }

    // Navigation: Down
    if (key.downArrow) {
      setCursorRow((r) => {
        const nextR = Math.min(lines.length - 1, r + 1)
        setCursorCol((c) => Math.min(c, (lines[nextR] || '').length))
        return nextR
      })
      return
    }

    // Navigation: Left
    if (key.leftArrow) {
      setCursorCol((c) => Math.max(0, c - 1))
      return
    }

    // Navigation: Right
    if (key.rightArrow) {
      setCursorCol((c) => Math.min((lines[cursorRow] || '').length, c + 1))
      return
    }

    // Home (\x1b[H or \x1b[1~)
    if (input === '\x1b[H' || input === '\x1b[1~') {
      setCursorCol(0)
      return
    }

    // End (\x1b[F or \x1b[4~)
    if (input === '\x1b[F' || input === '\x1b[4~') {
      setCursorCol((lines[cursorRow] || '').length)
      return
    }

    // Enter -> New line with auto-indent
    if (key.return) {
      const curLine = lines[cursorRow] || ''
      const leadingSpaces = curLine.match(/^\s*/)?.[0] || ''
      const before = curLine.slice(0, cursorCol)
      const after = curLine.slice(cursorCol)

      let nextIndent = leadingSpaces
      if (before.trimEnd().endsWith('{') || before.trimEnd().endsWith('(')) {
        nextIndent += '  '
      }

      const nextLines = [
        ...lines.slice(0, cursorRow),
        before,
        nextIndent + after,
        ...lines.slice(cursorRow + 1),
      ]
      setLines(nextLines)
      setCursorRow((r) => r + 1)
      setCursorCol(nextIndent.length)
      scheduleSave(nextLines)
      return
    }

    // Backspace / Delete
    if (key.backspace || key.delete) {
      const curLine = lines[cursorRow] || ''
      if (cursorCol > 0) {
        // Delete 2 spaces if at indent
        if (
          cursorCol >= 2 &&
          curLine.slice(cursorCol - 2, cursorCol) === '  ' &&
          /^\s*$/.test(curLine.slice(0, cursorCol))
        ) {
          const nextLines = [
            ...lines.slice(0, cursorRow),
            curLine.slice(0, cursorCol - 2) + curLine.slice(cursorCol),
            ...lines.slice(cursorRow + 1),
          ]
          setLines(nextLines)
          setCursorCol((c) => c - 2)
          scheduleSave(nextLines)
        } else {
          const nextLines = [
            ...lines.slice(0, cursorRow),
            curLine.slice(0, cursorCol - 1) + curLine.slice(cursorCol),
            ...lines.slice(cursorRow + 1),
          ]
          setLines(nextLines)
          setCursorCol((c) => c - 1)
          scheduleSave(nextLines)
        }
      } else if (cursorRow > 0) {
        // Merge line with previous line
        const prevLine = lines[cursorRow - 1] || ''
        const prevLen = prevLine.length
        const nextLines = [
          ...lines.slice(0, cursorRow - 1),
          prevLine + curLine,
          ...lines.slice(cursorRow + 1),
        ]
        setLines(nextLines)
        setCursorRow((r) => r - 1)
        setCursorCol(prevLen)
        scheduleSave(nextLines)
      }
      return
    }

    // Tab -> 2 spaces
    if (key.tab) {
      const curLine = lines[cursorRow] || ''
      const nextLines = [
        ...lines.slice(0, cursorRow),
        curLine.slice(0, cursorCol) + '  ' + curLine.slice(cursorCol),
        ...lines.slice(cursorRow + 1),
      ]
      setLines(nextLines)
      setCursorCol((c) => c + 2)
      scheduleSave(nextLines)
      return
    }

    // Direct Character Typing
    if (input && input.charCodeAt(0) >= 32) {
      const curLine = lines[cursorRow] || ''
      const nextLines = [
        ...lines.slice(0, cursorRow),
        curLine.slice(0, cursorCol) + input + curLine.slice(cursorCol),
        ...lines.slice(cursorRow + 1),
      ]
      setLines(nextLines)
      setCursorCol((c) => c + input.length)
      scheduleSave(nextLines)
      return
    }
  })

  if (!challenge.isUnlocked) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={COLORS.error}
        paddingX={1}
        paddingY={1}
      >
        <Box justifyContent="center" marginBottom={1}>
          <Text color={COLORS.error} bold>
            🔒 CHALLENGE VERROUILLÉ (#{challenge.number} {challenge.title})
          </Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text color={COLORS.textMuted}>
            Vous devez terminer l'exercice #{Math.max(1, challenge.number - 1)} pour débloquer l'éditeur.
          </Text>
        </Box>
        <Box
          borderStyle="single"
          borderColor={COLORS.border}
          paddingX={1}
          justifyContent="space-between"
        >
          <Text color={COLORS.textMuted}>[Échap] Retour aux consignes</Text>
        </Box>
      </Box>
    )
  }

  // Slicing viewport
  const visibleLines = useMemo(() => {
    return lines.slice(scrollRow, scrollRow + visibleLinesCount)
  }, [lines, scrollRow, visibleLinesCount])

  const gutterWidth = Math.max(3, String(lines.length).length + 1)

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.borderFocus} paddingX={1} paddingY={0}>
      {/* Header Bar */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text>
            <Text color={COLORS.primary} bold>
              💻 ÉDITEUR JAVASCRIPT INTÉGRÉ
            </Text>
            <Text color={COLORS.textMuted}> │ #{challenge.number} {challenge.title}</Text>
          </Text>
        </Box>

        <Box>
          <Text>
            {isSaved ? (
              <Text color={COLORS.success}>● Enregistré </Text>
            ) : (
              <Text color={COLORS.warning}>○ Écriture... </Text>
            )}
            <Text color={COLORS.textDim}>
              Ln {cursorRow + 1}, Col {cursorCol + 1}
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Code Editor Buffer */}
      <Box flexDirection="column" marginBottom={1}>
        {visibleLines.map((rawLine, i) => {
          const lineIndex = scrollRow + i
          const isCurrent = lineIndex === cursorRow
          const lineNum = String(lineIndex + 1).padStart(gutterWidth - 1, ' ')

          if (isCurrent) {
            const before = rawLine.slice(0, cursorCol)
            const cursorChar = rawLine[cursorCol] || ' '
            const after = rawLine.slice(cursorCol + 1)

            return (
              <Box key={lineIndex}>
                <Text>
                  <Text color={COLORS.warning} bold>
                    {lineNum} │{' '}
                  </Text>
                  {renderHighlightedSegment(before, `line-${lineIndex}-b`)}
                  <Text backgroundColor="white" color="black">
                    {cursorChar}
                  </Text>
                  {renderHighlightedSegment(after, `line-${lineIndex}-a`)}
                </Text>
              </Box>
            )
          }

          return (
            <Box key={lineIndex}>
              <Text>
                <Text color={COLORS.textDim}>
                  {lineNum} │{' '}
                </Text>
                {renderHighlightedSegment(rawLine, `line-${lineIndex}`)}
              </Text>
            </Box>
          )
        })}
      </Box>

      {/* Footer Navigation Bar */}
      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between">
        <Text color={COLORS.textMuted}>
          [Saisie directe] │ [Tab] 2 espaces │ [Ctrl+T] 🐛 Déboguer & Logs │ [Ctrl+S] 🏆 Valider │ [Échap] Retour (Niveau 2)
        </Text>
        <Text color={COLORS.textDim}>{challenge.slug}.js</Text>
      </Box>
    </Box>
  )
}
