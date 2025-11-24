# Linting & Code Formatting Guide

## Overview

The project uses **ESLint** for code linting and **Prettier** for code formatting across all three components.

## Configuration Files

### Backend
- `.eslintrc.json` - ESLint rules for TypeScript
- `.prettierrc.json` - Prettier formatting rules

### Mobile App
- `.eslintrc.json` - ESLint rules for React Native
- `.prettierrc.json` - Prettier formatting rules

### Web Dashboard
- `.eslintrc.json` - ESLint rules for React
- `.prettierrc.json` - Prettier formatting rules

## Available Commands

### Backend
```bash
cd backend
npm run lint              # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run format           # Format code with Prettier
```

### Mobile App
```bash
npm run lint             # Check for linting errors
npm run lint:fix        # Fix linting errors automatically
npm run format          # Format code with Prettier
```

### Web Dashboard
```bash
cd web-dashboard
npm run lint            # Check for linting errors
npm run lint:fix       # Fix linting errors automatically
npm run format         # Format code with Prettier
```

## Linting Rules

### Backend (TypeScript)
- ESLint recommended rules
- TypeScript-specific rules
- No unused variables (except prefixed with `_`)
- Console logging allowed

### Mobile App (React Native)
- ESLint recommended rules
- React plugin rules
- React Hooks rules
- No unused variables (except prefixed with `_`)

### Web Dashboard (React)
- ESLint recommended rules
- React plugin rules
- React Hooks rules
- No unused variables (except prefixed with `_`)

## Prettier Configuration

All components use consistent formatting:
- **Semicolons:** Enabled
- **Trailing Commas:** ES5 style
- **Quotes:** Single quotes
- **Print Width:** 100 characters
- **Tab Width:** 2 spaces
- **Tabs:** Spaces (not tabs)

## Pre-commit Setup (Optional)

### Install husky and lint-staged
```bash
npm install --save-dev husky lint-staged
npx husky install
```

### Add pre-commit hook
```bash
npx husky add .husky/pre-commit "npm run lint:fix && npm run format"
```

## IDE Integration

### VS Code

Install extensions:
- ESLint
- Prettier - Code formatter

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

1. Go to Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable ESLint
3. Go to Settings → Languages & Frameworks → JavaScript → Prettier
4. Enable Prettier
5. Set "Run for files" to `{**/*,**/*.*}`

## Workflow

### Before Committing
```bash
# Fix all linting issues
npm run lint:fix

# Format all code
npm run format

# Verify no errors remain
npm run lint
```

### During Development
- Use IDE integration for real-time feedback
- Fix issues as you code
- Run `npm run format` before committing

### In CI/CD
```bash
# Check for linting errors (fail if found)
npm run lint

# Verify formatting (fail if not formatted)
npm run format --check
```

## Common Issues

### "Unexpected var" Error
Use `const` or `let` instead of `var`

### "Unused variable" Error
Either remove it or prefix with `_` if intentionally unused

### "Missing semicolon" Error
Run `npm run format` to auto-fix

### "Line too long" Error
Break into multiple lines or run `npm run format`

## Ignoring Rules

### For a single line
```typescript
// eslint-disable-next-line rule-name
const x = 1;
```

### For a block
```typescript
/* eslint-disable rule-name */
const x = 1;
/* eslint-enable rule-name */
```

### For a file
```typescript
/* eslint-disable */
// code here
/* eslint-enable */
```

## Extending Rules

To modify rules, edit the `.eslintrc.json` file in each component:

```json
{
  "rules": {
    "rule-name": ["error", "option"],
    "another-rule": "off"
  }
}
```

## Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run lint` | Check for errors |
| `npm run lint:fix` | Fix errors automatically |
| `npm run format` | Format code |
| `npm run format --check` | Check if formatted |

## Best Practices

1. **Run lint:fix before committing** - Catches most issues
2. **Use IDE integration** - Get real-time feedback
3. **Follow the rules** - Consistent code quality
4. **Review warnings** - They often indicate bugs
5. **Keep rules consistent** - All components use same style

---

**All components are pre-configured and ready to use!**
