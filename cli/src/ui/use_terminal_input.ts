import { useInput } from 'ink'
import { matchesShortcut } from './shortcut_catalog.js'
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
  canAdvanceToNextExercise?: boolean
  dispatch: (event: TerminalViewEvent) => void
  exit: () => void
}

export function useTerminalInput({
  state,
  isAuthenticating,
  editorOwnsInput,
  canAdvanceToNextExercise = false,
  dispatch,
  exit,
}: TerminalInputOptions): void {
  useInput(
    (input, key) => {
      if (matchesShortcut('quit', input, key)) {
        exit()
        return
      }

      const viewEvent = terminalViewEventForKey(input, key.ctrl)
      if (viewEvent) {
        dispatch(viewEvent)
        return
      }

      if (state.activeView === 'catalog' && matchesShortcut('catalog-search', input, key)) {
        dispatch({ type: 'set-searching', searching: true })
        return
      }

      if (state.isSearching) {
        if (matchesShortcut('catalog-search-close', input, key)) {
          dispatch({ type: 'set-searching', searching: false })
          return
        }
        if (matchesShortcut('catalog-search-delete', input, key)) {
          dispatch({ type: 'set-search-query', query: state.searchQuery.slice(0, -1) })
          return
        }
        if (input && !/\p{Cc}/u.test(input) && (!key.ctrl || key.meta)) {
          dispatch({ type: 'set-search-query', query: state.searchQuery + input })
          return
        }
      }

      if (state.activeView === 'catalog' && matchesShortcut('catalog-filter', input, key)) {
        dispatch({ type: 'cycle-filter' })
        return
      }

      if (state.activeView === 'catalog') {
        if (matchesShortcut('catalog-move', input, key) && (key.upArrow || input === 'k')) {
          dispatch({ type: 'select-previous' })
          return
        }
        if (matchesShortcut('catalog-move', input, key) && (key.downArrow || input === 'j')) {
          dispatch({ type: 'select-next' })
          return
        }
        if (matchesShortcut('catalog-open', input, key)) {
          dispatch({ type: 'open-selection' })
          return
        }
      }

      if (state.activeView === 'instructions' && matchesShortcut('instructions-edit', input, key)) {
        dispatch({ type: 'select-view', view: 'editor' })
        return
      }

      if (
        state.activeView === 'tests' &&
        canAdvanceToNextExercise &&
        matchesShortcut('tests-next', input, key)
      ) {
        dispatch({ type: 'goto-next-exercise' })
        return
      }

      if (matchesShortcut('back', input, key)) dispatch({ type: 'back' })
    },
    { isActive: isGlobalInputOwner(state, isAuthenticating, editorOwnsInput) }
  )
}
