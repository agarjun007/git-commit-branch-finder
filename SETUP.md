# Git Commit Branch Finder - Development & Installation Guide

## Project Structure

```
git-commit-branch-finder/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── gitBranchFinder.ts    # Git operations logic
│   └── webviewPanel.ts       # UI panel for displaying results
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
├── README.md                 # User documentation
├── .gitignore                # Git ignore rules
└── .vscodeignore             # Files to exclude from packaged extension
```

## Prerequisites

- **Node.js** (v14 or higher) - Download from https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - Download from https://git-scm.com/
- **VS Code** (v1.60 or higher) - Download from https://code.visualstudio.com/

## Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This installs TypeScript and other development tools.

## Step 2: Compile TypeScript

Convert TypeScript code to JavaScript:

```bash
npm run compile
```

This creates an `out/` folder with compiled `.js` files.

## Step 3: Test the Extension Locally

### Option A: Run in Debug Mode (Recommended for Development)

1. Open the project in VS Code: `code .`
2. Press `F5` (or go to Run → Start Debugging)
3. A new VS Code window opens with your extension loaded
4. Test the commands:
   - Press `Ctrl+ALT+B` (Windows/Linux) or `Cmd+Option+B` (Mac)
   - Enter a commit hash from any git repo open in that window
   - See the results!

### Option B: Manual Testing

1. Compile the code: `npm run compile`
2. Open VS Code
3. Open a git repository folder
4. Open Command Palette: `Ctrl+Shift+P`
5. Run "Extensions: Install from VSIX..."
6. Select the packaged `.vsix` file
7. Test the extension

## Step 4: Package the Extension (for Distribution)

Once ready to share, create a `.vsix` file:

```bash
npm install -g @vscode/vsce
vsce package
```

This creates `git-commit-branch-finder-1.0.0.vsix` - ready to share!

## Development Workflow

**While developing:**

```bash
# Watch TypeScript changes and auto-compile
npm run watch

# In VS Code, press F5 to reload
```

Then edit files in `src/` and the changes auto-compile.

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal

### "Cannot find git command"
- Ensure git is installed and in your system PATH
- Run `git --version` in terminal to verify

### Extension not loading
1. Check the Debug Console for errors (F5)
2. Verify all files compiled: Look for `out/` folder
3. Check that `package.json` is valid JSON

### Keyboard shortcut not working
- The keybinding only works when focused in an editor
- `When` condition in package.json: `"when": "editorTextFocus"`
- You can still use Command Palette anytime

## Publishing to VS Code Marketplace

When you're ready to publish:

1. Create a VS Code account at https://marketplace.visualstudio.com/
2. Create a publisher account
3. Update version in `package.json`
4. Package: `vsce package`
5. Publish: `vsce publish`

Detailed guide: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Key Files Explained

### `package.json`
- Defines the extension name, version, and icon
- `activationEvents`: When the extension starts
- `contributes.commands`: Available commands
- `contributes.keybindings`: Keyboard shortcuts
- `main`: Points to the compiled entry file

### `src/extension.ts`
- Entry point for the extension
- Registers commands and UI
- Calls GitBranchFinder for git operations

### `src/gitBranchFinder.ts`
- All git command execution
- Uses `child_process.execFile()` to run git commands
- Handles errors and return values

### `src/webviewPanel.ts`
- Creates the beautiful side panel UI
- Displays results with syntax highlighting
- Handles dark/light theme detection

## Git Commands Used Under the Hood

The extension uses these git commands:

```bash
# Resolve commit hash
git rev-parse <commit>

# Get commit message
git log -1 --format=%s <commit>

# Find all branches containing commit
git branch -a --contains <commit>

# Search by message
git log --all --grep=<query> --format=%H
```

## Tips for Extending

Want to add features? Here are some ideas:

1. **Show commit author and date**
   - Modify `gitBranchFinder.ts` to get additional commit info
   - Update the UI in `webviewPanel.ts`

2. **Filter by branch type (local/remote)**
   - Add buttons in the webview to toggle visibility

3. **Integration with GitHub/GitLab**
   - Fetch PR/MR information for the commit
   - Show which PR merged the commit

4. **Blame/Annotation view**
   - Show who authored the commit and when

5. **Bookmark favorite commits**
   - Store frequently-searched commits in VS Code settings

## Support

- VS Code Extension API Docs: https://code.visualstudio.com/api
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Git Documentation: https://git-scm.com/doc

---

**You're all set! Happy coding! 🎉**
