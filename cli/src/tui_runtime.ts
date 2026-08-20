import { render, type RenderOptions } from 'ink'
import type { ReactNode } from 'react'

export interface TuiPreferences {
  alternateScreen?: boolean
}

export interface TuiInstance {
  waitUntilExit: () => Promise<unknown>
  unmount: () => void
}

export type TuiRenderer = (tree: ReactNode, options: RenderOptions) => TuiInstance

export function createTuiRenderOptions(preferences: TuiPreferences = {}): RenderOptions {
  return {
    alternateScreen: preferences.alternateScreen ?? true,
    kittyKeyboard: { mode: 'auto' },
    exitOnCtrlC: true,
  }
}

export async function runTui(
  tree: ReactNode,
  preferences: TuiPreferences = {},
  renderer: TuiRenderer = render
): Promise<void> {
  const instance = renderer(tree, createTuiRenderOptions(preferences))

  try {
    await instance.waitUntilExit()
  } finally {
    instance.unmount()
  }
}
