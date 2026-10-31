// Scene order, length and pacing. Shared by the video and the caption builder.
import {sections} from './data';
import {T} from './theme';

export type Enter = 'slide' | 'wipe' | 'fade';
export type Kind =
  | 'title'
  | 'shining'
  | 'screens'
  | 'six'
  | 'cover'
  | 'fact'
  | 'proof'
  | 'play'
  | 'brand'
  | 'creators'
  | 'amplify'
  | 'outro';
export type Beat = {id: string; kind: Kind; dur: number; enter: Enter; pace: number; section?: number};

// Section beats run at roughly half speed so every insight can be read.
const SECTION: [Kind, number, number][] = [
  ['cover', 130, 1.3],
  ['fact', 300, 1.9],
  ['proof', 270, 1.9],
  ['play', 320, 1.9],
  ['brand', 270, 1.9],
  ['creators', 190, 1.6],
];

export const timeline: Beat[] = [
  {id: 'title', kind: 'title', dur: 170, enter: 'fade', pace: 1},
  {id: 'shining', kind: 'shining', dur: 250, enter: 'slide', pace: 1},
  {id: 'screens', kind: 'screens', dur: 226, enter: 'slide', pace: 1},
  {id: 'six', kind: 'six', dur: 226, enter: 'slide', pace: 1},
  ...sections.flatMap((s, si): Beat[] =>
    SECTION.map(([kind, dur, pace]) => ({
      id: `${s.num}-${kind}`,
      kind,
      dur,
      pace,
      section: si,
      enter: kind === 'cover' ? 'wipe' : 'slide',
    })),
  ),
  {id: 'amplify', kind: 'amplify', dur: 312, enter: 'wipe', pace: 1},
  {id: 'outro', kind: 'outro', dur: 210, enter: 'slide', pace: 1},
];

/** Absolute start frame of each beat (transitions overlap by T frames). */
export const starts: number[] = timeline.reduce<number[]>((acc, b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + timeline[i - 1].dur - T);
  return acc;
}, []);

export const TOTAL = starts[starts.length - 1] + timeline[timeline.length - 1].dur;
