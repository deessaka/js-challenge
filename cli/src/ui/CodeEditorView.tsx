import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Text, useInput, usePaste } from 'ink'

import {
  createEditorState,
  reduceEditor,
  type EditorCommand,
  type EditorEffect,
} from '../editor_engine.js'
import type { Challenge } from '../types.js'
import { graphemeIndexToTerminalColumn, graphemeSlice } from '../unicode_text.js'
import { editorEventFromInk } from './editor_input.js'
import { COLORS } from './theme.js'

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
  const [editor, setEditor] = useState(() => createEditorState(initialCode))
  const [scrollRow, setScrollRow] = useState(0)
  const [isSaved, setIsSaved] = useState(true)
  const [inputNotice, setInputNotice] = useState<string | null>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentCodeRef = useRef(initialCode)

  useEffect(() => {
    const next = createEditorState(initialCode)
    setEditor(next)
    setScrollRow(0)
    setIsSaved(true)
    currentCodeRef.current = initialCode
    // `initialCode` is echoed after autosave; only a different exercise starts a new buffer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (editor.cursor.row < scrollRow) {
      setScrollRow(editor.cursor.row)
    } else if (editor.cursor.row >= scrollRow + visibleLinesCount) {
      setScrollRow(editor.cursor.row - visibleLinesCount + 1)
    }
  }, [editor.cursor.row, scrollRow, visibleLinesCount])

  const scheduleSave = useCallback(
    (code: string) => {
      currentCodeRef.current = code
      setIsSaved(false)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        void onSaveCode(code).then(() => setIsSaved(true))
      }, 300)
    },
    [onSaveCode]
  )

  const runEffects = useCallback(
    (effects: readonly EditorEffect[]) => {
      for (const effect of effects) {
        if (effect.type === 'document-changed') scheduleSave(effect.text)
      }
    },
    [scheduleSave]
  )

  const dispatch = useCallback(
    (command: EditorCommand) => {
      setEditor((current) => {
        const update = reduceEditor(current, command)
        runEffects(update.effects)
        return update.state
      })
    },
    [runEffects]
  )

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    await onSaveCode(currentCodeRef.current)
    setIsSaved(true)
  }, [onSaveCode])

  useInput((input, key) => {
    setInputNotice(null)
    if (key.ctrl && input === 't') {
      void flushSave().then(() => onTestLocally(currentCodeRef.current))
      return
    }
    if (key.ctrl && input === 's') {
      void flushSave().then(() => onSubmitSolution(currentCodeRef.current))
      return
    }

    if (!challenge.isUnlocked) {
      if (key.escape) onBack()
      return
    }

    if (editor.mode === 'normal' && editor.pendingNormal === null && key.escape) {
      void flushSave().then(onBack)
      return
    }

    if (editor.mode === 'insert' && key.tab) {
      dispatch({ type: 'insert-text', text: '  ' })
      return
    }

    const event = editorEventFromInk(input, key, editor.mode)
    if (event) dispatch(event)
  })

  usePaste(
    () => {
      setInputNotice('Collage désactivé — saisissez le code dans l’éditeur.')
    },
    { isActive: challenge.isUnlocked }
  )

  const visibleLines = useMemo(
    () => editor.lines.slice(scrollRow, scrollRow + visibleLinesCount),
    [editor.lines, scrollRow, visibleLinesCount]
  )

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.borderFocus}>
      <Box justifyContent="space-between" paddingX={1}>
        <Text color={COLORS.primary} bold>
          💻 ÉDITEUR — {challenge.title}
        </Text>
        <Text color={isSaved ? COLORS.success : COLORS.warning}>
          {isSaved ? '✓ Enregistré' : '● Écriture…'}
        </Text>
      </Box>

      <Box flexDirection="column" paddingX={1} minHeight={visibleLinesCount}>
        {visibleLines.map((line, visibleIndex) => {
          const row = scrollRow + visibleIndex
          const selected = row === editor.cursor.row
          return (
            <Box key={row}>
              <Text color={COLORS.textDim}>{String(row + 1).padStart(3, ' ')} │ </Text>
              {selected ? (
                renderCursorLine(line, editor.cursor.grapheme)
              ) : (
                <Text>{line || ' '}</Text>
              )}
            </Box>
          )
        })}
      </Box>

      <Box justifyContent="space-between" paddingX={1}>
        {inputNotice ? (
          <Text color={COLORS.warning}>{inputNotice}</Text>
        ) : (
          <Text color={modeColor(editor.mode)} bold>
            -- {modeLabel(editor.mode)}
            {editor.pendingNormal ? ` (${editor.pendingNormal})` : ''} --
          </Text>
        )}
        <Text color={COLORS.textMuted}>
          {editor.cursor.row + 1}:
          {graphemeIndexToTerminalColumn(
            editor.lines[editor.cursor.row] ?? '',
            editor.cursor.grapheme
          ) + 1}{' '}
          │ Ctrl+T tester │ Ctrl+S soumettre
        </Text>
      </Box>
    </Box>
  )
}

function modeLabel(mode: 'normal' | 'insert' | 'replace'): string {
  if (mode === 'insert') return 'INSERTION'
  if (mode === 'replace') return 'REMPLACEMENT'
  return 'NORMAL'
}

function modeColor(mode: 'normal' | 'insert' | 'replace'): string {
  if (mode === 'insert') return COLORS.success
  if (mode === 'replace') return COLORS.warning
  return COLORS.primary
}

function renderCursorLine(line: string, grapheme: number): React.ReactNode {
  const before = graphemeSlice(line, 0, grapheme)
  const cursor = graphemeSlice(line, grapheme, grapheme + 1) || ' '
  const after = graphemeSlice(line, grapheme + 1)
  return (
    <Text>
      {before}
      <Text inverse>{cursor}</Text>
      {after}
    </Text>
  )
}
