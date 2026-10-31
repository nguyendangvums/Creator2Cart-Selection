import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {sections} from './data';
import {C, FPS, T} from './theme';
import {loadFonts} from './fonts';
import {ScreensScene, ShiningScene, SixScene, TitleScene} from './scenes/Intro';
import {BrandScene, CoverScene, CreatorsScene, FactScene, PlayScene, ProofScene} from './scenes/Section';
import {AmplifyScene, OutroScene} from './scenes/Outro';

loadFonts();

type Enter = 'slide' | 'wipe' | 'fade';
type Scene = {id: string; dur: number; enter: Enter; el: React.ReactNode};

const OUTRO = 210;

export const scenes: Scene[] = [
  {id: 'title', dur: 170, enter: 'fade', el: <TitleScene />},
  {id: 'shining', dur: 250, enter: 'slide', el: <ShiningScene />},
  {id: 'screens', dur: 226, enter: 'slide', el: <ScreensScene />},
  {id: 'six', dur: 226, enter: 'slide', el: <SixScene />},
  ...sections.flatMap((s): Scene[] => [
    {id: `${s.num}-cover`, dur: 100, enter: 'wipe', el: <CoverScene s={s} />},
    {id: `${s.num}-fact`, dur: 168, enter: 'slide', el: <FactScene s={s} />},
    {id: `${s.num}-proof`, dur: 148, enter: 'slide', el: <ProofScene s={s} />},
    {id: `${s.num}-play`, dur: 172, enter: 'slide', el: <PlayScene s={s} />},
    {id: `${s.num}-brand`, dur: 146, enter: 'slide', el: <BrandScene s={s} />},
    {id: `${s.num}-creators`, dur: 118, enter: 'slide', el: <CreatorsScene s={s} />},
  ]),
  {id: 'amplify', dur: 312, enter: 'wipe', el: <AmplifyScene />},
  {id: 'outro', dur: OUTRO, enter: 'slide', el: <OutroScene dur={OUTRO} />},
];

export const TOTAL = scenes.reduce((a, s) => a + s.dur, 0) - T * (scenes.length - 1);

const MUSIC_SECONDS = 198.5;
// Start the track so its natural ending lands on our last frame.
const MUSIC_OFFSET = Math.max(0, Math.round((MUSIC_SECONDS - TOTAL / FPS - 0.4) * FPS));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentation = (e: Enter): any => {
  if (e === 'wipe') return wipe({direction: 'from-left'});
  if (e === 'fade') return fade();
  return slide({direction: 'from-right'});
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const p = frame / (TOTAL - 1);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: '#F1F1F1'}}>
      <div style={{width: `${p * 100}%`, height: '100%', background: C.red}} />
    </div>
  );
};

export const InsightVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.white}}>
      <TransitionSeries>
        {scenes.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={presentation(s.enter)}
                timing={springTiming({config: {damping: 200}, durationInFrames: T})}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={s.dur}>{s.el}</TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Progress />
      <Audio
        src={staticFile('music/harbor-notes.mp3')}
        startFrom={MUSIC_OFFSET}
        volume={(f) =>
          0.5 *
          interpolate(f, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
          interpolate(f, [TOTAL - 90, TOTAL - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    </AbsoluteFill>
  );
};
