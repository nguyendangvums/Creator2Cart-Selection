import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {sections} from './data';
import {Beat, Enter, TOTAL, timeline} from './timeline';
import {C, FPS, T} from './theme';
import {PaceContext} from './ui';
import {loadFonts} from './fonts';
import {ScreensScene, ShiningScene, SixScene, TitleScene} from './scenes/Intro';
import {BrandScene, CoverScene, CreatorsScene, FactScene, PlayScene, ProofScene} from './scenes/Section';
import {AmplifyScene, OutroScene} from './scenes/Outro';

loadFonts();

const render = (b: Beat): React.ReactNode => {
  const s = b.section !== undefined ? sections[b.section] : undefined;
  switch (b.kind) {
    case 'title':
      return <TitleScene />;
    case 'shining':
      return <ShiningScene />;
    case 'screens':
      return <ScreensScene />;
    case 'six':
      return <SixScene />;
    case 'cover':
      return <CoverScene s={s!} />;
    case 'fact':
      return <FactScene s={s!} />;
    case 'proof':
      return <ProofScene s={s!} />;
    case 'play':
      return <PlayScene s={s!} />;
    case 'brand':
      return <BrandScene s={s!} />;
    case 'creators':
      return <CreatorsScene s={s!} />;
    case 'amplify':
      return <AmplifyScene />;
    case 'outro':
      return <OutroScene dur={b.dur} />;
  }
};

export {TOTAL};

const MUSIC_VOL = 0.5;
const XF = 30; // half crossfade, frames
const SECOND_PASS_FROM = Math.round(32.16 * FPS); // song position for the second pass
const JOIN = Math.round(157.49 * FPS); // video frame of the join (for TOTAL = 9700)
const clampI = (f: number, i: [number, number], o: [number, number]) =>
  interpolate(f, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

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
        {timeline.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={presentation(s.enter)}
                timing={springTiming({config: {damping: 200}, durationInFrames: T})}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={s.dur}>
              <PaceContext.Provider value={s.pace}>{render(s)}</PaceContext.Provider>
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Progress />
      {/* Music: the track plays from the top, then crossfades (2 s) into a second pass that
          starts at a matching beat and harmony, so its natural ending lands on the last frame.
          Join point found by onset and chroma correlation (scripts notes in README). */}
      <Audio
        src={staticFile('music/harbor-notes.mp3')}
        volume={(f) => MUSIC_VOL * clampI(f, [0, 30], [0, 1]) * clampI(f, [JOIN - XF, JOIN + XF], [1, 0])}
      />
      <Sequence from={JOIN - XF} layout="none">
        <Audio
          src={staticFile('music/harbor-notes.mp3')}
          startFrom={SECOND_PASS_FROM - XF}
          volume={(f) =>
            MUSIC_VOL *
            clampI(f, [0, 2 * XF], [0, 1]) *
            clampI(f + JOIN - XF, [TOTAL - 75, TOTAL - 2], [1, 0])
          }
        />
      </Sequence>
    </AbsoluteFill>
  );
};
