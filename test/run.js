#!/usr/bin/env node
/**
 * Runs every suite in this directory and reports a single tally.
 * Each suite boots index.html in jsdom, drives the real UI, and exits non-zero on failure.
 *
 *   npm test
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const suites = fs.readdirSync(dir).filter(f => f.endsWith('.test.js')).sort();

let pass = 0, fail = 0, broken = [];
const t0 = Date.now();

for (const file of suites) {
  let out = '';
  let ok = true;
  try {
    out = execFileSync(process.execPath, [path.join(dir, file)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    ok = false;
    out = (e.stdout || '') + (e.stderr || '');
  }
  // jsdom prints "Not implemented" noise for unsupported browser APIs; ignore it
  const lines = out.split('\n').filter(l => !l.includes('Not implemented'));
  const p = (lines.join('\n').match(/✓/g) || []).length;
  const f = (lines.join('\n').match(/✗/g) || []).length;
  pass += p; fail += f;

  const name = file.replace(/\.test\.js$/, '').replace(/^\d-/, '');
  if (ok && f === 0) {
    console.log(`  \x1b[32m✓\x1b[0m ${name.padEnd(22)} ${p} checks`);
  } else {
    broken.push(name);
    console.log(`  \x1b[31m✗\x1b[0m ${name.padEnd(22)} ${p} passed, ${f} failed`);
    lines.filter(l => l.includes('✗')).forEach(l => console.log('      ' + l.trim()));
    if (!ok && f === 0) {
      console.log('      suite crashed:');
      lines.filter(Boolean).slice(-6).forEach(l => console.log('      ' + l.trim()));
    }
  }
}

const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log('');
if (fail === 0 && broken.length === 0) {
  console.log(`\x1b[32mAll ${pass} checks passed\x1b[0m across ${suites.length} suites in ${secs}s`);
  process.exit(0);
} else {
  console.log(`\x1b[31m${pass} passed, ${fail} failed\x1b[0m in ${secs}s — see ${broken.join(', ')}`);
  process.exit(1);
}
