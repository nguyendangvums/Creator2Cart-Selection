import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {screens, sections, shining} from '../data';
import {C, F} from '../theme';
import {
  ChannelTag,
  Counter,
  Dot,
  Floating,
  Headline,
  IconTile,
  Illus,
  Page,
  Pill,
  Pop,
  Reveal,
  Rings,
  Sfx,
  Source,
  lerp,
  useIn,
} from '../ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const TitleScene: React.FC = () => {
  const lines: {t: string; size: number; color: string; d: number}[] = [
    {t: 'Capture the', size: 88, color: C.ink, d: 6},
    {t: 'Culture', size: 176, color: C.ink, d: 12},
    {t: 'Capitalise on the', size: 68, color: C.red, d: 28},
    {t: 'Trend', size: 176, color: C.red, d: 34},
  ];
  return (
    <Page>
      <Rings x={1880} y={70} r={70} delay={30} />
      <Rings x={1000} y={1040} r={60} delay={40} />
      <div style={{position: 'absolute', left: 120, top: 210}}>
        <Pill delay={0} size={22}>
          YouTube Creator Content Insight 2026
        </Pill>
        <div style={{marginTop: 34}}>
          {lines.map((l) => (
            <Reveal key={l.t} delay={l.d} x={-50} y={0}>
              <div
                style={{
                  fontFamily: F.head,
                  fontWeight: 800,
                  fontSize: l.size,
                  lineHeight: l.size > 100 ? 0.98 : 1.1,
                  letterSpacing: -l.size * 0.02,
                  color: l.color,
                }}
              >
                {l.t}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={52}>
          <div style={{marginTop: 40, fontFamily: F.body, fontSize: 32, color: C.body}}>
            YouTube Creator Content Insight 2026 · <b style={{color: C.ink}}>Thailand</b>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div style={{marginTop: 10, fontFamily: F.body, fontSize: 20, color: C.faint}}>C&C SEAS · @ngdvu</div>
        </Reveal>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1010,
          top: 30,
          display: 'grid',
          gridTemplateColumns: '430px 430px',
          gap: '6px 10px',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Pop key={i} delay={10 + i * 7}>
            <Floating amp={7} speed={38} phase={i * 1.3}>
              <Illus name={`hero${i}`} width={430} />
            </Floating>
          </Pop>
        ))}
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} at={10 + i * 7} name={`note${i}`} vol={0.3} />
      ))}
      <Sfx at={13} name="impact" vol={0.55} />
      <Sfx at={34} name="swoosh" vol={0.5} />
    </Page>
  );
};

const StatCards: React.FC<{
  items: typeof shining;
  dark?: boolean;
  start: number;
  gap: number;
}> = ({items, dark, start, gap}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 120, right: 120, top: 330, display: 'flex', gap: 30}}>
      {items.map((s, i) => {
        const d = start + i * gap;
        const active = frame >= d && frame < d + gap && frame < start + items.length * gap;
        const lift = interpolate(frame, [d, d + 8, d + gap - 6, d + gap], [0, 1, 1, 0], clamp);
        const hot = i < 2 || dark;
        const bg = dark ? C.ink : i < 2 ? C.pink : C.grey;
        return (
          <Reveal key={s.kicker} delay={d} y={70} style={{flex: '1 1 0', minWidth: 0}}>
            <div
              style={{
                height: 560,
                borderRadius: 30,
                background: bg,
                padding: 46,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${-lift * 14}px)`,
                boxShadow: active ? `0 ${24 * lift}px ${60 * lift}px rgba(255,0,51,${0.18 * lift})` : 'none',
                outline: `${3 * lift}px solid ${C.red}`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <IconTile name={s.icon} size={78} bg={dark ? C.red : hot ? C.red : C.ink} />
                <div
                  style={{
                    fontFamily: F.body,
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: hot ? C.red : C.muted,
                  }}
                >
                  {s.kicker}
                </div>
              </div>
              <div
                style={{
                  marginTop: 70,
                  fontFamily: F.head,
                  fontWeight: 800,
                  fontSize: 116,
                  letterSpacing: -3,
                  color: hot ? C.red : C.ink,
                  lineHeight: 1,
                }}
              >
                <Counter value={s.value} delay={d + 4} dur={30} />
              </div>
              <div
                style={{
                  marginTop: 34,
                  fontFamily: F.body,
                  fontSize: 31,
                  lineHeight: 1.3,
                  color: dark ? 'rgba(255,255,255,0.78)' : C.body,
                }}
              >
                {s.label}
              </div>
              {s.avatar && s.channel ? (
                <div style={{marginTop: 'auto'}}>
                  <ChannelTag id={s.avatar} name={s.channel} dark={dark} size={56} />
                </div>
              ) : null}
            </div>
            <Sfx at={d} name="pop" vol={0.45} />
            <Sfx at={d + 30} name="ding" vol={0.3} />
          </Reveal>
        );
      })}
    </div>
  );
};

export const ShiningScene: React.FC = () => (
  <Page>
    <Rings x={1840} y={110} r={60} delay={20} opacity={0.8} />
    <div style={{position: 'absolute', left: 120, top: 110}}>
      <Headline text="On YouTube, Thai content keeps *shining*" size={78} delay={4} />
      <Reveal delay={22}>
        <div style={{marginTop: 18, fontFamily: F.body, fontSize: 32, color: C.muted}}>
          Longevity, scale, trust and return, on one platform
        </div>
      </Reveal>
    </div>
    <StatCards items={shining} start={34} gap={44} />
    <Source text="Google, YouTube Works Awards Thailand 2026; Bangkok Post (2025); Analytic Edge MMM (2021 to 2025)" delay={40} />
    <Sfx at={0} name="whoosh" vol={0.5} />
  </Page>
);

export const ScreensScene: React.FC = () => (
  <Page>
    <Rings x={1840} y={110} r={60} delay={20} opacity={0.8} />
    <div style={{position: 'absolute', left: 120, top: 110}}>
      <Headline text="Thailand watches YouTube on *every screen*" size={78} delay={4} />
      <Reveal delay={22}>
        <div style={{marginTop: 18, fontFamily: F.body, fontSize: 32, color: C.muted}}>
          Living-room TV, long-form, Shorts and live
        </div>
      </Reveal>
    </div>
    <StatCards items={screens} dark start={32} gap={40} />
    <Source text="Google, YouTube Works Awards Thailand 2026; Google via RAiNMaker (Jun 2026); Esports Charts" delay={40} />
    <Sfx at={0} name="whoosh" vol={0.5} />
  </Page>
);

const SIX_DESC = [
  'Lakorn, BL series and variety, streamed like prime time',
  'Country roots meet rap, and every top hit is Thai',
  'Horror nights, karma tales and ghost hunts',
  'Podcasts and talk shows Gen Z actually finishes',
  'Street food, food trips and local escapes',
  'Gaming creators and RoV nights for the whole family',
];

export const SixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [176, 192], [0, 1], clamp);
  return (
    <Page>
      <div style={{position: 'absolute', left: 120, top: 100}}>
        <Headline text="Six things Thailand *can't stop watching*" size={78} delay={2} />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 250}}>
        {sections.map((s, i) => {
          const d = 22 + i * 17;
          const p = useIn(d);
          const dim = i === 0 ? 1 : lerp(focus, 1, 0.28);
          return (
            <div
              key={s.num}
              style={{
                position: 'relative',
                height: 124,
                display: 'flex',
                alignItems: 'center',
                opacity: p * dim,
                transform: `translateX(${lerp(p, -60, 0)}px) scale(${i === 0 ? lerp(focus, 1, 1.03) : 1})`,
                transformOrigin: 'left center',
              }}
            >
              <IconTile name={s.icon} size={78} bg={i % 2 === 0 ? C.red : C.ink} />
              <div
                style={{
                  marginLeft: 34,
                  width: 90,
                  fontFamily: F.head,
                  fontWeight: 800,
                  fontSize: 46,
                  color: C.red,
                }}
              >
                {s.num}
              </div>
              <div style={{width: 640, fontFamily: F.head, fontWeight: 700, fontSize: 50, color: C.ink}}>{s.title}</div>
              <div style={{fontFamily: F.body, fontSize: 30, color: C.muted}}>{SIX_DESC[i]}</div>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  background: C.line,
                  transformOrigin: 'left',
                  transform: `scaleX(${p})`,
                }}
              />
              <Sfx at={d} name={`note${i}`} vol={0.4} />
            </div>
          );
        })}
      </div>
      <Dot x={1790} y={150} r={16} delay={40} />
      <Sfx at={0} name="whoosh" vol={0.5} />
      <Sfx at={176} name="riser" vol={0.5} />
    </Page>
  );
};
