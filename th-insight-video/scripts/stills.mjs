// Usage: node scripts/stills.mjs 120 400 ...   -> out/stills/f<frame>.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium';
const composition = await selectComposition({serveUrl, id: 'InsightVideo', browserExecutable});
for (const frame of frames) {
  await renderStill({composition, serveUrl, frame, output: `out/stills/f${frame}.png`, browserExecutable});
  console.log('ok', frame);
}
