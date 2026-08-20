import { render } from 'ink';
export function createTuiRenderOptions(preferences = {}) {
    return {
        alternateScreen: preferences.alternateScreen ?? true,
        kittyKeyboard: { mode: 'auto' },
        exitOnCtrlC: true,
    };
}
export async function runTui(tree, preferences = {}, renderer = render) {
    const instance = renderer(tree, createTuiRenderOptions(preferences));
    try {
        await instance.waitUntilExit();
    }
    finally {
        instance.unmount();
    }
}
//# sourceMappingURL=tui_runtime.js.map