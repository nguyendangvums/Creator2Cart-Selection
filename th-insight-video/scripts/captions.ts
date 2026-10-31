// Builds out/th-creator-insight-2026.en.srt from the same data and timeline the video uses.
// Run: node scripts/build-captions.mjs [en|th]
import {writeFileSync} from 'node:fs';
import {screens, sections, shining} from '../src/data';
import {Beat, starts, timeline} from '../src/timeline';
import {thai} from './captions.th';

const LANG = process.argv[2] === 'th' ? 'th' : 'en';
// Visible width: Thai vowel and tone marks stack on the base letter and take no space.
const vis = (t: string) => t.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').length;

const FPS = 30;
const MAX_LINE = 42;
const plain = (t: string) => t.replace(/\*/g, '');
const list = (xs: string[]) => xs.join(', ');

type Cue = {at: number; text: string}; // `at` = scene-local frame before pacing

const SIX = sections.map((s) => `${s.num} ${s.title}`);

const andMore = (xs: string[], n: number) => `${xs.slice(0, n).join(', ')} and more`;
const pairs = <X,>(xs: X[]) => [xs.slice(0, 2), xs.slice(2)];

const cuesFor = (b: Beat): Cue[] => {
  const s = b.section !== undefined ? sections[b.section] : undefined;
  switch (b.kind) {
    case 'title':
      return [
        {at: 6, text: 'Capture the Culture. Capitalise on the Trend.'},
        {at: 52, text: 'YouTube Creator Content Insight 2026: Thailand'},
      ];
    case 'shining':
      return [
        {at: 4, text: 'On YouTube, Thai content keeps shining.'},
        {at: 34, text: '40% of views come a month or more after upload. 1,300 Thai channels have 1M+ subscribers.'},
        {at: 122, text: '90% call YouTube the most trusted video platform, with 1.71x higher ROI than TV.'},
      ];
    case 'screens':
      return [
        {at: 4, text: 'Thailand watches YouTube on every screen.'},
        {at: 32, text: "TV: 75% of a top travel creator's views. Podcast viewing: up 50% year on year."},
        {at: 112, text: 'Shorts uploads: up 85%. Live: 122K peak viewers for RoV Pro League.'},
      ];
    case 'six':
      return [
        {at: 2, text: "Six things Thailand can't stop watching:"},
        {at: 22, text: SIX.slice(0, 3).join(' · ')},
        {at: 73, text: SIX.slice(3).join(' · ')},
      ];
    case 'cover':
      return [{at: 6, text: `${s!.num} · ${s!.pre} ${s!.title}. ${s!.desc}`}];
    case 'fact':
      return [
        {at: 10, text: `Did you know? ${s!.fact.stat}: ${plain(s!.fact.headline)}.`},
        {at: 84, text: `So what: ${s!.fact.soWhat}`},
      ];
    case 'proof': {
      const p = s!.proof;
      const statText = (st: (typeof p.stats)[number]) => `${st.value} ${st.label}${st.channel ? ` (${st.channel})` : ''}.`;
      if (p.chart) {
        return [
          {at: 6, text: `${plain(p.headline)}. Top channels: ${list(p.chart.slice(0, 3).map((r) => `${r.label} ${r.display}`))}.`},
          {at: 66, text: p.stats.map(statText).join(' ')},
        ];
      }
      return [
        {at: 6, text: `${plain(p.headline)}.`},
        {at: 22, text: p.stats.slice(0, 2).map(statText).join(' ')},
        {at: 74, text: statText(p.stats[2])},
      ];
    }
    case 'play': {
      const [m1, m2] = pairs(s!.play.moments);
      const mt = (ms: typeof m1) => ms.map((m) => `${m.date}, ${m.label}`).join('; ');
      return [
        {at: 4, text: `${plain(s!.play.headline)}. What works: ${list(s!.play.formats.map((f) => f.title))}.`},
        {at: 74, text: `Moments to own: ${mt(m1)}.`},
        {at: 100, text: `${mt(m2)}.`},
      ];
    }
    case 'brand':
      return [
        {at: 4, text: `Where your brand fits: ${list(s!.brand.categories.map((c) => c.title))}.`},
        {at: 68, text: `Ways in: ${list(s!.brand.ideas.map((x) => x.title))}.`},
      ];
    case 'creators':
      return [{at: 4, text: `Creators to know: ${andMore(s!.creators.list.map((c) => c.name), 4)}.`}];
    case 'amplify':
      return [
        {at: 6, text: "Amplify what's already working: boost creator content together with your brand ads."},
        {at: 70, text: 'Creator trust plus brand reach: one moment, two voices, bigger impact.'},
        {at: 150, text: 'Own the moment. Ride the trend. Boost the best clips.'},
      ];
    case 'outro':
      return [
        {at: 36, text: 'Capture the Culture. Capitalise on the Trend.'},
        {at: 66, text: 'YouTube Creator Content Insight 2026: Thailand'},
      ];
  }
};

/** Best two-line break with both lines <= MAX_LINE, or null if impossible. */
const twoLines = (ws: string[]): string[] | null => {
  const t = ws.join(' ');
  if (vis(t) <= MAX_LINE) return [t];
  let best: string[] | null = null;
  let bestScore = Infinity;
  for (let k = 1; k < ws.length; k++) {
    const l1 = ws.slice(0, k).join(' ');
    const l2 = ws.slice(k).join(' ');
    if (vis(l1) > MAX_LINE || vis(l2) > MAX_LINE) continue;
    const score = Math.max(vis(l1), vis(l2));
    if (score < bestScore) {
      bestScore = score;
      best = [l1, l2];
    }
  }
  return best;
};

/** Split text into the fewest cues of up to two balanced lines, with even text per cue. */
const chunk = (text: string): string[][] => {
  const words = text.split(' ');
  for (let n = Math.max(1, Math.ceil(vis(text) / 84)); n <= words.length; n++) {
    const target = vis(text) / n;
    const groups: string[][] = [];
    let cur: string[] = [];
    let acc = 0;
    words.forEach((w, i) => {
      cur.push(w);
      acc += vis(w) + 1;
      const left = words.length - i - 1;
      if (acc >= target * (groups.length + 1) && groups.length < n - 1 && left > 0) {
        groups.push(cur);
        cur = [];
      }
    });
    if (cur.length) groups.push(cur);
    const cues = groups.map(twoLines);
    if (cues.every((c) => c !== null)) return cues as string[][];
  }
  return [[text]];
};

const ts = (frames: number) => {
  const ms = Math.round((frames / FPS) * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(sec)},${p(r, 3)}`;
};

type Out = {start: number; end: number; lines: string[]};
const out: Out[] = [];
const CPS = 17; // reading speed, characters per second
timeline.forEach((b, bi) => {
  const begin = starts[bi];
  const sceneEnd = bi + 1 < starts.length ? starts[bi + 1] + 4 : begin + b.dur;
  const items: {reveal: number; lines: string[]}[] = [];
  const cues = LANG === 'th' ? thai[b.id] : cuesFor(b);
  if (!cues) throw new Error(`missing ${LANG} captions for ${b.id}`);
  for (const c of cues) {
    const parts = chunk(c.text);
    parts.forEach((lines, k) => items.push({reveal: begin + Math.round(c.at * b.pace) + 4 + k, lines}));
  }
  // Schedule: never before the text appears on screen, long enough to read.
  const sched: Out[] = [];
  let prevEnd = 0;
  items.forEach((it, i) => {
    const start = Math.max(it.reveal, prevEnd);
    const need = Math.min(6, Math.max(1.6, vis(it.lines.join(' ')) / CPS)) * FPS;
    const nextReveal = i + 1 < items.length ? items[i + 1].reveal : sceneEnd;
    const end = Math.max(start + need, nextReveal);
    sched.push({start, end, lines: it.lines});
    prevEnd = end;
  });
  // If the scene overflows, compress proportionally into the scene window.
  const first = sched[0].start;
  const last = sched[sched.length - 1].end;
  if (last > sceneEnd) {
    const k = (sceneEnd - first) / (last - first);
    sched.forEach((c) => {
      c.start = Math.round(first + (c.start - first) * k);
      c.end = Math.round(first + (c.end - first) * k);
    });
  }
  out.push(...sched);
});
// Never overlap: trim each cue to the next one's start.
for (let i = 0; i < out.length - 1; i++) out[i].end = Math.min(out[i].end, out[i + 1].start);

const srt = out.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.lines.join('\n')}\n`).join('\n');
const target = `out/th-creator-insight-2026.${LANG}.srt`;
writeFileSync(target, srt);
console.log(`${out.length} cues -> ${target}`);
const short = out.filter((c) => (c.end - c.start) / FPS < 1.5);
if (short.length) console.log('short cues:', short.map((c) => `${ts(c.start)} ${c.lines.join(' ')}`));
