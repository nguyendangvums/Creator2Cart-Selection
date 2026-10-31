import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {sections} from '../data';
import {C, F} from '../theme';
import {Dot, Headline, Icon, IconTile, Page, Pill, Pop, Reveal, Rings, Sfx} from '../ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EqCard: React.FC<{
  delay: number;
  icon: string;
  title: string;
  sub: string;
  bg: string;
  fg: string;
  subFg: string;
  tile: string;
  tileFg: string;
  width: number;
}> = ({delay, icon, title, sub, bg, fg, subFg, tile, tileFg, width}) => (
  <Pop delay={delay} style={{width}}>
    <div
      style={{
        height: 300,
        borderRadius: 30,
        background: bg,
        padding: 42,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <IconTile name={icon} size={84} bg={tile} fg={tileFg} />
      <div>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 46, color: fg}}>{title}</div>
        <div style={{marginTop: 8, fontFamily: F.body, fontSize: 28, color: subFg}}>{sub}</div>
      </div>
    </div>
  </Pop>
);

const Op: React.FC<{delay: number; children: string}> = ({delay, children}) => (
  <Pop delay={delay} from={0.2}>
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: '50%',
        background: C.white,
        border: `3px solid ${C.line}`,
        color: C.red,
        fontFamily: F.head,
        fontWeight: 800,
        fontSize: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  </Pop>
);

const TACTICS = [
  {icon: 'p11_124', title: 'Own the moment', desc: "Show up on the top creators' videos when it matters most"},
  {icon: 'p12_130', title: 'Ride the trend', desc: "Follow what's trending in each passion point, right now"},
  {icon: 'p12_128', title: 'Boost the best clips', desc: 'Turn standout creator moments into Shorts and video ads'},
];

export const AmplifyScene: React.FC = () => (
  <Page>
    <div style={{position: 'absolute', left: 120, top: 84}}>
      <Pill delay={2}>Amplify</Pill>
    </div>
    <div style={{position: 'absolute', left: 120, top: 160, width: 1700}}>
      <Headline text="Amplify what's *already working*" size={78} delay={6} />
      <Reveal delay={22}>
        <div style={{marginTop: 14, fontFamily: F.body, fontSize: 34, color: C.muted}}>
          Boost creator content together with your brand ads
        </div>
      </Reveal>
    </div>
    <div style={{position: 'absolute', left: 120, top: 380, display: 'flex', alignItems: 'center', gap: 18}}>
      <EqCard
        delay={40}
        icon="p11_116"
        title="Creator content"
        sub="Trust, culture and fandom"
        bg={C.pink}
        fg={C.ink}
        subFg={C.body}
        tile={C.red}
        tileFg={C.white}
        width={500}
      />
      <Op delay={58}>+</Op>
      <EqCard
        delay={70}
        icon="p11_120"
        title="Brand ads"
        sub="Reach, frequency and message"
        bg={C.ink}
        fg={C.white}
        subFg="rgba(255,255,255,0.72)"
        tile={C.red}
        tileFg={C.white}
        width={500}
      />
      <Op delay={92}>=</Op>
      <EqCard
        delay={104}
        icon="p09_074"
        title="Bigger impact"
        sub="One moment, two voices"
        bg={C.red}
        fg={C.white}
        subFg="rgba(255,255,255,0.85)"
        tile={C.white}
        tileFg={C.red}
        width={440}
      />
    </div>
    <div style={{position: 'absolute', left: 120, right: 120, top: 730, display: 'flex', gap: 30}}>
      {TACTICS.map((t, i) => {
        const d = 150 + i * 18;
        return (
          <Reveal key={t.title} delay={d} y={50} style={{flex: '1 1 0', minWidth: 0}}>
            <div
              style={{
                height: 210,
                borderRadius: 28,
                border: `2px solid ${C.line}`,
                padding: '34px 38px',
                boxSizing: 'border-box',
                display: 'flex',
                gap: 24,
              }}
            >
              <Icon name={t.icon} size={60} color={C.red} />
              <div>
                <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.ink}}>{t.title}</div>
                <div style={{marginTop: 10, fontFamily: F.body, fontSize: 27, lineHeight: 1.35, color: C.body}}>
                  {t.desc}
                </div>
              </div>
            </div>
            <Sfx at={d} name={`note${i + 1}`} vol={0.38} />
          </Reveal>
        );
      })}
    </div>
    <Sfx at={0} name="whoosh" vol={0.5} />
    <Sfx at={40} name="pop" vol={0.4} />
    <Sfx at={70} name="pop" vol={0.4} />
    <Sfx at={104} name="impact" vol={0.55} />
    <Sfx at={106} name="ding" vol={0.32} />
  </Page>
);

export const OutroScene: React.FC<{dur: number}> = ({dur: durationInFrames}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [durationInFrames - 24, durationInFrames - 4], [1, 0], clamp);
  return (
    <Page>
      <div style={{position: 'absolute', inset: 0, opacity: out}}>
        <Rings x={180} y={170} r={90} delay={10} />
        <Rings x={1760} y={900} r={110} delay={16} />
        <Dot x={1700} y={180} r={20} delay={24} />
        <Dot x={260} y={880} r={14} color={C.pinkMid} delay={30} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{display: 'flex', gap: 22}}>
            {sections.map((s, i) => (
              <Pop key={s.num} delay={6 + i * 5}>
                <IconTile name={s.icon} size={88} bg={i % 2 === 0 ? C.red : C.ink} />
                <Sfx at={6 + i * 5} name={`note${i}`} vol={0.35} />
              </Pop>
            ))}
          </div>
          <Reveal delay={36} style={{marginTop: 60}}>
            <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 120, letterSpacing: -3, color: C.ink, lineHeight: 1.05}}>
              Capture the Culture
            </div>
          </Reveal>
          <Reveal delay={48}>
            <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 120, letterSpacing: -3, color: C.red, lineHeight: 1.05}}>
              Capitalise on the Trend
            </div>
          </Reveal>
          <Reveal delay={66} style={{marginTop: 44}}>
            <div style={{fontFamily: F.body, fontSize: 32, color: C.body}}>
              YouTube Creator Content Insight 2026 · <b style={{color: C.ink}}>Thailand</b>
            </div>
          </Reveal>
          <Reveal delay={74} style={{marginTop: 10}}>
            <div style={{fontFamily: F.body, fontSize: 21, color: C.faint}}>C&C SEAS · @ngdvu</div>
          </Reveal>
        </div>
      </div>
      <Sfx at={0} name="whoosh" vol={0.5} />
      <Sfx at={38} name="chord" vol={0.5} />
    </Page>
  );
};
