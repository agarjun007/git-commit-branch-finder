# ⚡ Quick Start (5 minutes)

## 1️⃣ Prerequisites Check

Make sure you have:
- ✅ Node.js installed? → Run `node --version` in terminal
- ✅ Git installed? → Run `git --version` in terminal
- ✅ VS Code? → Download from https://code.visualstudio.com/

If you need to install Node.js, get it from https://nodejs.org/ (LTS version)

## 2️⃣ Setup the Extension

```bash
# Navigate to the project folder
cd git-commit-branch-finder

# Install dependencies
npm install
```

**Takes ~30 seconds** ⏱️

## 3️⃣ Compile & Run

```bash
# Compile TypeScript to JavaScript
npm run compile
```

Then open this folder in VS Code:
```bash
code .
```

## 4️⃣ Launch Debug Mode

Press `F5` in VS Code.

A new window opens with your extension ready to test! 🎉

## 5️⃣ Test It

In the new VS Code window:

1. Open any folder with a git repository
2. Press **`Ctrl+Shift+G`** (Windows/Linux) or **`Cmd+Shift+G`** (Mac)
3. Enter a commit hash (e.g., first 7 characters like `a1b2c3d`)
4. See which branch(es) contain that commit ✨

## 🎯 What You Just Did

- ✅ Installed the extension framework
- ✅ Compiled TypeScript code
- ✅ Launched your extension in a test environment
- ✅ Tested the branch finder functionality

## 📝 Next Steps

### Want to make changes?

1. Edit files in `src/` folder
2. Run `npm run watch` (keeps auto-compiling as you edit)
3. Press `Ctrl+R` in the test window to reload the extension

### Ready to package for others?

```bash
npm install -g @vscode/vsce
vsce package
```

Creates a `.vsix` file you can share!

### Want more details?

Read `SETUP.md` for complete development guide.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| F5 doesn't launch debug window | Make sure you're in the project root folder |
| "npm: command not found" | Install Node.js first |
| Extension doesn't appear | Press Ctrl+R to reload the test window |
| Commit not found | Make sure repo is open in the test window |

---

**Need help?** Check `README.md` for features and usage instructions.

**You're ready!** 🚀 Start exploring git commits like never before!
