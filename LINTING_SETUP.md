# Linting & Prettier Setup - Complete ✅

## What Was Added

### ESLint Configuration
- **Backend:** `.eslintrc.json` - TypeScript linting rules
- **Mobile App:** `.eslintrc.json` - React Native linting rules
- **Web Dashboard:** `.eslintrc.json` - React linting rules

### Prettier Configuration
- **Backend:** `.prettierrc.json` - Code formatting rules
- **Mobile App:** `.prettierrc.json` - Code formatting rules
- **Web Dashboard:** `.prettierrc.json` - Code formatting rules

### NPM Scripts
All three components now have:
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier

### Dependencies Added

**Backend:**
```json
"eslint": "^8.50.0",
"@typescript-eslint/eslint-plugin": "^6.7.0",
"@typescript-eslint/parser": "^6.7.0",
"prettier": "^3.0.3"
```

**Mobile App:**
```json
"eslint": "^8.50.0",
"eslint-plugin-react": "^7.33.2",
"eslint-plugin-react-hooks": "^4.6.0",
"@babel/eslint-parser": "^7.23.0",
"prettier": "^3.0.3"
```

**Web Dashboard:**
```json
"eslint": "^8.50.0",
"eslint-plugin-react": "^7.33.2",
"eslint-plugin-react-hooks": "^4.6.0",
"@babel/eslint-parser": "^7.23.0",
"prettier": "^3.0.3"
```

## Quick Start

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Mobile App
npm install

# Web Dashboard
cd web-dashboard && npm install
```

### Check Code Quality
```bash
# Backend
cd backend && npm run lint

# Mobile App
npm run lint

# Web Dashboard
cd web-dashboard && npm run lint
```

### Fix Issues Automatically
```bash
# Backend
cd backend && npm run lint:fix && npm run format

# Mobile App
npm run lint:fix && npm run format

# Web Dashboard
cd web-dashboard && npm run lint:fix && npm run format
```

## Configuration Details

### Prettier Rules (All Components)
```json
{
  "semi": true,                    // Add semicolons
  "trailingComma": "es5",          // Trailing commas in ES5
  "singleQuote": true,             // Use single quotes
  "printWidth": 100,               // Line length limit
  "tabWidth": 2,                   // 2 spaces per indent
  "useTabs": false                 // Use spaces, not tabs
}
```

### ESLint Rules

**Backend (TypeScript):**
- ESLint recommended rules
- TypeScript-specific rules
- No unused variables (except `_` prefix)
- Console logging allowed

**Mobile App (React Native):**
- ESLint recommended rules
- React plugin rules
- React Hooks rules
- No unused variables (except `_` prefix)

**Web Dashboard (React):**
- ESLint recommended rules
- React plugin rules
- React Hooks rules
- No unused variables (except `_` prefix)

## IDE Integration

### VS Code
Install extensions:
1. ESLint
2. Prettier - Code formatter

Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ
1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable ESLint
3. Settings → Languages & Frameworks → JavaScript → Prettier
4. Enable Prettier

## Workflow

### Before Committing
```bash
# Fix all issues
npm run lint:fix

# Format code
npm run format

# Verify
npm run lint
```

### During Development
- Use IDE integration for real-time feedback
- Fix issues as you code
- Run `npm run format` before committing

## Common Commands

```bash
# Check for errors
npm run lint

# Fix errors automatically
npm run lint:fix

# Format code
npm run format

# Check if code is formatted
npm run format --check
```

## Files Created

1. `backend/.eslintrc.json` - Backend ESLint config
2. `backend/.prettierrc.json` - Backend Prettier config
3. `.eslintrc.json` - Mobile app ESLint config
4. `.prettierrc.json` - Mobile app Prettier config
5. `web-dashboard/.eslintrc.json` - Web dashboard ESLint config
6. `web-dashboard/.prettierrc.json` - Web dashboard Prettier config
7. `.gitignore` - Git ignore rules
8. `LINTING.md` - Detailed linting guide
9. `LINTING_SETUP.md` - This file

## Next Steps

1. Install dependencies: `npm install` in each component
2. Run linting: `npm run lint`
3. Fix issues: `npm run lint:fix && npm run format`
4. Set up IDE integration (optional but recommended)
5. Commit with clean code

## Benefits

✅ **Consistent Code Style** - All components follow same rules
✅ **Catch Errors Early** - ESLint finds bugs before runtime
✅ **Auto-formatting** - Prettier handles formatting automatically
✅ **IDE Integration** - Real-time feedback while coding
✅ **CI/CD Ready** - Can fail builds on linting errors
✅ **Team Collaboration** - Everyone follows same standards

## Troubleshooting

### "Module not found" Error
```bash
npm install
```

### "ESLint not found" Error
```bash
npm install --save-dev eslint
```

### "Prettier not found" Error
```bash
npm install --save-dev prettier
```

### IDE not showing errors
- Restart IDE
- Check ESLint extension is enabled
- Verify `.eslintrc.json` exists

---

**Linting and Prettier are now fully configured and ready to use!** 🎉
