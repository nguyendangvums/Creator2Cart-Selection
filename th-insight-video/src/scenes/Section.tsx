import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Section} from '../data';
import {C, F} from '../theme';
import {
  Avatar,
  ChannelTag,
  Counter,
  Dot,
  Floating,
  Headline,
  Icon,
  IconTile,
  Illus,
  Page,
  Pop,
  Reveal,
  Rings,
  SectionPills,
  Sfx,
  Source,
  lerp,
  useIn,
} from '../ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type P = {s: Section};

const Caps: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({
  children,
  color = C.red,
  size = 22,
}) => (
  <div
    style={{
      fontFamily: F.body,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

/* ---------------- Cover ---------------- */
export const CoverScene: React.FC<P> = ({s}) => {
  const p = useIn(6, 11);
  return (
    <Page>
      <Rings x={1830} y={190} r={80} delay={10} />
      <Rings x={1030} y={960} r={70} delay={16} />
      <Dot x={1870} y={830} r={22} delay={26} />
      <div style={{position: 'absolute', left: 120, top: 150, width: 820}}>
        <div
          style={{
            fontFamily: F.head,
            fontWeight: 800,
            fontSize: 260,
            lineHeight: 1,
            letterSpacing: -8,
            color: C.red,
            transform: `scale(${lerp(p, 0.4, 1)})`,
            transformOrigin: 'left bottom',
            opacity: Math.min(1, p * 2),
          }}
        >
          {s.num}
        </div>
        <Reveal delay={16} style={{marginTop: 50}}>
          <Caps color={C.muted} size={30}>
            {s.pre}
          </Caps>
        </Reveal>
        <Headline text={s.title} size={104} delay={20} stagger={4} weight={800} style={{marginTop: 10}} />
        <Reveal delay={34}>
          <div style={{marginTop: 26, fontFamily: F.body, fontSize: 34, lineHeight: 1.38, color: C.body}}>{s.desc}</div>
        </Reveal>
      </div>
      <Reveal delay={4} x={260} y={0} style={{position: 'absolute', left: 960, top: 170}}>
        <Floating amp={10} speed={36}>
          <Illus name={s.cover} width={880} />
        </Floating>
      </Reveal>
      <Sfx at={0} name="whoosh" vol={0.55} />
      <Sfx at={7} name="impact" vol={0.6} />
      <Sfx at={20} name="swoosh" vol={0.35} />
    </Page>
  );
};

/* ---------------- Surprising fact ---------------- */
export const FactScene: React.FC<P> = ({s}) => {
  const frame = useCurrentFrame();
  const big = useIn(10, 11);
  const bob = Math.sin(frame / 22) * 6;
  const pulse = 1 + Math.sin(frame / 14) * 0.015;
  return (
    <Page>
      <SectionPills num={s.num} name={s.short} tag="Surprising fact" />
      <div style={{position: 'absolute', left: 120, top: 200, width: 1000}}>
        <div
          style={{
            fontFamily: F.head,
            fontWeight: 800,
            fontSize: 220,
            lineHeight: 1.05,
            letterSpacing: -6,
            color: C.red,
            transform: `scale(${lerp(big, 0.5, 1)})`,
            transformOrigin: 'left center',
            opacity: Math.min(1, big * 2),
            whiteSpace: 'nowrap',
          }}
        >
          <Counter value={s.fact.stat} delay={10} dur={26} />
        </div>
        <Headline text={s.fact.headline} size={54} delay={30} stagger={2} style={{marginTop: 18}} />
        {s.fact.faces ? (
          <div style={{display: 'flex', gap: 40, marginTop: 30}}>
            {s.fact.faces.map((f, i) => (
              <Pop key={f.name} delay={58 + i * 7}>
                <ChannelTag id={f.avatar} name={f.name} size={72} />
                <Sfx at={58 + i * 7} name="pop" vol={0.3} />
              </Pop>
            ))}
          </div>
        ) : null}
      </div>
      <Reveal delay={84} y={50} style={{position: 'absolute', left: 120, top: 790, width: 1000}}>
        <div
          style={{
            background: C.pink,
            borderRadius: 26,
            padding: '30px 38px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <IconTile name="p06_042" size={78} />
          <div style={{fontFamily: F.body, fontSize: 34, lineHeight: 1.35, color: C.body}}>
            <b style={{color: C.ink}}>So what: </b>
            {s.fact.soWhat}
          </div>
        </div>
      </Reveal>
      {/* right visual */}
      <Pop delay={12} style={{position: 'absolute', left: 1180, top: 230}} from={0.4}>
        <div style={{position: 'relative', width: 620, height: 620}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: C.pink}} />
          <div
            style={{
              position: 'absolute',
              inset: 70,
              borderRadius: '50%',
              border: `4px solid ${C.pinkMid}`,
              background: '#FFF5F7',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 185,
              top: 185 + bob,
              width: 250,
              height: 250,
              borderRadius: 50,
              background: C.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${pulse})`,
              boxShadow: '0 30px 60px rgba(255,0,51,0.25)',
            }}
          >
            <Icon name={s.fact.icon} size={150} />
          </div>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 1600, top: 250}}>
        <Pop delay={28}>
          <div
            style={{
              background: C.ink,
              color: C.white,
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 26,
              padding: '16px 28px',
              borderRadius: 999,
            }}
          >
            Did you know?
          </div>
        </Pop>
      </div>
      <Dot x={1200} y={800} r={26} delay={36} />
      <Dot x={1790} y={760} r={15} color={C.pinkMid} delay={40} />
      <Source text={s.fact.source} delay={60} />
      <Sfx at={0} name="whoosh" vol={0.5} />
      <Sfx at={10} name="impact" vol={0.65} />
      <Sfx at={28} name="sparkle" vol={0.45} />
      <Sfx at={84} name="swoosh" vol={0.45} />
    </Page>
  );
};

/* ---------------- Proof ---------------- */
const BarChart: React.FC<{s: Section}> = ({s}) => {
  const frame = useCurrentFrame();
  const rows = s.proof.chart!;
  const max = Math.max(...rows.map((r) => r.value));
  const fills = [C.red, '#FF2E57', '#FF5C7C', '#FF8BA2', '#FFA6B8'];
  return (
    <Reveal
      delay={14}
      y={40}
      style={{
        position: 'absolute',
        left: 120,
        top: 330,
        width: 1020,
        height: 600,
        borderRadius: 30,
        border: `2px solid ${C.line}`,
        padding: '40px 48px',
        boxSizing: 'border-box',
        background: C.white,
      }}
    >
      <Caps color={C.muted} size={22}>
        {s.proof.sub}
      </Caps>
      <div style={{marginTop: 26}}>
        {rows.map((r, i) => {
          const d = 24 + i * 7;
          const g = interpolate(frame, [d, d + 22], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
          return (
            <div key={r.label} style={{display: 'flex', alignItems: 'center', height: 94}}>
              <div
                style={{
                  width: 290,
                  textAlign: 'right',
                  paddingRight: 16,
                  fontFamily: F.body,
                  fontWeight: i === 0 ? 700 : 500,
                  fontSize: 29,
                  color: C.ink,
                }}
              >
                {r.label}
              </div>
              <Avatar
                id={r.avatar}
                size={58}
                ring={C.white}
                style={{
                  marginRight: 14,
                  boxShadow: '0 0 0 2px #EDEDED',
                  transform: `scale(${interpolate(frame, [d - 4, d + 6], [0, 1], clamp)})`,
                }}
              />
              <div
                style={{
                  height: 52,
                  width: (r.value / max) * 430 * g,
                  borderRadius: 8,
                  background: fills[i],
                }}
              />
              <div
                style={{
                  marginLeft: 16,
                  fontFamily: F.head,
                  fontWeight: 800,
                  fontSize: 31,
                  color: C.ink,
                  opacity: g,
                }}
              >
                {r.display}
              </div>
            </div>
          );
        })}
      </div>
      <Sfx at={22} name="grow" vol={0.35} />
    </Reveal>
  );
};

export const ProofScene: React.FC<P> = ({s}) => {
  const hasChart = Boolean(s.proof.chart);
  return (
    <Page>
      <SectionPills num={s.num} name={s.short} />
      <div style={{position: 'absolute', left: 120, top: 165, width: 1700}}>
        <Headline text={s.proof.headline} size={70} delay={6} />
      </div>
      {hasChart ? (
        <>
          <BarChart s={s} />
          {s.proof.stats.slice(0, 2).map((st, i) => {
            const d = 66 + i * 20;
            return (
              <Pop key={st.value} delay={d} style={{position: 'absolute', left: 1180, top: 330 + i * 315, width: 620}}>
                <div
                  style={{
                    height: 285,
                    borderRadius: 30,
                    background: i === 0 ? C.pink : C.grey,
                    padding: '40px 44px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div
                      style={{
                        fontFamily: F.head,
                        fontWeight: 800,
                        fontSize: st.avatar ? 84 : 92,
                        lineHeight: 1,
                        color: i === 0 ? C.red : C.ink,
                        letterSpacing: -2,
                      }}
                    >
                      <Counter value={st.value} delay={d} dur={24} />
                    </div>
                    {st.avatar ? <Avatar id={st.avatar} size={86} /> : null}
                  </div>
                  {st.channel ? (
                    <div style={{marginTop: 16, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.ink}}>
                      {st.channel}
                    </div>
                  ) : null}
                  <div
                    style={{
                      marginTop: st.channel ? 4 : 22,
                      fontFamily: F.body,
                      fontSize: st.channel ? 27 : 30,
                      lineHeight: 1.3,
                      color: C.body,
                    }}
                  >
                    {st.label}
                  </div>
                </div>
                <Sfx at={d} name="pop" vol={0.4} />
                <Sfx at={d + 22} name="ding" vol={0.22} />
              </Pop>
            );
          })}
        </>
      ) : (
        <div style={{position: 'absolute', left: 120, right: 120, top: 340, display: 'flex', gap: 30}}>
          {s.proof.stats.map((st, i) => {
            const d = 22 + i * 26;
            const bg = [C.pink, C.grey, C.ink][i];
            const fg = [C.red, C.ink, C.red][i];
            return (
              <Reveal key={st.value} delay={d} y={70} style={{flex: '1 1 0', minWidth: 0}}>
                <div
                  style={{
                    height: 520,
                    borderRadius: 30,
                    background: bg,
                    padding: 50,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  {st.avatar && st.channel ? (
                    <div style={{marginBottom: 'auto'}}>
                      <ChannelTag id={st.avatar} name={st.channel} dark={i === 2} size={64} />
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontFamily: F.head,
                      fontWeight: 800,
                      fontSize: 118,
                      lineHeight: 1,
                      letterSpacing: -3,
                      color: fg,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Counter value={st.value} delay={d + 2} dur={26} />
                  </div>
                  <div
                    style={{
                      marginTop: 30,
                      fontFamily: F.body,
                      fontSize: 32,
                      lineHeight: 1.32,
                      color: i === 2 ? 'rgba(255,255,255,0.8)' : C.body,
                      minHeight: 126,
                    }}
                  >
                    {st.label}
                  </div>
                </div>
                <Sfx at={d} name="pop" vol={0.4} />
                <Sfx at={d + 26} name="ding" vol={0.25} />
              </Reveal>
            );
          })}
        </div>
      )}
      <Source text={s.proof.source} delay={40} />
      <Sfx at={0} name="whoosh" vol={0.45} />
    </Page>
  );
};

/* ---------------- What works + moments ---------------- */
export const PlayScene: React.FC<P> = ({s}) => (
  <Page>
    <SectionPills num={s.num} name={s.short} />
    <div style={{position: 'absolute', left: 120, top: 165, width: 1700}}>
      <Headline text={s.play.headline} size={66} delay={4} />
    </div>
    <div style={{position: 'absolute', left: 120, top: 300}}>
      <Reveal delay={14}>
        <Caps>What's working on YouTube</Caps>
      </Reveal>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 360,
        width: 1000,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 30,
      }}
    >
      {s.play.formats.map((f, i) => {
        const d = 22 + i * 9;
        return (
          <Pop key={f.title} delay={d}>
            <div
              style={{
                height: 255,
                borderRadius: 28,
                background: i === 0 ? C.pink : C.grey,
                padding: 40,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {i === 0 ? (
                <IconTile name={f.icon} size={84} />
              ) : (
                <IconTile name={f.icon} size={84} bg={C.white} fg={C.red} />
              )}
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.15}}>
                {f.title}
              </div>
            </div>
            <Sfx at={d} name={`note${i}`} vol={0.38} />
          </Pop>
        );
      })}
    </div>
    <Reveal
      delay={62}
      x={120}
      y={0}
      style={{
        position: 'absolute',
        left: 1160,
        top: 300,
        width: 640,
        height: 600,
        borderRadius: 30,
        background: C.ink,
        padding: '46px 48px',
        boxSizing: 'border-box',
      }}
    >
      <Caps>Moments to own</Caps>
      <div style={{marginTop: 22}}>
        {s.play.moments.map((m, i) => {
          const d = 74 + i * 13;
          return (
            <Reveal key={m.date} delay={d} x={40} y={0}>
              <div style={{display: 'flex', gap: 22, alignItems: 'flex-start', padding: '20px 0'}}>
                <Icon name="p08_054" size={40} color={C.red} style={{marginTop: 2}} />
                <div>
                  <Caps size={22}>{m.date}</Caps>
                  <div style={{marginTop: 8, fontFamily: F.body, fontSize: 31, color: C.white, lineHeight: 1.25}}>
                    {m.label}
                  </div>
                </div>
              </div>
              <Sfx at={d} name="tick" vol={0.3} />
            </Reveal>
          );
        })}
      </div>
    </Reveal>
    <Sfx at={0} name="whoosh" vol={0.45} />
    <Sfx at={62} name="swoosh" vol={0.45} />
  </Page>
);

/* ---------------- Brand fit ---------------- */
export const BrandScene: React.FC<P> = ({s}) => (
  <Page>
    <SectionPills num={s.num} name={s.short} />
    <div style={{position: 'absolute', left: 120, top: 165}}>
      <Headline text="Where your brand *fits*" size={70} delay={4} />
    </div>
    <div style={{position: 'absolute', left: 120, right: 120, top: 300, display: 'flex', gap: 30}}>
      {s.brand.categories.map((c, i) => {
        const d = 18 + i * 8;
        return (
          <Pop key={c.title} delay={d} style={{flex: '1 1 0', minWidth: 0}}>
            <div
              style={{
                height: 240,
                borderRadius: 28,
                background: i === 0 ? C.pink : C.grey,
                padding: 38,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {i === 0 ? <IconTile name={c.icon} size={80} /> : <IconTile name={c.icon} size={80} bg={C.white} fg={C.red} />}
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.ink, lineHeight: 1.15}}>{c.title}</div>
            </div>
            <Sfx at={d} name="pop" vol={0.35} />
          </Pop>
        );
      })}
    </div>
    <Reveal
      delay={56}
      y={60}
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        top: 580,
        height: 330,
        borderRadius: 30,
        background: C.ink,
        padding: '44px 52px',
        boxSizing: 'border-box',
      }}
    >
      <Caps>How to join the story</Caps>
      <div style={{display: 'flex', gap: 50, marginTop: 40}}>
        {s.brand.ideas.map((idea, i) => {
          const d = 68 + i * 12;
          return (
            <Reveal key={idea.title} delay={d} x={30} y={0} style={{flex: '1 1 0', minWidth: 0}}>
              <div style={{display: 'flex', gap: 22}}>
                <Icon name={idea.icon} size={58} color={C.red} />
                <div>
                  <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.white}}>{idea.title}</div>
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: F.body,
                      fontSize: 27,
                      lineHeight: 1.35,
                      color: 'rgba(255,255,255,0.72)',
                    }}
                  >
                    {idea.desc}
                  </div>
                </div>
              </div>
              <Sfx at={d} name={`note${i + 2}`} vol={0.35} />
            </Reveal>
          );
        })}
      </div>
    </Reveal>
    <Sfx at={0} name="whoosh" vol={0.45} />
    <Sfx at={56} name="swoosh" vol={0.4} />
  </Page>
);

/* ---------------- Creators ---------------- */
export const CreatorsScene: React.FC<P> = ({s}) => {
  const frame = useCurrentFrame();
  const list = s.creators.list;
  return (
    <Page>
      <SectionPills num={s.num} name={s.short} />
      <div style={{position: 'absolute', left: 120, top: 165}}>
        <Headline text={s.creators.headline} size={70} delay={4} />
        <Reveal delay={14}>
          <div style={{marginTop: 12, fontFamily: F.body, fontSize: 30, color: C.muted}}>{s.creators.sub}</div>
        </Reveal>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 350,
          width: 1680,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        {list.map((c, i) => {
          const d = 16 + i * 4;
          const subAt = 62 + i * 3;
          const on = interpolate(frame, [subAt, subAt + 4], [0, 1], clamp);
          return (
            <Pop key={c.name} delay={d} style={{width: 312}}>
              <div
                style={{
                  height: 290,
                  borderRadius: 24,
                  background: C.grey,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 78, background: C.red}} />
                <Img
                  src={staticFile(`avatars/${s.creators.avatarPage}_${i}.png`)}
                  style={{
                    marginTop: 16,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: `5px solid ${C.white}`,
                    background: C.white,
                    objectFit: 'cover',
                    position: 'relative',
                  }}
                />
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: F.body,
                    fontWeight: 700,
                    fontSize: 25,
                    color: C.ink,
                    textAlign: 'center',
                    padding: '0 12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 290,
                  }}
                >
                  {c.name}
                </div>
                <div style={{marginTop: 4, fontFamily: F.body, fontSize: 22, color: C.muted}}>{c.subs} subscribers</div>
                <div
                  style={{
                    marginTop: 12,
                    padding: '7px 20px',
                    borderRadius: 999,
                    background: on > 0.5 ? C.red : C.ink,
                    color: C.white,
                    fontFamily: F.body,
                    fontWeight: 700,
                    fontSize: 18,
                    transform: `scale(${1 + Math.sin(on * Math.PI) * 0.12})`,
                  }}
                >
                  {on > 0.5 ? 'Subscribed' : 'Subscribe'}
                </div>
              </div>
              {i % 2 === 0 ? <Sfx at={subAt} name="click" vol={0.25} /> : null}
            </Pop>
          );
        })}
      </div>
      <Reveal delay={40} style={{position: 'absolute', left: 120, bottom: 46}}>
        <div style={{fontFamily: F.body, fontSize: 17, color: C.faint}}>
          Creators shown for illustration. Subscriber counts: Social Blade (Sep 2026)
        </div>
      </Reveal>
      <Sfx at={0} name="whoosh" vol={0.45} />
    </Page>
  );
};

