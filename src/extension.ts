import * as vscode from 'vscode';
import { GitBranchFinder } from './gitBranchFinder';
import { BranchFinderPanel } from './webviewPanel';

let gitFinder: GitBranchFinder;
let panel: BranchFinderPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  gitFinder = new GitBranchFinder();

  // Command 1: Find branch from selected text or prompt
  const findBranchCommand = vscode.commands.registerCommand(
    'git-commit-branch-finder.findBranch',
    async () => {
      const editor = vscode.window.activeTextEditor;
      let commitId = '';

      // Try to get selected text first
      if (editor && !editor.selection.isEmpty) {
        commitId = editor.document.getText(editor.selection).trim();
      }

      // If no selection, prompt user
      if (!commitId) {
        commitId = await vscode.window.showInputBox({
          placeHolder: 'Enter commit hash (e.g., abc123def) or part of commit message',
          prompt: 'Find which branch contains this commit'
        }) || '';
      }

      if (!commitId) {
        return;
      }

      await findAndDisplayBranch(context, commitId);
    }
  );

  // Command 2: Find branch from clipboard
  const findFromClipboardCommand = vscode.commands.registerCommand(
    'git-commit-branch-finder.findBranchFromClipboard',
    async () => {
      const clipboardText = await vscode.env.clipboard.readText();
      if (!clipboardText.trim()) {
        vscode.window.showWarningMessage('Clipboard is empty');
        return;
      }
      await findAndDisplayBranch(context, clipboardText.trim());
    }
  );

  context.subscriptions.push(findBranchCommand, findFromClipboardCommand);

  // Status bar button for quick access
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.command = 'git-commit-branch-finder.findBranchFromClipboard';
  statusBar.text = '$(git-branch) Find Branch';
  statusBar.tooltip = 'Find which branch a commit belongs to (from clipboard)';
  statusBar.show();
  context.subscriptions.push(statusBar);
}

async function findAndDisplayBranch(context: vscode.ExtensionContext, commitId: string) {
  try {
    vscode.window.showInformationMessage(`Searching for commit: ${commitId.substring(0, 10)}...`);

    const result = await gitFinder.findBranchesForCommit(commitId);

    if (!panel) {
      panel = new BranchFinderPanel(context.extensionUri);
      panel.onDispose(() => {
        panel = undefined;
      });
    }

    panel.reveal(result, commitId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error: ${errorMessage}`);
  }
}

export function deactivate() {}
