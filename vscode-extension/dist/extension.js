"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));
var import_node_crypto = require("node:crypto");

// src/auth.ts
var vscode = __toESM(require("vscode"));

// src/api_client.ts
var ApiError = class extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
    this.name = "ApiError";
  }
};
var ApiClient = class {
  constructor(secrets, config) {
    this.secrets = secrets;
    this.config = config;
  }
  async getMe() {
    return this.request("/api/v1/me").then((response) => response.data);
  }
  async listChallenges() {
    return this.request("/api/v1/challenges");
  }
  async getChallenge(slug) {
    return this.request(`/api/v1/challenges/${encodeURIComponent(slug)}`).then(
      (response) => response.data
    );
  }
  async getNextChallenge() {
    return this.request("/api/v1/recommendations/next").then(
      (response) => response.data
    );
  }
  async createSubmission(input) {
    return this.request("/api/v1/submissions", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        language: "javascript",
        client: "vscode",
        clientVersion: "0.1.0"
      })
    }).then((response) => response.data);
  }
  async loginWithToken(token) {
    await this.secrets.store("jsChallenge.apiToken", token);
    try {
      return await this.getMe();
    } catch (error) {
      await this.logout();
      throw error;
    }
  }
  async logout() {
    await this.secrets.delete("jsChallenge.apiToken");
  }
  async isAuthenticated() {
    return Boolean(await this.secrets.get("jsChallenge.apiToken"));
  }
  async request(path, init = {}) {
    const baseUrl = this.config.get("apiBaseUrl", "http://localhost:3333").replace(/\/$/, "");
    const token = await this.secrets.get("jsChallenge.apiToken");
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, { ...init, headers });
    } catch (error) {
      throw new ApiError(
        "Impossible de joindre JS Challenge. V\xE9rifiez l\u2019URL de l\u2019API et votre connexion.",
        0,
        error
      );
    }
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
    if (!response.ok) {
      const message = typeof payload === "object" && payload !== null && "error" in payload ? String(payload.error) : `La requ\xEAte API a \xE9chou\xE9 (${response.status}).`;
      throw new ApiError(message, response.status, payload);
    }
    return payload;
  }
};

// src/auth.ts
var AuthService = class {
  constructor(api) {
    this.api = api;
  }
  async login() {
    const token = await vscode.window.showInputBox({
      title: "Connexion JS Challenge",
      prompt: "Collez votre token API JS Challenge.",
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => value.trim() ? void 0 : "Le token est requis."
    });
    if (!token) return;
    try {
      const user = await this.api.loginWithToken(token.trim());
      vscode.window.showInformationMessage(`Connect\xE9 en tant que ${user.username}.`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Connexion impossible.";
      vscode.window.showErrorMessage(message);
    }
  }
  async logout() {
    await this.api.logout();
    vscode.window.showInformationMessage("Vous \xEAtes d\xE9connect\xE9 de JS Challenge.");
  }
};

// src/challenge_tree.ts
var vscode2 = __toESM(require("vscode"));
var ChallengeTreeProvider = class {
  constructor(api) {
    this.api = api;
  }
  changes = new vscode2.EventEmitter();
  onDidChangeTreeData = this.changes.event;
  challenges = [];
  errorMessage;
  refresh() {
    this.challenges = [];
    this.errorMessage = void 0;
    this.changes.fire();
  }
  async load() {
    this.errorMessage = void 0;
    try {
      if (!await this.api.isAuthenticated()) {
        this.challenges = [];
        this.changes.fire();
        return;
      }
      const response = await this.api.listChallenges();
      this.challenges = response.data;
    } catch (error) {
      this.challenges = [];
      this.errorMessage = error instanceof ApiError ? error.message : "Impossible de charger les challenges.";
    }
    this.changes.fire();
  }
  getTreeItem(item) {
    return item;
  }
  async getChildren() {
    if (!await this.api.isAuthenticated()) {
      return [
        new ChallengeTreeItem(
          "Connectez-vous pour voir les challenges",
          vscode2.TreeItemCollapsibleState.None,
          "login"
        )
      ];
    }
    if (this.errorMessage) {
      return [new ChallengeTreeItem(this.errorMessage, vscode2.TreeItemCollapsibleState.None, "error")];
    }
    if (!this.challenges.length) {
      await this.load();
      if (this.errorMessage) {
        return [new ChallengeTreeItem(this.errorMessage, vscode2.TreeItemCollapsibleState.None, "error")];
      }
      if (!this.challenges.length) {
        return [new ChallengeTreeItem("Aucun challenge disponible", vscode2.TreeItemCollapsibleState.None, "empty")];
      }
    }
    return this.challenges.map((challenge) => ChallengeTreeItem.fromChallenge(challenge));
  }
};
var ChallengeTreeItem = class _ChallengeTreeItem extends vscode2.TreeItem {
  constructor(label, collapsibleState, kind, challenge) {
    super(label, collapsibleState);
    this.kind = kind;
    this.challenge = challenge;
    this.contextValue = kind;
  }
  static fromChallenge(challenge) {
    const state = challenge.isCompleted ? "\u2713" : challenge.isUnlocked ? "\u25CB" : "\u{1F512}";
    const item = new _ChallengeTreeItem(
      `${state} ${challenge.number}. ${challenge.title}`,
      vscode2.TreeItemCollapsibleState.None,
      "challenge",
      challenge
    );
    item.description = `${challenge.difficultyLabel} \xB7 ${challenge.points} pts`;
    item.tooltip = challenge.description;
    item.iconPath = challenge.isCompleted ? new vscode2.ThemeIcon("pass-filled") : challenge.isUnlocked ? new vscode2.ThemeIcon("circle-outline") : new vscode2.ThemeIcon("lock");
    item.command = challenge.isUnlocked ? {
      command: "jsChallenge.openChallenge",
      title: "Ouvrir le challenge",
      arguments: [item]
    } : void 0;
    return item;
  }
};

// src/extension.ts
var ACTIVE_CHALLENGE_KEY = "jsChallenge.activeChallengeId";
function activate(context) {
  const config = vscode3.workspace.getConfiguration("jsChallenge");
  const api = new ApiClient(context.secrets, config);
  const auth = new AuthService(api);
  const tree = new ChallengeTreeProvider(api);
  const output = vscode3.window.createOutputChannel("JS Challenge");
  context.subscriptions.push(
    output,
    vscode3.window.registerTreeDataProvider("jsChallenge.challenges", tree),
    vscode3.commands.registerCommand("jsChallenge.login", async () => {
      await auth.login();
      await tree.load();
    }),
    vscode3.commands.registerCommand("jsChallenge.logout", async () => {
      await auth.logout();
      tree.refresh();
    }),
    vscode3.commands.registerCommand("jsChallenge.refreshChallenges", async () => {
      await tree.load();
    }),
    vscode3.commands.registerCommand("jsChallenge.openChallenge", async (item) => {
      await openChallenge(context, api, item);
    }),
    vscode3.commands.registerCommand("jsChallenge.submitSolution", async () => {
      await submitSolution(context, api, output);
      await tree.load();
    }),
    vscode3.commands.registerCommand("jsChallenge.openDashboard", async () => {
      const dashboardUrl = config.get("dashboardUrl", "http://localhost:3333/home");
      await vscode3.env.openExternal(vscode3.Uri.parse(dashboardUrl));
    })
  );
  void tree.load();
}
function deactivate() {
}
async function openChallenge(context, api, item) {
  const challenge = item?.challenge;
  if (!challenge) {
    vscode3.window.showInformationMessage("S\xE9lectionnez un challenge disponible dans la vue JS Challenge.");
    return;
  }
  const workspaceFolder = vscode3.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode3.window.showErrorMessage("Ouvrez un dossier dans VS Code avant de cr\xE9er un fichier challenge.");
    return;
  }
  let detail = challenge;
  if (!detail.starterCode) {
    detail = await api.getChallenge(challenge.slug);
  }
  const fileUri = vscode3.Uri.joinPath(workspaceFolder.uri, `${detail.slug}.js`);
  try {
    await vscode3.workspace.fs.stat(fileUri);
  } catch {
    const starterCode = detail.starterCode || `// ${detail.title}

`;
    await vscode3.workspace.fs.writeFile(fileUri, Buffer.from(starterCode, "utf8"));
  }
  await context.workspaceState.update(ACTIVE_CHALLENGE_KEY, detail.id);
  const document = await vscode3.workspace.openTextDocument(fileUri);
  await vscode3.window.showTextDocument(document, { preview: false });
}
async function submitSolution(context, api, output) {
  const editor = vscode3.window.activeTextEditor;
  if (!editor) {
    vscode3.window.showInformationMessage("Ouvrez un fichier challenge avant de soumettre une solution.");
    return;
  }
  const challengeId = context.workspaceState.get(ACTIVE_CHALLENGE_KEY);
  if (!challengeId) {
    vscode3.window.showInformationMessage("Ouvrez d\u2019abord un challenge depuis la vue JS Challenge.");
    return;
  }
  try {
    const submission = await vscode3.window.withProgress(
      {
        location: vscode3.ProgressLocation.Notification,
        title: "Validation de la solution JS Challenge",
        cancellable: false
      },
      () => api.createSubmission({
        challengeId,
        code: editor.document.getText(),
        idempotencyKey: (0, import_node_crypto.randomUUID)()
      })
    );
    output.clear();
    output.appendLine(`Soumission #${submission.id}`);
    output.appendLine(`Statut : ${submission.status}`);
    for (const result of submission.results) {
      output.appendLine(`${result.passed ? "PASS" : "FAIL"} \u2014 ${result.description}`);
      if (result.error) output.appendLine(`  ${result.error}`);
    }
    output.show(true);
    if (submission.accepted) {
      vscode3.window.showInformationMessage("Solution valid\xE9e. Progression synchronis\xE9e.");
    } else {
      vscode3.window.showWarningMessage("Solution non valid\xE9e. Consultez la sortie JS Challenge.");
    }
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "La soumission a \xE9chou\xE9.";
    vscode3.window.showErrorMessage(message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
