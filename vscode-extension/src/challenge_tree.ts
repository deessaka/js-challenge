import * as vscode from 'vscode'

import { ApiClient, ApiError } from './api_client'
import type { Challenge } from './types'

export class ChallengeTreeProvider implements vscode.TreeDataProvider<ChallengeTreeItem> {
  private readonly changes = new vscode.EventEmitter<void>()
  readonly onDidChangeTreeData = this.changes.event
  private challenges: Challenge[] = []
  private errorMessage: string | undefined

  constructor(private readonly api: ApiClient) {}

  refresh(): void {
    this.challenges = []
    this.errorMessage = undefined
    this.changes.fire()
  }

  async load(): Promise<void> {
    this.errorMessage = undefined
    try {
      if (!(await this.api.isAuthenticated())) {
        this.challenges = []
        this.changes.fire()
        return
      }
      const response = await this.api.listChallenges()
      this.challenges = response.data
    } catch (error) {
      this.challenges = []
      this.errorMessage = error instanceof ApiError ? error.message : 'Impossible de charger les challenges.'
    }
    this.changes.fire()
  }

  getTreeItem(item: ChallengeTreeItem): vscode.TreeItem {
    return item
  }

  async getChildren(): Promise<ChallengeTreeItem[]> {
    if (!(await this.api.isAuthenticated())) {
      return [
        new ChallengeTreeItem(
          'Connectez-vous pour voir les challenges',
          vscode.TreeItemCollapsibleState.None,
          'login'
        ),
      ]
    }

    if (this.errorMessage) {
      return [new ChallengeTreeItem(this.errorMessage, vscode.TreeItemCollapsibleState.None, 'error')]
    }

    if (!this.challenges.length) {
      await this.load()
      if (this.errorMessage) {
        return [new ChallengeTreeItem(this.errorMessage, vscode.TreeItemCollapsibleState.None, 'error')]
      }
      if (!this.challenges.length) {
        return [new ChallengeTreeItem('Aucun challenge disponible', vscode.TreeItemCollapsibleState.None, 'empty')]
      }
    }

    return this.challenges.map((challenge) => ChallengeTreeItem.fromChallenge(challenge))
  }
}

export class ChallengeTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    readonly kind: 'challenge' | 'login' | 'error' | 'empty',
    readonly challenge?: Challenge
  ) {
    super(label, collapsibleState)
    this.contextValue = kind
  }

  static fromChallenge(challenge: Challenge): ChallengeTreeItem {
    const state = challenge.isCompleted ? '✓' : challenge.isUnlocked ? '○' : '🔒'
    const item = new ChallengeTreeItem(
      `${state} ${challenge.number}. ${challenge.title}`,
      vscode.TreeItemCollapsibleState.None,
      'challenge',
      challenge
    )
    item.description = `${challenge.difficultyLabel} · ${challenge.points} pts`
    item.tooltip = challenge.description
    item.iconPath = challenge.isCompleted
      ? new vscode.ThemeIcon('pass-filled')
      : challenge.isUnlocked
        ? new vscode.ThemeIcon('circle-outline')
        : new vscode.ThemeIcon('lock')
    item.command = challenge.isUnlocked
      ? {
          command: 'jsChallenge.openChallenge',
          title: 'Ouvrir le challenge',
          arguments: [item],
        }
      : undefined
    return item
  }
}
