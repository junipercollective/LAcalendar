#!/usr/bin/env node
/*
 * build.js — compiles workout.src.jsx (React + JSX) into workout.app.js (plain JS).
 *
 * The workout tracker (workout.html) loads vendored React from vendor/ and the
 * compiled workout.app.js — no CDN, no in-browser Babel, works offline at the gym.
 *
 * Workflow:
 *   1. Edit workout.src.jsx
 *   2. Run: node build.js
 *   3. Commit workout.src.jsx + workout.app.js together
 *
 * Requires @babel/core and @babel/preset-react. If they are not installed:
 *   npm install --no-save @babel/core @babel/preset-react
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'workout.src.jsx');
const OUT = path.join(__dirname, 'workout.app.js');

let babel;
try {
  babel = require('@babel/core');
} catch (e) {
  console.error('Missing build deps. Run:\n  npm install --no-save @babel/core @babel/preset-react');
  process.exit(1);
}

const src = fs.readFileSync(SRC, 'utf8');
const { code } = babel.transformSync(src, {
  // classic runtime → React.createElement, resolves against the global UMD React
  // (no ESM `import` of the jsx-runtime, which would break in a plain <script>).
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  comments: true,
  compact: false,
});

const banner = '/* Compiled from workout.src.jsx by build.js — do not edit directly. */\n';
fs.writeFileSync(OUT, banner + code);
console.log(`Built ${path.basename(OUT)} (${code.length} chars) from ${path.basename(SRC)}`);
