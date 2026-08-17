import * as vscode from 'vscode'

import { ApiClient, ApiError } from './api_client'

export class AuthService {
  constructor(private readonly api: ApiClient) {}

  async login(): Promise<void> {
    const token = await vscode.window.showInputBox({
      title: 'Connexion JS Challenge',
      prompt: 'Collez votre token API JS Challenge.',
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => (value.trim() ? undefined : 'Le token est requis.'),
    })

    if (!token) return

    try {
      const user = await this.api.loginWithToken(token.trim())
      vscode.window.showInformationMessage(`Connecté en tant que ${user.username}.`)
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Connexion impossible.'
      vscode.window.showErrorMessage(message)
    }
  }

  async logout(): Promise<void> {
    await this.api.logout()
    vscode.window.showInformationMessage('Vous êtes déconnecté de JS Challenge.')
  }
}
