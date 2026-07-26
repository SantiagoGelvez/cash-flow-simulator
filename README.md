# Personal/Household Cash-Flow Simulator

A financial planning tool for modeling income, debts, planned purchases, and unexpected expenses month by month, and visualizing how available cash and total debt evolve over time.

Built to work for any person or household: a single earner or several, any number of debts, and any kind of planned purchase (it doesn't assume anything specific to one particular case).

## Stack

- [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) for global state
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Chart.js / hand-built SVG for the charts
- No backend for now — persistence via `localStorage` plus JSON export/import

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
npm run build      # production build in /dist
npm run preview    # serve the production build locally
```

## Project structure

```
src/
├── assets/          # global styles, fonts
├── components/       # Vue components (list forms, cards, charts, table)
├── stores/           # Pinia store holding the financial scenario state
├── engine/           # simulation engine: pure functions, no Vue dependencies
├── composables/       # reusable logic (currency formatting, localStorage, etc.)
├── App.vue
└── main.js
```

The simulation engine (`src/engine/`) is intentionally kept separate from the rest of the app: pure functions that take the scenario as input and return the month-by-month projection, without touching the DOM or the store directly. This makes it easy to test and, later on, to move or duplicate on a backend if the project needs one.

## Persistence

The entire scenario (income sources, debts, planned events, unexpected expenses, settings) lives in the browser's `localStorage`. It can be exported to a `.json` file for backup or to share with someone else, and imported back in.

## Project status

Actively in development. No backend, no authentication, no multi-currency support — current scope is cash flow and debt in Colombian pesos (COP).