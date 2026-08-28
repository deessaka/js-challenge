function shortcut(id, keys, label, description, bindings, view) {
    return { id, keys, label, description, bindings, view };
}
export const TERMINAL_SHORTCUTS = {
    'view-catalog': shortcut('view-catalog', 'Ctrl+1', 'Exercices', 'Ouvrir le catalogue public', [{ input: '1', ctrl: true }], 'catalog'),
    'view-instructions': shortcut('view-instructions', 'Ctrl+2', 'Consignes', 'Ouvrir les consignes de l’exercice', [{ input: '2', ctrl: true }], 'instructions'),
    'view-editor': shortcut('view-editor', 'Ctrl+3', 'Éditeur', 'Ouvrir l’éditeur intégré', [{ input: '3', ctrl: true }], 'editor'),
    'view-tests': shortcut('view-tests', 'Ctrl+4', 'Tests', 'Ouvrir les résultats détaillés', [{ input: '4', ctrl: true }], 'tests'),
    'view-help': shortcut('view-help', '?', 'Aide', 'Afficher ou fermer cette aide', [{ input: '?', ctrl: false }], 'help'),
    'quit': shortcut('quit', 'Ctrl+C / Ctrl+Q', 'Quitter', 'Quitter Codojo proprement', [
        { input: 'c', ctrl: true },
        { input: 'q', ctrl: true },
    ]),
    'login-submit': shortcut('login-submit', 'Entrée', 'Valider', 'Valider le token API', [
        { key: 'return' },
    ]),
    'login-quit': shortcut('login-quit', 'Ctrl+C', 'Quitter', 'Quitter pendant l’authentification', [{ input: 'c', ctrl: true }]),
    'back': shortcut('back', 'Échap / jj', 'Revenir', 'Revenir à la vue terminal précédente ou au Mode Normal', [{ key: 'escape' }]),
    'catalog-move': shortcut('catalog-move', '↑ / ↓ / j / k', 'Naviguer', 'Parcourir les exercices visibles', [
        { key: 'upArrow' },
        { key: 'downArrow' },
        { input: 'j', ctrl: false },
        { input: 'k', ctrl: false },
    ]),
    'catalog-search': shortcut('catalog-search', '/ / Ctrl+F', 'Chercher', 'Lancer la recherche dans le catalogue public', [
        { input: '/', ctrl: false },
        { input: 'f', ctrl: true },
    ]),
    'catalog-search-close': shortcut('catalog-search-close', 'Entrée / Échap', 'Fermer la recherche', 'Terminer la saisie de la recherche', [{ key: 'return' }, { key: 'escape' }]),
    'catalog-search-delete': shortcut('catalog-search-delete', 'Retour arrière / Suppr', 'Corriger la recherche', 'Effacer la fin de la recherche', [{ key: 'backspace' }, { key: 'delete' }]),
    'catalog-filter': shortcut('catalog-filter', 'f', 'Filtrer', 'Changer le filtre des exercices', [{ input: 'f', ctrl: false }]),
    'catalog-open': shortcut('catalog-open', 'Entrée', 'Sélectionner', 'Ouvrir les consignes de l’exercice sélectionné', [{ key: 'return' }]),
    'instructions-edit': shortcut('instructions-edit', 'Entrée / e', 'Éditer', 'Ouvrir l’éditeur intégré', [{ key: 'return' }, { input: 'e', ctrl: false }]),
    'editor-save': shortcut('editor-save', 'Ctrl+S', 'Sauvegarder', 'Sauvegarder durablement sans soumettre', [{ input: 's', ctrl: true }]),
    'editor-test': shortcut('editor-test', 'Ctrl+T', 'Debug', 'Sauvegarder puis exécuter la console de debug', [{ input: 't', ctrl: true }]),
    'editor-submit': shortcut('editor-submit', 'Ctrl+E', 'Soumettre', 'Sauvegarder puis soumettre officiellement', [
        { input: 'e', ctrl: true },
        // Keep the ADR-0004 Ctrl+Enter contract working on Kitty-compatible terminals.
        { key: 'return', ctrl: true },
    ]),
    'editor-tab': shortcut('editor-tab', 'Tab', 'Indenter', 'Insérer deux espaces en Mode Insertion', [{ key: 'tab' }]),
    'editor-line-break': shortcut('editor-line-break', 'Entrée', 'Nouvelle ligne', 'Insérer une nouvelle ligne en Mode Insertion', [{ key: 'return' }]),
    'editor-back': shortcut('editor-back', 'Ctrl+B', 'Fermer (Retour)', 'Fermer l\'éditeur et revenir au catalogue', [{ input: 'b', ctrl: true }]),
    'editor-delete': shortcut('editor-delete', 'Retour arrière / Suppr', 'Supprimer', 'Supprimer un graphème en Mode Insertion', [{ key: 'backspace' }, { key: 'delete' }]),
    'editor-arrows': shortcut('editor-arrows', '↑ / ↓ / ← / →', 'Déplacer', 'Déplacer le curseur sur les lignes visuelles wrappées', [{ key: 'upArrow' }, { key: 'downArrow' }, { key: 'leftArrow' }, { key: 'rightArrow' }]),
    'vim-logical-moves': shortcut('vim-logical-moves', 'h/j/k/l · w/b · 0/$ · gg/G', 'Mouvements Vim', 'Déplacer le curseur par caractère, ligne logique, mot ou document', []),
    'vim-visual-moves': shortcut('vim-visual-moves', 'gj/gk', 'Wrapping Vim', 'Se déplacer entre les lignes visuelles wrappées', []),
    'vim-insert': shortcut('vim-insert', 'i/I · a/A · o/O', 'Mode Insertion', 'Entrer en Mode Insertion à la position choisie', []),
    'vim-edit': shortcut('vim-edit', 'x/r · dd/dw/d$ · cc/cw/c$', 'Éditer en Mode Normal', 'Remplacer, supprimer ou modifier du texte', []),
    'vim-history': shortcut('vim-history', 'u / Ctrl+R', 'Annuler / rétablir', 'Parcourir l’historique des transactions', [
        { input: 'u', ctrl: false },
        { input: 'r', ctrl: true },
    ]),
};
const GLOBAL_VIEW_IDS = [
    'view-catalog',
    'view-instructions',
    'view-editor',
    'view-tests',
    'view-help',
];
export const GLOBAL_VIEW_SHORTCUTS = GLOBAL_VIEW_IDS.map((id) => {
    const definition = TERMINAL_SHORTCUTS[id];
    return {
        id,
        view: definition.view,
        keys: definition.keys,
        label: definition.label,
    };
});
export const HELP_SHORTCUT_GROUPS = [
    {
        title: 'NAVIGATION GLOBALE',
        shortcuts: [
            'view-catalog',
            'view-instructions',
            'view-editor',
            'view-tests',
            'view-help',
            'back',
            'quit',
        ],
    },
    {
        title: 'AUTHENTIFICATION',
        shortcuts: ['login-submit', 'login-quit'],
    },
    {
        title: 'CATALOGUE PUBLIC & CONSIGNES',
        shortcuts: [
            'catalog-move',
            'catalog-search',
            'catalog-search-close',
            'catalog-search-delete',
            'catalog-filter',
            'catalog-open',
            'instructions-edit',
        ],
    },
    {
        title: 'ÉDITEUR INTÉGRÉ',
        shortcuts: [
            'editor-back',
            'editor-save',
            'editor-test',
            'editor-submit',
            'editor-tab',
            'editor-line-break',
            'editor-delete',
            'editor-arrows',
        ],
    },
    {
        title: 'MODE NORMAL VIM',
        shortcuts: ['vim-logical-moves', 'vim-visual-moves', 'vim-insert', 'vim-edit', 'vim-history'],
    },
];
export function matchesShortcut(id, input, key) {
    return TERMINAL_SHORTCUTS[id].bindings.some((binding) => {
        if (binding.input !== undefined && binding.input !== input) {
            return false;
        }
        if (binding.key !== undefined && key[binding.key] !== true)
            return false;
        if (Boolean(key.ctrl) !== Boolean(binding.ctrl))
            return false;
        if (Boolean(key.meta) !== Boolean(binding.meta))
            return false;
        return true;
    });
}
export function shortcutHint(id) {
    const definition = TERMINAL_SHORTCUTS[id];
    return `[${definition.keys}] ${definition.label}`;
}
export function shortcutKeys(id) {
    return TERMINAL_SHORTCUTS[id].keys;
}
export function shortcutHints(ids) {
    return ids.map(shortcutHint).join(' │ ');
}
//# sourceMappingURL=shortcut_catalog.js.map