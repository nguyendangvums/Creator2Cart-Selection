import React from 'react';
import {Composition} from 'remotion';
import {InsightVideo, TOTAL} from './Video';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => (
  <Composition id="InsightVideo" component={InsightVideo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
