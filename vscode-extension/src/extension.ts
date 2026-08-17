import * as vscode from 'vscode'
import { randomUUID } from 'node:crypto'

import { AuthService } from './auth'
import { ApiClient, ApiError } from './api_client'
import { ChallengeTreeItem, ChallengeTreeProvider } from './challenge_tree'

const ACTIVE_CHALLENGE_KEY = 'jsChallenge.activeChallengeId'

export function activate(context: vscode.ExtensionContext): void {
  const config = vscode.workspace.getConfiguration('jsChallenge')
  const api = new ApiClient(context.secrets, config)
  const auth = new AuthService(api)
  const tree = new ChallengeTreeProvider(api)
  const output = vscode.window.createOutputChannel('JS Challenge')

  context.subscriptions.push(
    output,
    vscode.window.registerTreeDataProvider('jsChallenge.challenges', tree),
    vscode.commands.registerCommand('jsChallenge.login', async () => {
      await auth.login()
      await tree.load()
    }),
    vscode.commands.registerCommand('jsChallenge.logout', async () => {
      await auth.logout()
      tree.refresh()
    }),
    vscode.commands.registerCommand('jsChallenge.refreshChallenges', async () => {
      await tree.load()
    }),
    vscode.commands.registerCommand('jsChallenge.openChallenge', async (item?: ChallengeTreeItem) => {
      await openChallenge(context, api, item)
    }),
    vscode.commands.registerCommand('jsChallenge.submitSolution', async () => {
      await submitSolution(context, api, output)
      await tree.load()
    }),
    vscode.commands.registerCommand('jsChallenge.openDashboard', async () => {
      const dashboardUrl = config.get<string>('dashboardUrl', 'http://localhost:3333/home')
      await vscode.env.openExternal(vscode.Uri.parse(dashboardUrl))
    })
  )

  void tree.load()
}

export function deactivate(): void {}

async function openChallenge(
  context: vscode.ExtensionContext,
  api: ApiClient,
  item?: ChallengeTreeItem
): Promise<void> {
  const challenge = item?.challenge
  if (!challenge) {
    vscode.window.showInformationMessage('Sélectionnez un challenge disponible dans la vue JS Challenge.')
    return
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Ouvrez un dossier dans VS Code avant de créer un fichier challenge.')
    return
  }

  let detail = challenge
  if (!detail.starterCode) {
    detail = await api.getChallenge(challenge.slug)
  }

  const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, `${detail.slug}.js`)
  try {
    await vscode.workspace.fs.stat(fileUri)
  } catch {
    const starterCode = detail.starterCode || `// ${detail.title}\n\n`
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(starterCode, 'utf8'))
  }

  await context.workspaceState.update(ACTIVE_CHALLENGE_KEY, detail.id)
  const document = await vscode.workspace.openTextDocument(fileUri)
  await vscode.window.showTextDocument(document, { preview: false })
}

async function submitSolution(
  context: vscode.ExtensionContext,
  api: ApiClient,
  output: vscode.OutputChannel
): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showInformationMessage('Ouvrez un fichier challenge avant de soumettre une solution.')
    return
  }

  const challengeId = context.workspaceState.get<string>(ACTIVE_CHALLENGE_KEY)
  if (!challengeId) {
    vscode.window.showInformationMessage('Ouvrez d’abord un challenge depuis la vue JS Challenge.')
    return
  }

  try {
    const submission = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Validation de la solution JS Challenge',
        cancellable: false,
      },
      () =>
        api.createSubmission({
          challengeId,
          code: editor.document.getText(),
          idempotencyKey: randomUUID(),
        })
    )

    output.clear()
    output.appendLine(`Soumission #${submission.id}`)
    output.appendLine(`Statut : ${submission.status}`)
    for (const result of submission.results) {
      output.appendLine(`${result.passed ? 'PASS' : 'FAIL'} — ${result.description}`)
      if (result.error) output.appendLine(`  ${result.error}`)
    }
    output.show(true)

    if (submission.accepted) {
      vscode.window.showInformationMessage('Solution validée. Progression synchronisée.')
    } else {
      vscode.window.showWarningMessage('Solution non validée. Consultez la sortie JS Challenge.')
    }
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'La soumission a échoué.'
    vscode.window.showErrorMessage(message)
  }
}
