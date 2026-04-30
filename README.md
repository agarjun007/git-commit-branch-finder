# Git Commit Branch Finder

A powerful VS Code extension that instantly reveals which branch a commit belongs to. No more digging through git history!

## Features

✨ **Search by Commit Hash** — Enter a commit SHA (full or partial) and instantly see all branches containing it

🔍 **Search by Commit Message** — Can't remember the hash? Search by commit message instead

📋 **Clipboard Integration** — Paste directly from clipboard with a single keyboard shortcut

🎯 **Branch Organization** — See local and remote branches clearly separated

⚡ **Quick Copy** — Copy branch names to clipboard with a single click

🌳 **Multi-Branch Detection** — Understand when commits exist on multiple branches (e.g., after merges)

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Git Commit Branch Finder"
4. Click Install

## Usage

### Method 1: Keyboard Shortcut (Fastest)
- **Windows/Linux**: `Ctrl+ALT+B`
- **Mac**: `Cmd+Option+B`
- Paste a commit hash from clipboard and get results instantly

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Git: Find Branch for Commit"
3. Enter the commit hash or message
4. Results appear in a side panel

### Method 3: From Selection
1. Select a commit hash in the editor
2. Press `Ctrl+ALT+B` / `Cmd+Option+B`
3. See branches instantly

### Method 4: Status Bar
- Click the "Find Branch" button in the status bar (bottom right)
- Searches clipboard contents

## Examples

**Example 1: Search by Full Hash**
```
Input: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
Output: Shows all branches containing this commit
```

**Example 2: Search by Short Hash**
```
Input: a1b2c3d
Output: Works with partial hashes too!
```

**Example 3: Search by Message**
```
Input: "fix login bug"
Output: Finds commits with that message and shows their branches
```

## Output Panel

When you search, the results appear in a beautiful side panel showing:

- ✓ **Status** — Whether the commit was found
- 📍 **Commit Details** — Full hash and message
- ⎇ **Local Branches** — Branches on your machine
- ☁ **Remote Branches** — Branches on remote repositories

Each branch is clickable to copy to clipboard.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+ALT+B` / `Cmd+Option+B` | Find branch from selection or prompt |
| `Ctrl+Shift+P` → "Find Branch from Clipboard" | Search clipboard contents |

## Requirements

- VS Code 1.60+
- Git installed and available in PATH
- A git repository open in the workspace

## Common Issues

### "No workspace folder is open"
**Solution**: Open a folder containing your git repository

### "git: command not found"
**Solution**: Install git or ensure it's in your system PATH

### Commit not found
**Reasons**:
- Commit hash is incorrect
- Commit exists only in other local repositories
- Commit message search is too specific

**Try**:
- Double-check the hash
- Use a longer commit hash
- Try a simpler search term

## Performance

The extension uses native git commands and caches results, making searches extremely fast even in large repositories.

## Privacy

All processing happens locally on your machine. No data is sent anywhere.

## License

MIT

## Feedback & Contributions

Found a bug? Have a feature idea? Let me know!

---

**Made with ❤️ for developers who love git** 🚀
