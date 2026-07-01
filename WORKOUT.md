# Workout Tracker

A mobile-first workout tracker, styled after the editorial dark-and-gold look and
built to live alongside the Juniper calendar. Open **`workout.html`** in a browser
(or deploy it — it's a static file like `index.html`).

## Themes

Four selectable styles, switchable in-app via the **⚙ Settings** button (top-right).
The choice persists per-browser.

| Theme | Look |
|---|---|
| **Editorial** (default) | Warm charcoal, antique gold, uppercase serif — the "download" style |
| **Midnight** | The original deep-indigo dark theme with a blue accent |
| **Juniper** | Sage / cream / gold — matches the calendar brand |
| **Blush** | Warm cream and terracotta, softer title-case serif |

Every color and font is a token in the `THEMES` object at the top of
`workout.src.jsx`. **To add a 5th style,** add one entry there and one id to
`THEME_ORDER` — the picker and the whole app pick it up automatically.

Settings also has a **lbs / kg** unit toggle (label only — it does not convert
existing logged numbers).

## How it's built

The app is plain React with no build toolchain to install. To keep it fast and
usable at the gym on a spotty connection, React is **vendored locally** and the
JSX is **pre-compiled** — no CDN, no in-browser Babel.

```
workout.html      ← the page: loads vendored React + workout.app.js
workout.src.jsx   ← EDIT THIS (the React source, ~1000 lines)
workout.app.js    ← generated — compiled from the .jsx by build.js
vendor/           ← React + ReactDOM UMD builds
build.js          ← compiles workout.src.jsx → workout.app.js
```

### Editing

1. Edit `workout.src.jsx`
2. Rebuild:
   ```
   npm install --no-save @babel/core @babel/preset-react
   node build.js
   ```
3. Commit `workout.src.jsx` **and** `workout.app.js` together.

## Data & storage

All data (programs, logs, theme, unit) lives in the browser's `localStorage`
under `gwv10-*` keys. Nothing is sent anywhere. Export/import a program as JSON
from the Programs tab to share with a friend.

## AI features (needs a backend later)

Screenshot import, text parsing, "find timestamp", and YouTube generation call
the Claude API directly. In this static build those calls need a small backend
proxy to add the API key (they fail gracefully with a clear message until then —
see the handoff's *Migration Notes*). **Everything else — manual entry, gym mode,
set/weight/rep logging, rest timer, history, video embeds, sharing — works today
with no backend.**

## Roadmap (from the handoff, in priority order)

- [x] Editorial theme + a theme system with multiple styles
- [x] `localStorage` persistence (replaced the artifact storage API)
- [x] lbs/kg unit toggle
- [ ] Backend proxy for Claude API calls (keeps the key off the client)
- [ ] Progress chart in the exercise detail (history data already exists)
- [ ] Cross-program exercise library / search
- [ ] Optional cloud sync (e.g. Supabase) for phone ↔ desktop
