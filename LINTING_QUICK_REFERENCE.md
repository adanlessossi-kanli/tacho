# Linting & Prettier - Quick Reference

## 🚀 One-Liner Setup

```bash
# Backend
cd backend && npm install && npm run lint:fix && npm run format

# Mobile App
npm install && npm run lint:fix && npm run format

# Web Dashboard
cd web-dashboard && npm install && npm run lint:fix && npm run format
```

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | Check for errors |
| `npm run lint:fix` | Fix errors automatically |
| `npm run format` | Format code |
| `npm run lint:fix && npm run format` | Fix + Format (recommended) |

## 🎯 Before Committing

```bash
npm run lint:fix && npm run format && npm run lint
```

## 📁 Configuration Files

| File | Purpose |
|------|---------|
| `.eslintrc.json` | ESLint rules |
| `.prettierrc.json` | Prettier formatting |

## ⚙️ Prettier Rules

- **Semicolons:** Yes
- **Quotes:** Single
- **Line Width:** 100 chars
- **Indent:** 2 spaces
- **Trailing Commas:** ES5

## 🔍 ESLint Rules

- No unused variables (except `_` prefix)
- React/React Hooks rules
- TypeScript rules (backend)
- Recommended ESLint rules

## 💻 IDE Setup (VS Code)

1. Install ESLint extension
2. Install Prettier extension
3. Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🐛 Common Fixes

| Error | Fix |
|-------|-----|
| Line too long | `npm run format` |
| Missing semicolon | `npm run format` |
| Unused variable | Remove or prefix `_` |
| Wrong quotes | `npm run format` |
| Bad indentation | `npm run format` |

## 📚 Full Documentation

- `LINTING.md` - Comprehensive guide
- `LINTING_SETUP.md` - Setup instructions
- `LINTING_SUMMARY.txt` - Complete summary

## ✅ Status

- ✅ ESLint configured (all components)
- ✅ Prettier configured (all components)
- ✅ NPM scripts added
- ✅ Dependencies configured
- ✅ Ready to use

---

**That's it! You're ready to lint and format.** 🎉
