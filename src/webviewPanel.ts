import * as vscode from 'vscode';
import { GitBranchFinder, BranchResult } from './gitBranchFinder';
export class BranchFinderPanel {
  private panel: vscode.WebviewPanel | undefined;
  private extensionUri: vscode.Uri;
  private finder = new GitBranchFinder();

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
  }

  async reveal(result: BranchResult, commitId: string) {
  if (!this.panel) {
    this.panel = vscode.window.createWebviewPanel(
      'gitCommitBranchFinder',
      'Git Commit Branch Finder',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
      }
    );

    this.panel.webview.onDidReceiveMessage(async message => {
      if (message.command === 'search') {
        const searchValue = message.text?.trim();

        if (!searchValue) {
          return;
        }

        const newResult = await this.finder.findBranchesForCommit(searchValue);

        this.reveal(newResult, searchValue);
      }

      if (message.command === 'copied') {
        vscode.window.showInformationMessage(
          `Copied: ${message.text}`
        );
      }
    });

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  this.panel.webview.html = this.getHtmlContent(result, commitId);
  this.panel.reveal();
}
  onDispose(callback: () => void) {
    if (this.panel) {
      this.panel.onDidDispose(callback);
    }
  }

  private getHtmlContent(result: BranchResult, commitId: string): string {
    const isDarkMode = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;
    const bgColor = isDarkMode ? '#1e1e1e' : '#ffffff';
    const textColor = isDarkMode ? '#e0e0e0' : '#1e1e1e';
    const accentColor = '#00d9ff';
    const successColor = '#4ade80';
    const errorColor = '#f87171';
    const borderColor = isDarkMode ? '#333333' : '#e5e7eb';
    const originalBranch = result.branches.find(b => b.isOriginal);
    const statusHtml = result.found
      ? `
        <div class="status success">
          <span class="icon">✓</span>
          <span>Found in ${result.branches.length} branch${result.branches.length !== 1 ? 'es' : ''}</span>
        </div>
      `
      : `
        <div class="status error">
          <span class="icon">✗</span>
          <span>${result.error || 'Not found'}</span>
        </div>
      `;

    const branchesHtml = result.found
      ? result.branches
          .map(branch => {
            const isRemote = branch.name.startsWith('remotes/');
            const displayName = branch.name.replace(/^remotes\//, '');
            const originalBadge = branch.isOriginal ? '<span class="original-badge">★ ORIGINAL</span>' : '';
            const originalClass = branch.isOriginal ? 'original' : '';
            return `
              <div class="branch-item ${isRemote ? 'remote' : 'local'} ${originalClass}">
                <span class="branch-icon">${isRemote ? '☁' : '⎇'}</span>
                <span class="branch-name" title="${branch.name}">${displayName}</span>
                ${originalBadge}
                <button class="copy-btn" onclick="copyToClipboard('${branch.name}')">Copy</button>
              </div>
            `;
          })
          .join('')
      : '<div class="empty-state">No branches found</div>';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Git Commit Branch Finder</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: ${bgColor};
            color: ${textColor};
            padding: 24px;
            line-height: 1.6;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
          }

          .header {
            margin-bottom: 32px;
            border-bottom: 2px solid ${borderColor};
            padding-bottom: 16px;
          }

          .header h1 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            background: linear-gradient(135deg, ${accentColor}, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .commit-info {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 12px;
          }

          .commit-badge {
            background-color: ${isDarkMode ? '#2d2d2d' : '#f3f4f6'};
            padding: 6px 12px;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            border: 1px solid ${borderColor};
            word-break: break-all;
            flex: 1;
            min-width: 150px;
          }

          .commit-message {
            color: ${isDarkMode ? '#b0b0b0' : '#666666'};
            font-size: 13px;
            margin-top: 8px;
            font-style: italic;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-weight: 500;
            font-size: 15px;
          }

          .status.success {
            background-color: ${isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(74, 222, 128, 0.05)'};
            border: 1px solid ${isDarkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.2)'};
            color: ${successColor};
          }

          .status.error {
            background-color: ${isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(248, 113, 113, 0.05)'};
            border: 1px solid ${isDarkMode ? 'rgba(248, 113, 113, 0.3)' : 'rgba(248, 113, 113, 0.2)'};
            color: ${errorColor};
          }

          .status .icon {
            font-size: 20px;
            font-weight: bold;
          }

          .branches-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .branch-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background-color: ${isDarkMode ? '#2d2d2d' : '#f9fafb'};
            border: 1px solid ${borderColor};
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .branch-item:hover {
            background-color: ${isDarkMode ? '#3a3a3a' : '#f3f4f6'};
            border-color: ${accentColor};
            transform: translateX(4px);
          }
          .branch-item.original {
            background-color: ${isDarkMode ? '#1f3a2c' : '#f0fdf4'};
            border: 2px solid ${successColor};
            box-shadow: 0 0 8px ${isDarkMode ? 'rgba(74, 222, 128, 0.2)' : 'rgba(74, 222, 128, 0.1)'};
          }

          .branch-item.original:hover {
            background-color: ${isDarkMode ? '#245a3a' : '#ecfdf5'};
            border-color: ${successColor};
          }

          .original-badge {
            background-color: ${successColor};
            color: #000;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            margin-left: auto;
          }

          .branch-item.remote .branch-icon {
            color: #3b82f6;
          }

          .branch-item.local .branch-icon {
            color: ${accentColor};
          }

          .branch-icon {
            font-size: 16px;
            min-width: 20px;
          }

          .branch-name {
            flex: 1;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            word-break: break-all;
            color: ${textColor};
          }

          .copy-btn {
            padding: 6px 12px;
            background-color: ${accentColor};
            color: #000;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .copy-btn:hover {
            background-color: #00d4ff;
            transform: scale(1.05);
          }

          .copy-btn:active {
            transform: scale(0.98);
          }

          .empty-state {
            text-align: center;
            padding: 32px 16px;
            color: ${isDarkMode ? '#808080' : '#999999'};
            font-size: 14px;
          }

          .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${isDarkMode ? '#707070' : '#999999'};
            margin-bottom: 12px;
            margin-top: 20px;
          }

          .section-title:first-of-type {
            margin-top: 0;
          }

          .local-branches, .remote-branches {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .commit-input {
            width: 100%;
            background-color: ${isDarkMode ? '#2d2d2d' : '#f3f4f6'};
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-family: 'Monaco', 'Courier New', monospace;
            outline: none;
          }

          .commit-input:focus {
            border-color: ${accentColor};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 Commit Branch Finder</h1>
            <div class="commit-info">
              <input
              id="commitInput"
              class="commit-input"
              value="${commitId}"
              placeholder="Enter commit hash or message"
            />
            </div>
            ${result.commitMessage ? `<div class="commit-message">"${result.commitMessage}"</div>` : ''}
          </div>

          ${statusHtml}

          ${
            result.found
              ? `
            ${
            originalBranch
              ? `
              <div style="margin-bottom: 24px;">
                <div class="section-title">Original Branch</div>

                <div class="branch-item ${
                  originalBranch.name.startsWith('remotes/') ? 'remote' : 'local'
                } original">

                  <span class="branch-icon">
                    ${originalBranch.name.startsWith('remotes/') ? '☁' : '⎇'}
                  </span>

                  <span class="branch-name">
                    ${originalBranch.name.replace(/^remotes\//, '')}
                  </span>

                  <span class="original-badge">★ ORIGINAL</span>

                  <button
                    class="copy-btn"
                    onclick="copyToClipboard('${originalBranch.name}')"
                  >
                    Copy
                  </button>
                </div>
              </div>
            `
              : ''
          }
            <div class="branches-container">
              ${
                result.branches.filter(b =>
                !b.name.startsWith('remotes/') &&
                !b.isOriginal
              ).length > 0
                  ? `
                <div>
                  <div class="section-title">Local Branches</div>
                  <div class="local-branches">
                    ${result.branches.filter(b =>
                    !b.name.startsWith('remotes/') &&
                    !b.isOriginal
                  )
                      .map(
                        branch =>
                          `
                      <div class="branch-item local ${branch.isOriginal ? 'original' : ''}">
                        <span class="branch-icon">⎇</span>
                        <span class="branch-name">${branch.name}</span>
                        ${branch.isOriginal ? '<span class="original-badge">★ ORIGINAL</span>' : ''}
                        <button class="copy-btn" onclick="copyToClipboard('${branch.name}')">Copy</button>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
              ${
                result.branches.filter(b => b.name.startsWith('remotes/')).length > 0
                  ? `
                <div>
                  <div class="section-title">Remote Branches</div>
                  <div class="remote-branches">
                    ${result.branches
                      .filter(b => b.name.startsWith('remotes/'))
                      .map(
                        branch =>
                          `
                      <div class="branch-item remote ${branch.isOriginal ? 'original' : ''}">
                        <span class="branch-icon">☁</span>
                        <span class="branch-name">${branch.name.replace(/^remotes\//, '')}</span>
                        ${branch.isOriginal ? '<span class="original-badge">★ ORIGINAL</span>' : ''}
                        <button class="copy-btn" onclick="copyToClipboard('${branch.name}')">Copy</button>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>

        <script>
        const vscode = acquireVsCodeApi();

        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            vscode.postMessage({
              command: 'copied',
              text
            });
          });
        }

        const input = document.getElementById('commitInput');

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            vscode.postMessage({
              command: 'search',
              text: input.value
            });
          }
        });
      </script>
      </body>
      </html>
    `;

    return html;
  }
}
