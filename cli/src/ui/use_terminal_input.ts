import { useInput } from 'ink'
import type { Challenge as Exercise } from '../types.js'
import {
  isGlobalInputOwner,
  terminalViewEventForKey,
  type TerminalViewEvent,
  type TerminalViewState,
} from './terminal_view_state.js'

interface TerminalInputOptions {
  state: TerminalViewState
  isAuthenticating: boolean
  editorOwnsInput: boolean
  selectedExercise: Exercise | null
  dispatch: (event: TerminalViewEvent) => void
  exit: () => void
  runTest: (exercise: Exercise) => void
  submit: (exercise: Exercise) => void
  toggleWatch: () => void
}

export function useTerminalInput({
  state,
  isAuthenticating,
  editorOwnsInput,
  selectedExercise,
  dispatch,
  exit,
  runTest,
  submit,
  toggleWatch,
}: TerminalInputOptions): void {
  useInput(
    (input, key) => {
      if (key.ctrl && (input === 'c' || input === 'q')) {
        exit()
        return
      }

      const viewEvent = terminalViewEventForKey(input === '\x1bOP' ? '?' : input, key.ctrl)
      if (viewEvent && !(state.isSearching && input === '?')) {
        dispatch(viewEvent)
        return
      }

      if (state.isSearching) {
        if (key.return || key.escape) {
          dispatch({ type: 'set-searching', searching: false })
          return
        }
        if (key.backspace || key.delete) {
          dispatch({ type: 'set-search-query', query: state.searchQuery.slice(0, -1) })
          return
        }
        if (input) {
          dispatch({ type: 'set-search-query', query: state.searchQuery + input })
          return
        }
      }

      if (input === '/' && state.activeView === 'catalog') {
        dispatch({ type: 'set-searching', searching: true })
        return
      }

      if (input === 'f' && state.activeView === 'catalog') {
        dispatch({ type: 'cycle-filter' })
        return
      }

      if (state.activeView === 'catalog') {
        if (key.upArrow || input === 'k') {
          dispatch({ type: 'select-previous' })
          return
        }
        if (key.downArrow || input === 'j') {
          dispatch({ type: 'select-next' })
          return
        }
        if (key.return) {
          dispatch({ type: 'open-selection' })
          return
        }
      }

      if (state.activeView === 'instructions' && (key.return || input === 'e')) {
        dispatch({ type: 'select-view', view: 'editor' })
        return
      }

      if (selectedExercise?.isUnlocked) {
        if (key.ctrl && input === 's') return
        if (input === 't' || input === 'r') {
          runTest(selectedExercise)
          return
        }
        if (input === 's') {
          submit(selectedExercise)
          return
        }
        if (input === 'w') {
          toggleWatch()
          dispatch({ type: 'select-view', view: 'tests' })
          return
        }
      }

      if (key.escape) dispatch({ type: 'back' })
    },
    { isActive: isGlobalInputOwner(state, isAuthenticating, editorOwnsInput) }
  )
}
