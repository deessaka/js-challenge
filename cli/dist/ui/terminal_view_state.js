export const GLOBAL_VIEW_SHORTCUTS = [
    { input: '1', view: 'catalog', label: 'Exercices' },
    { input: '2', view: 'instructions', label: 'Consignes' },
    { input: '3', view: 'editor', label: 'Éditeur' },
    { input: '4', view: 'tests', label: 'Tests' },
    { input: '?', view: 'help', label: 'Aide' },
];
const FILTER_ORDER = ['all', 'unlocked', 'completed', 'locked'];
export function getVisibleExercises(state, exercises) {
    const query = state.searchQuery.trim().toLowerCase();
    return exercises.filter((exercise) => {
        if (state.filterMode === 'unlocked' && (!exercise.isUnlocked || exercise.isCompleted))
            return false;
        if (state.filterMode === 'completed' && !exercise.isCompleted)
            return false;
        if (state.filterMode === 'locked' && exercise.isUnlocked)
            return false;
        if (!query)
            return true;
        return (exercise.title.toLowerCase().includes(query) ||
            String(exercise.number).includes(query) ||
            exercise.slug.toLowerCase().includes(query));
    });
}
function reconcileSelection(state, exercises) {
    const visible = getVisibleExercises(state, exercises);
    const selectionIsVisible = visible.some((exercise) => exercise.id === state.selectedExerciseId);
    return {
        ...state,
        selectedExerciseId: selectionIsVisible ? state.selectedExerciseId : visible[0]?.id ?? null,
    };
}
export function createTerminalViewState(exercises = []) {
    return {
        activeView: 'catalog',
        selectedExerciseId: exercises[0]?.id ?? null,
        searchQuery: '',
        isSearching: false,
        filterMode: 'all',
    };
}
export function getSelectedExercise(state, exercises) {
    return exercises.find((exercise) => exercise.id === state.selectedExerciseId) ?? null;
}
export function terminalViewEventForKey(input, ctrl = false) {
    const shortcut = GLOBAL_VIEW_SHORTCUTS.find((candidate) => candidate.input === input);
    if (!shortcut || (shortcut.input !== '?' && !ctrl))
        return null;
    return { type: 'select-view', view: shortcut.view };
}
export function isGlobalInputOwner(state, isAuthenticating, editorOwnsInput = true) {
    return !isAuthenticating && (state.activeView !== 'editor' || !editorOwnsInput);
}
function selectVisibleOffset(state, exercises, offset) {
    const visible = getVisibleExercises(state, exercises);
    if (visible.length === 0)
        return { ...state, selectedExerciseId: null };
    const selectedIndex = visible.findIndex((exercise) => exercise.id === state.selectedExerciseId);
    const currentIndex = selectedIndex < 0 ? 0 : selectedIndex;
    const nextIndex = Math.min(visible.length - 1, Math.max(0, currentIndex + offset));
    return { ...state, selectedExerciseId: visible[nextIndex].id };
}
function canOpenView(view, exercise) {
    if (view === 'catalog' || view === 'help')
        return true;
    if (view === 'instructions')
        return exercise !== null;
    return exercise?.isUnlocked === true;
}
export function reduceTerminalViewState(state, event, exercises) {
    if (event.type === 'catalog-updated')
        return reconcileSelection(state, exercises);
    if (event.type === 'cycle-filter') {
        const currentIndex = FILTER_ORDER.indexOf(state.filterMode);
        return reconcileSelection({ ...state, filterMode: FILTER_ORDER[(currentIndex + 1) % FILTER_ORDER.length] }, exercises);
    }
    if (event.type === 'set-search-query') {
        return reconcileSelection({ ...state, searchQuery: event.query }, exercises);
    }
    if (event.type === 'set-searching') {
        return { ...state, isSearching: event.searching };
    }
    if (event.type === 'select-next')
        return selectVisibleOffset(state, exercises, 1);
    if (event.type === 'select-previous')
        return selectVisibleOffset(state, exercises, -1);
    if (event.type === 'open-selection' && state.selectedExerciseId) {
        return { ...state, activeView: 'instructions' };
    }
    if (event.type === 'select-view') {
        const selected = getSelectedExercise(state, exercises);
        if (!canOpenView(event.view, selected))
            return state;
        if (event.view === 'help' && state.activeView === 'help')
            return { ...state, activeView: 'catalog' };
        return { ...state, activeView: event.view };
    }
    if (event.type === 'back') {
        if (state.isSearching)
            return { ...state, isSearching: false };
        if (state.activeView === 'tests')
            return { ...state, activeView: 'editor' };
        if (state.activeView === 'editor')
            return { ...state, activeView: 'instructions' };
        if (state.activeView === 'instructions' || state.activeView === 'help') {
            return { ...state, activeView: 'catalog' };
        }
        if (state.searchQuery)
            return reconcileSelection({ ...state, searchQuery: '' }, exercises);
    }
    return state;
}
//# sourceMappingURL=terminal_view_state.js.map