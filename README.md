# Personal/Household Cash-Flow Simulator

A financial planning tool for modeling income, debts, planned purchases, and unexpected expenses month by month, and visualizing how available cash and total debt evolve over time.

Built to work for any person or household: a single earner or several, any number of debts, and any kind of planned purchase (it doesn't assume anything specific to one particular case) — everything is list-based and editable.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`, TypeScript)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) for global state
- [Tailwind CSS](https://tailwindcss.com/) for styling, hand-built components
- [Chart.js](https://www.chartjs.org/) via `vue-chartjs` + `chartjs-plugin-annotation` for the charts
- [Vitest](https://vitest.dev/) for the simulation engine's test suite
- No backend — persistence via `localStorage` plus JSON export/import and CSV export

## Requirements

- Node.js 18+
- npm

## Setup and running

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port Vite prints to the console).

### Other commands

```bash
npm run build      # type-check + production build in /dist
npm run preview    # serve the production build locally
npm run test       # run the engine's Vitest suite once
npm run test:watch # run tests in watch mode
```

## Project structure

```
src/
├── main.ts, App.vue
├── assets/            # global CSS (theme tokens for dark/light), fonts
├── types/              # Scenario data model + simulation output types
├── engine/              # simulation engine: pure TS functions, no Vue/Pinia imports
│   └── __tests__/        # Vitest suite covering the engine's edge cases
├── data/                # neutral example scenario used by "load example"
├── stores/              # Pinia stores: scenario (data + persistence) and ui (theme, panels)
├── composables/         # currency formatting, localStorage helpers, CSV export, theme, alerts
└── components/
    ├── layout/            # app shell, theme toggle
    ├── shared/             # generic primitives: DynamicList, CollapsiblePanel, Tooltip, etc.
    ├── panels/             # left-column input cards (income, debts, events, fund, strategy...)
    ├── results/            # summary cards and the critical-month alert
    ├── charts/             # cash flow and debt charts
    ├── table/              # monthly detail table
    └── scenario/           # save/load named scenarios, JSON import/export, example/reset
```

The simulation engine (`src/engine/`) is intentionally kept separate from the rest of the app: pure functions that take a `Scenario` as input and return the month-by-month projection, without touching the DOM or the store. This makes it easy to test in isolation and, later on, to move or duplicate on a backend without rewriting the logic.

## Persistence

The working scenario (income sources, debts, planned events, emergency fund, settings) auto-saves to `localStorage` as you edit. Named scenarios can be saved separately to compare strategies (e.g. "Plan A" vs "Plan B") without losing either one. The full scenario can be exported to a `.json` file for backup or sharing, and re-imported; the monthly table can be exported to `.csv`.

## Architecture decisions

- **Engine as pure functions, not a class or a store module.** `simularEscenario(scenario)` takes a plain `Scenario` object and returns a plain `SimulationOutput` — no Vue reactivity, no side effects. Each step of the monthly calculation (income, interest/minimum payment, emergency fund, events, avalanche paydown) is its own small pure function in `src/engine/`, individually unit-tested. This is what makes the "avalanche leftover lands in cash instead of vanishing" and "milestone fires once, not every zero-balance month" edge cases provable in isolation, and what would let this logic run server-side unchanged if a backend is added later.
- **Pinia store as a thin reactive wrapper.** `useScenarioStore` holds the editable `scenario` ref and exposes `simulation` as a `computed()` that calls the engine — Vue's reactivity means it only recomputes when the scenario actually changes, with no manual memoization. All the store's actions are just list mutators (`addDebt`, `removeIncrease`, ...); none of them contain simulation logic.
- **Chart.js over hand-rolled SVG.** Both charts are simple, single-series line charts over ≤60 monthly points, so Chart.js's built-in area fill (for the cash chart's positive/negative split), tooltip, and `chartjs-plugin-annotation` (for debt-payoff milestone markers) cover everything needed without reimplementing scale/tooltip/hit-testing by hand. Charts are force-rerendered on theme toggle (`:key` bound to the theme) so their colors, read from CSS custom properties at creation time, stay correct in both dark and light mode.
- **`localStorage` via a small defensive wrapper**, not used directly. `useLocalStorage.ts` wraps `JSON.parse`/`stringify` in `try/catch` so a corrupted or missing entry degrades to an empty scenario instead of crashing the app. The auto-saved working scenario and the named-scenario library are stored under separate keys, so comparing saved plans never touches the scenario you're actively editing.
- **UI state (theme, which panels are collapsed) lives in a separate `useUiStore`**, not in the scenario store, so that exporting a scenario to JSON never accidentally carries along UI state.

## Project status

Actively in development. No backend, no authentication, no multi-currency support — current scope is cash flow and debt in Colombian pesos (COP).
