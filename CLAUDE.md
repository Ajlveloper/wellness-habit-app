# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Wellness/habit-tracking app, currently still the Expo SDK 58 starter template (default Home/Explore tabs). Package manager is **npm** (`package-lock.json`), so use `npx`, not `bunx`. No test framework is set up yet.

## Commands

```bash
npm start / npm run ios / npm run android / npm run web
npm run lint               # expo lint
npx tsc --noEmit           # typecheck (strict mode)
npm run reset-project      # moves starter src/ + demo assets to example/, creates blank src/app
```

## Architecture

- Stack: Expo 58, React Native 0.88, React 19.3, Reanimated 4 + worklets, TypeScript 6. `app.json` enables **typed routes** and the **React Compiler** (avoid manual `useMemo`/`useCallback` unless needed).
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`.
- Platform-specific files via `.web.tsx`/`.web.ts` suffix. Tabs differ per platform:
  - `src/components/app-tabs.tsx` — native: `NativeTabs` from `expo-router/native-tabs`.
  - `src/components/app-tabs.web.tsx` — web: custom tab bar built with `expo-router/ui` (`Tabs`, `TabList`, `TabTrigger`, `TabSlot`).
  - Adding a tab requires updating **both** files; trigger `name` must match the route file in `src/app/`.
- `src/app/_layout.tsx` is the root: wraps app in Expo Router `ThemeProvider`, holds splash screen (`preventAutoHideAsync` + `AnimatedSplashOverlay`), renders `AppTabs`.
- Theming: `src/constants/theme.ts` defines `Colors` (light/dark), `Fonts` (per-platform; web uses CSS vars from `src/global.css`), `Spacing` scale, `MaxContentWidth`. Use `useTheme()` (`src/hooks/use-theme.ts`) and `ThemedText`/`ThemedView` components rather than hardcoding colors. `use-color-scheme.web.ts` returns `'light'` until hydration because web uses server output (`web.output: "server"`).
