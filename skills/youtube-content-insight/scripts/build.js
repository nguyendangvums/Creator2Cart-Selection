// Usage (from your work folder): node <skill>/scripts/build.js content.js [--dry]
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const WORK = process.cwd();
const C = require(path.resolve(process.argv[2] || 'content.js'));

const A = (f) => path.join(WORK, 'assets', f);
const RED = 'FF0033', INK = '0F0F0F', PALE = 'FFE8EC', GREY = 'F3F3F3', MUTED = '5F5F5F', LIGHT = '8A8A8A', PINK2 = 'FFC2CF';
const H = 'Plus Jakarta Sans', B = 'Google Sans';
const W = 13.333, M = 0.55;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'YouTube Trending Content Pack 2026 · ' + C.market;
pres.company = 'Celebrators';

let page = 0;
const icon = (n, c) => A(`i_${n}_${c}.png`);
const usedIcons = new Set();
const I = (n, c = 'red') => { usedIcons.add(n); return icon(n, c); };

function T(slide, text, o) {
  slide.addText(text, Object.assign({ isTextBox: true, fontFace: B, color: INK, margin: 0, valign: 'top' }, o));
}
function newSlide() {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  page++;
  return s;
}
function pageNum(s) { T(s, String(page), { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.25, fontSize: 9, color: LIGHT, align: 'right' }); }
function footer(s, src) { if (src) T(s, src, { x: M, y: 7.0, w: 11.3, h: 0.3, fontSize: 8.5, color: LIGHT }); pageNum(s); }
function tag(s, text, x = M, y = 0.42, fill = RED) {
  const w = 0.5 + text.length * 0.085;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.34, fill: { color: fill }, rectRadius: 0.17, line: { color: fill } });
  T(s, text, { x, y, w, h: 0.34, fontSize: 10, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', charSpacing: 0.5 });
}
function title(s, text, o = {}) {
  T(s, text, Object.assign({ x: M, y: 0.92, w: W - 2 * M, h: 0.75, fontFace: H, fontSize: 30, bold: true, valign: 'middle' }, o));
}
function sub(s, text, y = 1.72) { T(s, text, { x: M, y, w: W - 2 * M, h: 0.35, fontSize: 14, color: MUTED }); }
function iconSq(s, n, x, y, sz, fill, iconColor) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: sz, h: sz, fill: { color: fill }, rectRadius: sz * 0.22, line: { color: fill } });
  const p = sz * 0.2;
  s.addImage({ path: I(n, iconColor), x: x + p, y: y + p, w: sz - 2 * p, h: sz - 2 * p });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, rectRadius: 0.12, line: { color: fill } });
}

// ---------------------------------------------------------------- COVER
(function cover() {
  const s = newSlide();
  const c = C.cover;
  T(s, 'Confidential & Proprietary', { x: M, y: 0.45, w: 4, h: 0.3, fontSize: 10.5, color: LIGHT });
  tag(s, c.kicker, M, 1.55);
  T(s, [
    { text: c.line1, options: { color: INK, breakLine: true } },
    { text: c.line2, options: { color: RED } },
  ], { x: M, y: 2.1, w: 6.1, h: 3.3, fontFace: H, fontSize: 46, bold: true, lineSpacingMultiple: 0.95, valign: 'middle' });
  T(s, c.sub, { x: M, y: 5.6, w: 6.1, h: 0.4, fontSize: 16, color: '333333' });
  // mosaic
  const keys = C.pillars.map(p => p.key);
  const tw = 3.05, th = tw * 0.8, gx = 0.05, gy = 0.02;
  const x0 = W - 2 * tw - gx - 0.12, y0 = (7.5 - (3 * th + 2 * gy)) / 2;
  keys.forEach((k, i) => {
    s.addImage({ path: A(`hero_${k}.png`), x: x0 + (i % 2) * (tw + gx), y: y0 + Math.floor(i / 2) * (th + gy), w: tw, h: th });
  });
  s.addNotes(c.notes);
})();

// ---------------------------------------------------------------- STAT TILE SLIDES
function tileSlide(d, pattern) {
  const s = newSlide();
  title(s, d.title, { y: 0.55 });
  sub(s, d.sub, 1.35);
  const n = d.tiles.length, gap = 0.25, tw = (W - 2 * M - gap * (n - 1)) / n, ty = 2.05, th = 4.35;
  d.tiles.forEach((t, i) => {
    const x = M + i * (tw + gap);
    const pale = pattern[i];
    card(s, x, ty, tw, th, pale ? PALE : GREY);
    iconSq(s, t.icon, x + 0.3, ty + 0.35, 0.62, pale ? RED : INK, 'white');
    T(s, t.label, { x: x + 1.05, y: ty + 0.47, w: tw - 1.2, h: 0.38, fontSize: 10, bold: true, color: pale ? RED : MUTED, valign: 'middle', charSpacing: 1 });
    T(s, t.big, { x: x + 0.3, y: ty + 1.35, w: tw - 0.45, h: 1.2, fontFace: H, fontSize: 54, bold: true, color: pale ? RED : INK, valign: 'middle' });
    T(s, t.text, { x: x + 0.3, y: ty + 2.75, w: tw - 0.55, h: 1.4, fontSize: 14.5, color: '333333', lineSpacingMultiple: 1.1 });
  });
  footer(s, d.source);
  s.addNotes(d.notes);
}
tileSlide(C.why, [true, true, false, false]);
tileSlide(C.screens, [true, false, true, false]);

// ---------------------------------------------------------------- CONTENTS
(function contents() {
  const s = newSlide();
  title(s, C.contents.title, { y: 0.55 });
  const y0 = 1.65, rh = 0.84;
  C.pillars.forEach((p, i) => {
    const y = y0 + i * rh;
    iconSq(s, p.icon, M, y + 0.14, 0.52, i % 2 ? INK : RED, 'white');
    T(s, p.num, { x: M + 0.75, y: y + 0.12, w: 0.6, h: 0.56, fontFace: H, fontSize: 20, bold: true, color: RED, valign: 'middle' });
    T(s, p.name, { x: M + 1.4, y: y + 0.12, w: 4.6, h: 0.56, fontFace: H, fontSize: 20, bold: true, valign: 'middle' });
    T(s, p.short, { x: 6.6, y: y + 0.12, w: 6.18, h: 0.56, fontSize: 13, color: MUTED, valign: 'middle' });
    if (i < 5) s.addShape(pres.shapes.LINE, { x: M, y: y + rh, w: W - 2 * M, h: 0, line: { color: 'E6E6E6', width: 0.75 } });
  });
  footer(s, null);
  s.addNotes(C.contents.notes);
})();

// ---------------------------------------------------------------- PILLAR SLIDES
function divider(p) {
  const s = newSlide();
  T(s, p.num, { x: M, y: 1.0, w: 3, h: 1.35, fontFace: H, fontSize: 96, bold: true, color: RED, valign: 'middle' });
  T(s, p.divider.kicker, { x: M, y: 2.85, w: 5.8, h: 0.4, fontFace: H, fontSize: 16, bold: true, color: MUTED, charSpacing: 1.5 });
  T(s, p.name, { x: M, y: 3.3, w: 5.9, h: 0.95, fontFace: H, fontSize: 40, bold: true, valign: 'top' });
  T(s, p.divider.desc, { x: M, y: 4.4, w: 5.6, h: 1.2, fontSize: 15, color: '333333', lineSpacingMultiple: 1.1 });
  s.addImage({ path: A(`hero_${p.key}.png`), x: 6.65, y: 0.95, w: 6.25, h: 5.0 });
  footer(s, null);
  s.addNotes(`Section ${p.num}: ${p.name}. ${p.divider.desc}`);
}

function insightStats(p) {
  const d = p.insight, s = newSlide();
  tag(s, p.tag);
  title(s, d.title);
  sub(s, d.sub);
  const cw = (W - 2 * M - 0.6) / 3;
  d.stats.forEach((st, i) => {
    const x = M + i * (cw + 0.3), y = 2.35;
    iconSq(s, st.icon, x, y, 0.55, i === 0 ? RED : INK, 'white');
    T(s, st.big, { x, y: y + 0.72, w: cw, h: 0.85, fontFace: H, fontSize: 38, bold: true, color: RED, valign: 'middle' });
    T(s, st.text, { x, y: y + 1.62, w: cw - 0.25, h: 0.95, fontSize: 13, color: '333333', lineSpacingMultiple: 1.08 });
  });
  card(s, M, 5.2, W - 2 * M, 1.45, GREY);
  iconSq(s, 'PiLightbulbBold', M + 0.3, 5.2 + 0.42, 0.6, PALE, 'red');
  T(s, [{ text: 'Why it matters: ', options: { bold: true, color: INK } }, { text: d.why, options: { color: '333333' } }],
    { x: M + 1.15, y: 5.2 + 0.2, w: W - 2 * M - 1.45, h: 1.05, fontSize: 13.5, valign: 'middle', lineSpacingMultiple: 1.1 });
  footer(s, d.source);
  s.addNotes(p.insightNotes);
}

function insightBars(p) {
  const d = p.insight, s = newSlide();
  tag(s, p.tag);
  title(s, d.title);
  sub(s, d.sub);
  // chart panel
  const px = M, py = 2.2, pw = 7.25, ph = 4.5;
  card(s, px, py, pw, ph, 'FFFFFF');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: py, w: pw, h: ph, fill: { color: 'FFFFFF' }, rectRadius: 0.12, line: { color: 'E8E8E8', width: 1 } });
  T(s, d.chartLabel, { x: px + 0.3, y: py + 0.2, w: pw - 0.6, h: 0.35, fontSize: 11, bold: true, color: MUTED });
  const n = d.bars.length;
  const labW = 2.35, bx = px + 0.3 + labW + 0.15, bmaxW = pw - (bx - px) - 1.05;
  const max = d.pct ? 100 : Math.max(...d.bars.map(b => b[1]));
  const areaTop = py + 0.75, areaH = ph - 1.0;
  const rowH = areaH / n, barH = Math.min(0.5, rowH * 0.56);
  d.bars.forEach((b, i) => {
    const y = areaTop + i * rowH + (rowH - barH) / 2;
    T(s, b[0], { x: px + 0.3, y, w: labW, h: barH, fontSize: 12.5, bold: i === 0, color: INK, align: 'right', valign: 'middle' });
    const bw = Math.max(0.12, bmaxW * (b[1] / max));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y, w: bw, h: barH, fill: { color: i === 0 ? RED : (i < 3 ? 'FF4D6D' : 'FF8FA6') }, rectRadius: 0.06, line: { color: i === 0 ? RED : (i < 3 ? 'FF4D6D' : 'FF8FA6') } });
    T(s, b[2], { x: bx + bw + 0.1, y, w: 0.95, h: barH, fontFace: H, fontSize: 14, bold: true, color: INK, valign: 'middle' });
  });
  // stat cards
  const sx = px + pw + 0.3, sw = W - M - sx, sh = 1.4, sg = 0.15;
  d.stats.forEach((st, i) => {
    const y = py + i * (sh + sg);
    card(s, sx, y, sw, sh, i === 0 ? PALE : GREY);
    T(s, st.big, { x: sx + 0.25, y: y + 0.12, w: sw - 0.5, h: 0.6, fontFace: H, fontSize: 26, bold: true, color: RED, valign: 'middle' });
    T(s, st.text, { x: sx + 0.25, y: y + 0.72, w: sw - 0.45, h: 0.6, fontSize: 11.5, color: '333333' });
  });
  footer(s, d.source);
  s.addNotes(p.insightNotes);
}

function working(p) {
  const d = p.working, s = newSlide();
  tag(s, p.tag);
  title(s, d.title);
  T(s, "WHAT'S WORKING ON YOUTUBE", { x: M, y: 1.82, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: RED, charSpacing: 1 });
  const gx = M, gy = 2.25, cw = 3.62, ch = 2.1, g = 0.2;
  d.formats.forEach((f, i) => {
    const x = gx + (i % 2) * (cw + g), y = gy + Math.floor(i / 2) * (ch + g);
    const pale = i === 0;
    card(s, x, y, cw, ch, pale ? PALE : GREY);
    iconSq(s, f.icon, x + 0.25, y + 0.28, 0.5, pale ? RED : 'FFFFFF', pale ? 'white' : 'red');
    T(s, f.t, { x: x + 0.9, y: y + 0.26, w: cw - 1.05, h: 0.56, fontFace: H, fontSize: 14, bold: true, valign: 'middle' });
    T(s, f.d, { x: x + 0.25, y: y + 1.0, w: cw - 0.5, h: 0.95, fontSize: 12, color: '444444', lineSpacingMultiple: 1.08 });
  });
  // moments panel
  const mx = gx + 2 * cw + g + 0.3, mw = W - M - mx, my = 1.85, mh = 4.95;
  card(s, mx, my, mw, mh, INK);
  T(s, 'MOMENTS TO OWN', { x: mx + 0.35, y: my + 0.3, w: mw - 0.7, h: 0.3, fontSize: 10.5, bold: true, color: RED, charSpacing: 1 });
  const rowH = (mh - 0.85) / d.moments.length;
  d.moments.forEach((m, i) => {
    const y = my + 0.8 + i * rowH;
    s.addImage({ path: I('PiCalendarStarBold', 'red'), x: mx + 0.35, y: y + 0.02, w: 0.26, h: 0.26 });
    T(s, m.d, { x: mx + 0.75, y, w: mw - 1.05, h: 0.3, fontSize: 10.5, bold: true, color: RED, valign: 'middle', charSpacing: 0.5 });
    T(s, m.t, { x: mx + 0.75, y: y + 0.33, w: mw - 1.05, h: rowH - 0.4, fontSize: 12, color: 'FFFFFF', lineSpacingMultiple: 1.05 });
  });
  footer(s, d.source);
  s.addNotes(p.workingNotes);
}

function fit(p) {
  const d = p.fit, s = newSlide();
  tag(s, p.tag);
  title(s, 'Where your brand fits');
  const n = 4, g = 0.2, cw = (W - 2 * M - g * 3) / n, cy = 1.95, ch = 2.35;
  d.cats.forEach((c, i) => {
    const x = M + i * (cw + g), pale = i === 0;
    card(s, x, cy, cw, ch, pale ? PALE : GREY);
    iconSq(s, c.icon, x + 0.28, cy + 0.3, 0.55, pale ? RED : 'FFFFFF', pale ? 'white' : 'red');
    T(s, c.t, { x: x + 0.28, y: cy + 1.0, w: cw - 0.5, h: 0.6, fontFace: H, fontSize: 14.5, bold: true, valign: 'top' });
    T(s, c.d, { x: x + 0.28, y: cy + 1.62, w: cw - 0.5, h: 0.62, fontSize: 11.5, italic: true, color: MUTED, lineSpacingMultiple: 1.05 });
  });
  const jy = 4.55, jh = 2.1;
  card(s, M, jy, W - 2 * M, jh, INK);
  T(s, 'HOW TO JOIN THE STORY', { x: M + 0.4, y: jy + 0.3, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: RED, charSpacing: 1 });
  const jw = (W - 2 * M - 0.8 - 0.6) / 3;
  const jIcons = ['PiHandshakeBold', 'PiFilmSlateBold', 'PiRocketLaunchBold'];
  d.join.forEach((j, i) => {
    const x = M + 0.4 + i * (jw + 0.3);
    s.addImage({ path: I(jIcons[i], 'red'), x, y: jy + 0.85, w: 0.34, h: 0.34 });
    T(s, j.t, { x: x + 0.48, y: jy + 0.8, w: jw - 0.5, h: 0.44, fontFace: H, fontSize: 14, bold: true, color: 'FFFFFF', valign: 'middle' });
    T(s, j.d, { x: x + 0.48, y: jy + 1.28, w: jw - 0.55, h: 0.62, fontSize: 11.5, color: 'C9C9C9' });
  });
  footer(s, d.source);
  s.addNotes(p.fitNotes);
}


const AV_STYLES = ['red', 'dark', 'pink', 'grey'];

function fact(p) {
  const d = p.fact, s = newSlide();
  tag(s, p.tag);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 0.5 + p.tag.length * 0.085 + 0.15, y: 0.42, w: 1.75, h: 0.34, fill: { color: INK }, rectRadius: 0.17, line: { color: INK } });
  T(s, 'SURPRISING FACT', { x: M + 0.5 + p.tag.length * 0.085 + 0.15, y: 0.42, w: 1.75, h: 0.34, fontSize: 10, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', charSpacing: 0.5 });
  T(s, d.big, { x: M, y: 1.05, w: 7.4, h: 1.75, fontFace: H, fontSize: 100, bold: true, color: RED, valign: 'middle' });
  T(s, d.lead, { x: M, y: 2.9, w: 7.3, h: 1.3, fontFace: H, fontSize: 26, bold: true, valign: 'top', lineSpacingMultiple: 1.0 });
  T(s, d.text, { x: M, y: 4.28, w: 7.1, h: 0.8, fontSize: 15, color: '333333', lineSpacingMultiple: 1.08 });
  card(s, M, 5.3, 7.3, 1.35, PALE);
  iconSq(s, 'PiLightbulbBold', M + 0.28, 5.3 + 0.37, 0.6, RED, 'white');
  T(s, [{ text: 'So what: ', options: { bold: true, color: INK } }, { text: d.sowhat, options: { color: '333333' } }],
    { x: M + 1.1, y: 5.3 + 0.15, w: 7.3 - 1.35, h: 1.05, fontSize: 13, valign: 'middle', lineSpacingMultiple: 1.08 });
  // visual: concentric circles + big icon tile
  const cx = 10.45, cy = 3.85;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.35, y: cy - 2.35, w: 4.7, h: 4.7, fill: { color: PALE }, line: { color: PALE } });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.75, y: cy - 1.75, w: 3.5, h: 3.5, fill: { color: 'FFFFFF' }, line: { color: 'FFC2CF', width: 2 } });
  iconSq(s, d.icon, cx - 0.95, cy - 0.95, 1.9, RED, 'white');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx + 0.7, y: cy - 2.05, w: 1.45, h: 0.5, fill: { color: INK }, rectRadius: 0.25, line: { color: INK } });
  T(s, 'Did you know?', { x: cx + 0.7, y: cy - 2.05, w: 1.45, h: 0.5, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.OVAL, { x: cx - 2.2, y: cy + 1.35, w: 0.45, h: 0.45, fill: { color: RED }, line: { color: RED } });
  s.addShape(pres.shapes.OVAL, { x: cx + 1.9, y: cy + 1.0, w: 0.28, h: 0.28, fill: { color: 'FFC2CF' }, line: { color: 'FFC2CF' } });
  footer(s, d.source);
  s.addNotes(d.notes);
}

function creators(p) {
  const d = p.creators, s = newSlide();
  tag(s, p.tag);
  title(s, d.title);
  sub(s, d.sub, 1.62);
  const list = d.list, n = list.length;
  const cols = n <= 8 ? 4 : 5;
  const g = 0.2, cw = (W - 2 * M - g * (cols - 1)) / cols, ch = 2.15, rg = 0.18;
  const y0 = 2.15;
  list.forEach((c, i) => {
    const x = M + (i % cols) * (cw + g), y = y0 + Math.floor(i / cols) * (ch + rg);
    card(s, x, y, cw, ch, GREY);
    s.addImage({ path: A(`banner_${p.key}.png`), x: x + 0.08, y: y + 0.08, w: cw - 0.16, h: 0.55, sizing: { type: 'cover', w: cw - 0.16, h: 0.55 } });
    const av = 0.86, ax = x + (cw - av) / 2, ay = y + 0.26;
    s.addShape(pres.shapes.OVAL, { x: ax - 0.05, y: ay - 0.05, w: av + 0.1, h: av + 0.1, fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF' } });
    s.addImage({ path: A(`av_${p.key}_${i}.png`), x: ax, y: ay, w: av, h: av, altText: `${c.n} channel avatar placeholder (swap via Change Picture)` });
    T(s, c.n, { x: x + 0.08, y: y + 1.16, w: cw - 0.16, h: 0.34, fontFace: H, fontSize: cols === 5 ? 11.5 : 12.5, bold: true, align: 'center', valign: 'middle' });
    const subsTxt = c.views ? `${c.s}  ·  ${c.x}` : `${c.s} subs  ·  ${c.x}`;
    T(s, subsTxt, { x: x + 0.08, y: y + 1.5, w: cw - 0.16, h: 0.24, fontSize: 9.5, color: MUTED, align: 'center', valign: 'middle' });
    const pw = 0.98, px = x + (cw - pw) / 2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: y + 1.8, w: pw, h: 0.26, fill: { color: INK }, rectRadius: 0.13, line: { color: INK } });
    T(s, 'Subscribe', { x: px, y: y + 1.8, w: pw, h: 0.26, fontSize: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  });
  T(s, 'The creators featured are for illustrative purposes only, other creators also available upon request.', { x: M, y: 6.68, w: 10, h: 0.28, fontSize: 9.5, italic: true, color: LIGHT });
  footer(s, d.source);
  const lines = list.map(c => `${c.n}: ${c.s}${c.views ? '' : ' subscribers'} (${c.x}). youtube.com/channel/${c.url}`).join('\n');
  s.addNotes(`Avatars are monogram placeholders: right-click each circle and use Replace image / Change Picture with the real channel avatar.\nChannels (Social Blade, checked Sep 2026):\n${lines}\nBrand-safety screen: local press searched for each channel; creators with controversies, political content, kids-directed channels and anonymous channels were excluded.`);
}

function dominate(p) {
  const s = newSlide();
  tag(s, p.tag);
  title(s, `Dominate the key opinion leaders for ${p.what}, while owning the trending moments`, { h: 1.1, fontSize: 26, valign: 'top' });
  // left: 5 content angles
  const lx = M, ly = 2.15, lw = 7.55, lh = 4.45;
  card(s, lx, ly, lw, lh, GREY);
  T(s, '5 CONTENT ANGLES TO MAKE WITH THESE CREATORS', { x: lx + 0.3, y: ly + 0.2, w: lw - 0.6, h: 0.3, fontSize: 10.5, bold: true, color: RED, charSpacing: 1 });
  const rowH = (lh - 0.65) / 5;
  p.angles.forEach((a, i) => {
    const y = ly + 0.6 + i * rowH;
    s.addShape(pres.shapes.OVAL, { x: lx + 0.3, y: y + 0.08, w: 0.42, h: 0.42, fill: { color: i === 0 ? RED : INK }, line: { color: i === 0 ? RED : INK } });
    T(s, String(i + 1), { x: lx + 0.3, y: y + 0.08, w: 0.42, h: 0.42, fontFace: H, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, [{ text: a.t, options: { bold: true, color: INK, fontFace: H } }, { text: '  ' + a.d, options: { color: '444444' } }],
      { x: lx + 0.9, y: y + 0.02, w: lw - 1.15, h: 0.36, fontSize: 12, valign: 'middle' });
    T(s, [{ text: 'With: ', options: { color: MUTED } }, { text: a.with, options: { bold: true, color: RED } }],
      { x: lx + 0.9, y: y + 0.36, w: lw - 1.15, h: 0.26, fontSize: 10.5, valign: 'middle' });
    if (i < 4) s.addShape(pres.shapes.LINE, { x: lx + 0.9, y: y + rowH - 0.04, w: lw - 1.2, h: 0, line: { color: 'E0E0E0', width: 0.75 } });
  });
  // right: roadblock + velotrend
  const rx = lx + lw + 0.25, rw = W - M - rx;
  card(s, rx, ly, rw, 2.15, PALE);
  tag(s, 'ROADBLOCK', rx + 0.25, ly + 0.2);
  T(s, '100% share of voice across these creators', { x: rx + 0.25, y: ly + 0.6, w: rw - 0.5, h: 0.5, fontFace: H, fontSize: 13.5, bold: true });
  s.addImage({ path: A('roadblock.png'), x: rx + (rw - 3.1) / 2, y: ly + 1.12, w: 3.1, h: 0.99 });
  const vy = ly + 2.3, vh = lh - 2.3;
  card(s, rx, vy, rw, vh, GREY);
  tag(s, 'VELOTREND / LINEUP', rx + 0.25, vy + 0.2, INK);
  iconSq(s, 'PiTrendUpBold', rx + rw - 0.7, vy + 0.15, 0.45, RED, 'white');
  const n = p.lineups.length, lrh = (vh - 0.75 - 0.1 * (n - 1)) / n;
  p.lineups.forEach((l, i) => {
    const y = vy + 0.68 + i * (lrh + 0.1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx + 0.25, y, w: rw - 0.5, h: lrh, fill: { color: 'FFFFFF' }, rectRadius: 0.08, line: { color: 'E3E3E3', width: 1 } });
    s.addImage({ path: I('PiFireBold', 'red'), x: rx + 0.38, y: y + (lrh - 0.28) / 2, w: 0.28, h: 0.28 });
    T(s, l.t, { x: rx + 0.78, y: y + 0.07, w: rw - 1.15, h: 0.27, fontSize: 10, bold: true, valign: 'middle' });
    T(s, l.d, { x: rx + 0.78, y: y + 0.34, w: rw - 1.15, h: lrh - 0.38, fontSize: 9, color: MUTED, valign: 'top' });
  });
  T(s, '* Creators featured are for illustrative purposes only. Please contact your Account Manager for estimated impressions and investment (DVIP applies).', { x: M, y: 6.68, w: 12, h: 0.28, fontSize: 9, color: LIGHT });
  footer(s, null);
  s.addNotes(`Content angles:\n${p.angles.map((a, i) => `${i + 1}. ${a.t}: ${a.d}. Creators: ${a.with}.`).join('\n')}\nIntegration guardrails: brand time capped, no forced insertions, mentions in the host's own voice.\nRoadblock: 100% share of voice on the ${p.what} creators shown on the previous slide, around key moments. VeloTrend / Lineup: ${p.lineups.map(l => l.t + ' (' + l.d + ')').join('; ')}. Lineup IDs to be confirmed by your Account Manager.`);
}

C.pillars.forEach(p => {
  divider(p);
  fact(p);
  if (p.insight.type === 'bars') insightBars(p); else insightStats(p);
  working(p);
  fit(p);
  creators(p);
  dominate(p);
});

// ---------------------------------------------------------------- SOURCES
(function sources() {
  const s = newSlide();
  title(s, 'Sources', { y: 0.55 });
  iconSq(s, 'PiBookOpenBold', W - M - 0.6, 0.62, 0.6, RED, 'white');
  const items = C.sources.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < C.sources.length - 1, paraSpaceAfter: 10 } }));
  T(s, items, { x: M, y: 1.6, w: W - 2 * M, h: 5.2, fontSize: 13, color: '333333', valign: 'top' });
  footer(s, null);
  s.addNotes('Full source list. All figures are public; no YouTube internal data is used. Subscriber counts from Social Blade, checked September 2026, change daily.');
})();

// write icon list for asset generation + avatars list
fs.writeFileSync(path.join(WORK, 'icons.json'), JSON.stringify([...usedIcons]));
const avs = [];
C.pillars.forEach(p => p.creators.list.forEach((c, i) => avs.push({ initials: c.i, style: c.st || AV_STYLES[i % 4], file: `av_${p.key}_${i}.png` })));
fs.writeFileSync(path.join(WORK, 'avatars.json'), JSON.stringify(avs));

const DRY = process.argv.includes('--dry');
if (!DRY) {
  fs.mkdirSync(path.join(WORK, 'out'), { recursive: true });
  pres.writeFile({ fileName: path.join(WORK, 'out', C.file) }).then(f => console.log('wrote', f, 'slides', page));
} else console.log('dry run, slides', page, 'icons', usedIcons.size);
