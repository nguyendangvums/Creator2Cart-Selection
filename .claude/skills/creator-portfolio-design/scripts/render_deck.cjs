#!/usr/bin/env node
// Render a Creator Portfolio deck to PDF + per-slide PNGs and run layout QA.
// Usage: NODE_PATH=$(npm root -g) node render_deck.cjs <deck.html> [outDir]
// Exits 1 when a QA check fails (clamped bio, wrapped footnote or pills row,
// wrapped creator name, broken image, fonts not loaded).

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const htmlPath = path.resolve(process.argv[2] || 'deck.html');
  const outDir = path.resolve(process.argv[3] || path.join(path.dirname(htmlPath), 'previews'));
  fs.mkdirSync(outDir, { recursive: true });

  const launch = {};
  if (fs.existsSync('/opt/pw-browsers/chromium')) {
    // Prefer the preinstalled Chromium when the bundled one is missing.
    try { chromium.executablePath(); } catch (_) { launch.executablePath = '/opt/pw-browsers/chromium'; }
  }
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 1312, height: 800 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.documentElement.style.setProperty('--zoom', '1'));

  const report = await page.evaluate(() => {
    const issues = [];
    const slides = [...document.querySelectorAll('.slide')];
    const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, ''));
    ['Google Sans', 'YouTube Sans'].forEach(f => { if (!loaded.includes(f)) issues.push(`font not loaded: ${f}`); });
    slides.forEach((s, i) => {
      const n = i + 1;
      const top = s.getBoundingClientRect().top;
      s.querySelectorAll('.bio').forEach(el => {
        if (el.scrollHeight > el.clientHeight + 1) issues.push(`slide ${n}: bio clamped (over 4 lines)`);
      });
      s.querySelectorAll('.footnote').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 1) issues.push(`slide ${n}: footnote overflows one line`);
      });
      s.querySelectorAll('.pills-row').forEach(el => {
        if (el.getBoundingClientRect().height > 36) issues.push(`slide ${n}: content pills wrap to a second row`);
      });
      s.querySelectorAll('.col .h-display').forEach(el => {
        const lh = parseFloat(getComputedStyle(el).lineHeight);
        const lines = Math.round(el.getBoundingClientRect().height / lh);
        if (n > 3 && lines > 1) issues.push(`slide ${n}: creator name wraps (${lines} lines)`);
        const bottom = el.closest('.col').getBoundingClientRect().bottom - top;
        if (bottom > 376) issues.push(`slide ${n}: text block bottom ${Math.round(bottom)}px collides with pills row`);
      });
      s.querySelectorAll('.col .hook').forEach(el => {
        const lh = parseFloat(getComputedStyle(el).lineHeight);
        if (el.getBoundingClientRect().height > lh * 1.5) issues.push(`slide ${n}: hook wraps to a second line`);
      });
      s.querySelectorAll('.gname').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 1) issues.push(`slide ${n}: grid name truncated`);
      });
      s.querySelectorAll('img').forEach(img => {
        if (!img.complete || img.naturalWidth === 0) issues.push(`slide ${n}: image failed to load`);
      });
    });
    return { count: slides.length, issues };
  });

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  }
  const pdfPath = htmlPath.replace(/\.html?$/, '.pdf');
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdfPath, width: '1280px', height: '720px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();

  console.log(`slides: ${report.count}`);
  console.log(`pdf: ${pdfPath}`);
  console.log(`previews: ${outDir}`);
  if (report.issues.length) {
    console.log('QA issues:');
    report.issues.forEach(m => console.log('  - ' + m));
    process.exit(1);
  }
  console.log('QA: all checks passed');
})();
