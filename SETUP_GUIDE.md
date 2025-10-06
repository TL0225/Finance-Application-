# Setup Guide for VSCode

Follow these steps to get the project running on your local machine.

## Prerequisites

Make sure you have these installed:
- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **VSCode** - [Download](https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Open Project in VSCode

```bash
# Navigate to your project folder
cd path/to/zero-budget-finance-app

# Open in VSCode
code .
```

### 2. Install Dependencies

Open the terminal in VSCode (`` Ctrl+` `` or View → Terminal) and run:

```bash
npm install
```

**Alternative package managers:**
```bash
yarn install
# or
pnpm install
```

This will install all required dependencies (~300MB). It may take 2-5 minutes.

### 3. Start Development Server

Once installation completes, run:

```bash
npm run dev
```

You should see:
```
VITE v6.0.1  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 4. Open in Browser

The app should automatically open in your default browser at `http://localhost:3000`

If it doesn't open automatically:
- Click the link in the terminal (Ctrl+Click)
- Or manually go to `http://localhost:3000` in your browser

### 5. Verify Everything Works

You should see:
1. ✅ App loads without errors
2. ✅ Sidebar visible on the left
3. ✅ Dashboard page displays
4. ✅ No console errors (press F12 to check)

## Recommended VSCode Extensions

Install these extensions for the best development experience:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - Linting and code quality

2. **Prettier** (`esbenp.prettier-vscode`)
   - Code formatting

3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete for Tailwind classes

4. **TypeScript React code snippets** (`infeng.vscode-react-typescript`)
   - React/TypeScript snippets

5. **Path Intellisense** (`christian-kohler.path-intellisense`)
   - File path autocomplete

Install via:
- Open Extensions panel (Ctrl+Shift+X)
- Search for each extension name
- Click Install

## Troubleshooting

### Port 3000 Already in Use

If you see an error that port 3000 is already in use:

```bash
# Kill the process using port 3000 (Windows)
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

### Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### TypeScript Errors

If you see TypeScript errors in VSCode:

1. Reload VSCode: `Ctrl+Shift+P` → "Reload Window"
2. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Build Errors

If `npm run build` fails:

```bash
# Clear build cache
rm -rf dist
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### localStorage Not Working

If data isn't persisting:

1. Check if you're in Private/Incognito mode (localStorage is disabled)
2. Check browser console for quota errors
3. Try clearing browser data: `localStorage.clear()`

## Development Workflow

### File Structure
```
Your working files:
├── components/        # Edit UI components here
├── pages/            # Edit page components here
├── store/            # Edit state management here
├── types/            # Edit TypeScript types here
├── utils/            # Edit utility functions here
└── styles/           # Edit global styles here
```

### Hot Reload

The app automatically reloads when you save changes to:
- Any `.tsx` or `.ts` file
- `styles/globals.css`
- Component files

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Build output will be in `dist/` folder.

## VSCode Settings (Optional)

Create `.vscode/settings.json` for project-specific settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Next Steps

1. **Explore the app** - Click through all the sections
2. **Add some data** - Create accounts, transactions, receipts
3. **Test features** - Try uploading files, exporting data
4. **Check console** - Run `window.debugAuth()` to see profiles
5. **Read documentation** - Check `/docs/` folder for detailed info

## Common Tasks

### Add a new page
```bash
# 1. Create page component
touch pages/NewPage.tsx

# 2. Add to pages/index.ts
# 3. Add route in App.tsx
# 4. Add to sidebar navigation
```

### Add a new component
```bash
# 1. Create component
touch components/MyComponent.tsx

# 2. Import where needed
# import { MyComponent } from './components/MyComponent';
```

### Modify styles
```bash
# Edit global styles
code styles/globals.css

# Use Tailwind classes in components
className="bg-blue-500 text-white p-4"
```

## Getting Help

1. **Check console** - Browser DevTools (F12) shows errors
2. **Check documentation** - `/docs/` folder has detailed guides
3. **Debug commands** - `window.debugAuth()` shows useful info
4. **Check README** - `/README.md` has overview and features

## Success Checklist

Before you start developing, verify:

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Dev server running (`npm run dev` works)
- [ ] App opens in browser (http://localhost:3000)
- [ ] No console errors (check F12 → Console)
- [ ] VSCode extensions installed (ESLint, Tailwind CSS IntelliSense)
- [ ] Hot reload works (edit a file, see changes)

If all checked, you're ready to develop! 🎉

## Build for Production

When ready to deploy:

```bash
# Create production build
npm run build

# Test production build locally
npm run preview

# Deploy 'dist' folder to any static hosting
# (Netlify, Vercel, GitHub Pages, etc.)
```

---

**Need more help?** Check the full documentation in `/docs/` or the README.md file.