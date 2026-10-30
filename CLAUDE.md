# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Ember: Habit Streaks**: an iOS and Android habit tracker built around a flame/streak metaphor. No web. It's a CV-ready portfolio project (learning roadmap #1), so it favors patterns worth learning (feature-based architecture, a pure domain core, persisted store migrations, EAS, CI) over the shortest path.

- Spec: `.scratch/ember-habit-tracker-spec.md` (source of truth: user stories, decisions, testing, out of scope).
- Tickets: `.scratch/ember-habit-tracker/issues/NN-*.md`, each with acceptance checklist, `Blocked by` and `Status`.
- `.scratch/` is gitignored, so spec and tickets are local only.
- Implement tickets with `/implement <ticket path>`.

Package manager is **npm** (`package-lock.json`): use `npx`, not `bunx`, and add deps with `npx expo install`. Node **24.22.2** (`.nvmrc`; SDK 58 requires >=22.13). The macOS firewall must allow `~/.nvm/versions/node/v24.22.2/bin/node` incoming connections, or Expo Go on the phone fails with `Failed to download remote update`.

## Conventions

- One branch + PR per ticket (`feat/NN-<slug>`). Conventional Commits (`feat:`, `fix:`, `chore:`...).
- Code, identifiers and commit messages in English. UI defaults to English, with Spanish supported from ticket 05.
- Commits are GPG-signed. Signing needs an interactive passphrase, so the user commits with `! git commit ...`.
- Before declaring done, run lint and typecheck (plus tests once ticket 02 lands).
- Interactive elements need a stable `testID` and accessibility label (for Maestro E2E and screen readers).

## Commands

```bash
npm start / npm run ios / npm run android
npm run start:tunnel       # Expo Go over ngrok when the phone can't reach the Mac on LAN
npm run lint               # expo lint
npx tsc --noEmit           # typecheck (strict mode)
```

No test framework yet (Jest `jest-expo` + RNTL + CI come in ticket 02).

## Architecture

### Current (after ticket 01)

- Stack: Expo 58, React Native 0.88, React 19.3, Reanimated 4 + worklets, TypeScript 6. `app.json` sets `name: "Ember"`, `platforms: ["ios","android"]`, **typed routes** and **React Compiler** (avoid manual `useMemo`/`useCallback` unless needed).
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`.
- `src/app/_layout.tsx` is the root `Stack` (headers hidden). It wraps the app in Expo Router's `ThemeProvider` (light/dark) and holds the splash screen (`preventAutoHideAsync`, hidden on mount).
- `src/app/(tabs)/_layout.tsx` renders `NativeTabs` (`expo-router/native-tabs`) with SF Symbol (`sf`) and Material Symbol (`md`) icons. Tabs: `index` (Today), `stats`, `settings`. A new tab needs a `NativeTabs.Trigger` whose `name` matches its route file.
- Screens render `PlaceholderScreen` (`src/shared/ui/placeholder-screen.tsx`): `testID` + accessibility label, colors from `useTheme()`.
- Still template defaults: scheme `wellnesshabitapp`, the blue splash/icon colors, and unused starter deps (`expo-web-browser`, `expo-image`, `@expo/ui`, `expo-glass-effect`, `expo-device`, `expo-symbols`).

### Target (per spec)

- **Feature-based:** features for `habits`, `stats`, `achievements`, `reminders` and `widget`, plus a `shared/` layer (UI primitives, theme tokens, i18n, storage). Route files only compose features, with no business logic.
- **Navigation:**
  - root Stack containing onboarding (shown once), the `(tabs)` group, a habit detail push route (by id), a create/edit modal and an achievement-unlocked sheet.
  - deep links (custom scheme) to Today and habit detail.
- **Stack to add:**
  - NativeWind v4 + Tailwind 3. Theming moves fully to NativeWind (no parallel theme system).
  - Zustand persisted with react-native-mmkv v4 (Nitro).
  - React Hook Form + Zod.
  - expo-haptics, expo-notifications, expo-widgets, expo-localization + i18next.
  - react-native-svg heatmap, Sentry.
  - EAS development build, since Expo Go can't run MMKV, widgets or notification actions.
- **Domain module (core seam):**
  - pure and framework-free; never reads the clock or storage, so "today" is always passed in.
  - computes scheduled/not-scheduled today, current and best streak, completion rate (30d / all time), heatmap intensity (global and per habit), newly unlocked achievements and perfect day.
  - the store holds raw facts only; everything derived comes from the domain.
  - the store is versioned, with migrations from v1.
- **Data model:**
  - Habit: id, name, emoji, color key, created date, order, optional reminder time, archived flag.
  - Schedule history: append-only entries `{effectiveFrom, weekdays}`. Edits apply from today onward.
  - Archive periods count as unscheduled.
  - Completion: `{habitId, date: 'YYYY-MM-DD'}` as a local calendar date, never UTC.
  - Unlocked achievement: `{id, date}`, never revoked.
- **Rules:**
  - completion is binary only.
  - the day ends at local midnight, with no grace window.
  - only today can be marked or unmarked; the store rejects other dates.
  - an incomplete today doesn't break a streak, but a missed scheduled past day does.
  - unscheduled, archived and pre-creation days are skipped.
- **Achievements:**
  - streak 3/7/30/100/365
  - first habit
  - 10/100/500 total completions
  - perfect week
- **Testing:**
  - Jest table-style tests on the domain module (behavior only; edge cases listed in the spec).
  - one Maestro E2E flow.
  - native integrations are checked manually.

## Roadmap and progress

| # | Ticket | Blocked by | Status |
|---|---|---|---|
| 01 | Reset template and native three-tab shell | – | **Done** on `feat/01-reset-template-native-tab-shell` (staged, awaiting commit/PR) |
| 02 | Test tooling and CI | 01 | ready |
| 03 | NativeWind v4 and Ember theme tokens | 01 | ready |
| 04 | EAS dev build, persisted store and theme preference | 03 | ready |
| 05 | i18n (English/Spanish) and language selector | 04 | ready |
| 06 | Create habit and Today list | 05 | ready |
| 07 | Mark today, streaks and progress ring | 06 | ready |
| 08 | Habit detail and per-habit heatmap | 07 | ready |
| 09 | Edit, archive and delete habit | 08 | ready |
| 10 | Drag to reorder on Today | 07 | ready |
| 11 | Completion feedback and celebrations | 07 | ready |
| 12 | Achievements: catalogue, unlocking and sheet | 11 | ready |
| 13 | Stats screen | 08, 12 | ready |
| 14 | Basic reminders | 09 | ready |
| 15 | Smart reminders | 14 | ready |
| 16 | Onboarding | 06 | ready |
| 17 | Settings: data management | 06 | ready |
| 18 | Interactive iOS widget | 10 | ready |
| 19 | Read-only Android widget | 18 | ready |
| 20 | Maestro end-to-end flow | 11, 13, 16 | ready |
| 21 | Sentry monitoring | 04 | ready |
| 22 | CV-ready release | 15, 17, 19, 20, 21 | ready |

Ticket 01 notes:
- ran the reset script (delete mode).
- removed web: `react-native-web`, `web` config, `asyncRoutes.web`, favicon, `web`/`reset-project` scripts.
- added `eslint.config.js` (`eslint-config-expo`).
- keep `react-dom` (SDK-pinned): `expo-router`, `@expo/metro-runtime` and `@expo/log-box` need it as a peer. Without it npm pulls a mismatched version.
- verified with typecheck, lint, iOS + Android bundle export and `expo-doctor` (20/20). Not yet run on a device.

Open items to confirm (from spec):
- NativeWind v4 compatibility with SDK 58.
- MMKV v4 API (`createMMKV`, `remove`).
- expo-widgets stability on Android.
- iOS calendar-trigger behavior for weekday reminders.
- "Ember" name availability on the App Store and Play Store.
