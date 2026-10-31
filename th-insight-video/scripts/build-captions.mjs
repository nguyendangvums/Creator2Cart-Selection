// Bundles scripts/captions.ts with esbuild and runs it to write the .srt file.
import {buildSync} from 'esbuild';
import {execFileSync} from 'node:child_process';

buildSync({entryPoints: ['scripts/captions.ts'], bundle: true, platform: 'node', format: 'cjs', outfile: 'out/captions.cjs'});
execFileSync('node', ['out/captions.cjs', ...process.argv.slice(2)], {stdio: 'inherit'});
