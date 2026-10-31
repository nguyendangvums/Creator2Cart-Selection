import React from 'react';
import {Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Spring progress 0..1 starting at `delay` frames. */
export const useIn = (delay: number, damping = 200, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping}, durationInFrames});
};

export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** Sound effect at a scene-local frame. */
export const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.6}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
  </Sequence>
);

/** Tinted icon: uses the deck icon's alpha as a mask. */
export const Icon: React.FC<{name: string; size: number; color?: string; style?: React.CSSProperties}> = ({
  name,
  size,
  color = C.white,
  style,
}) => {
  const url = `url(${staticFile(`icons/${name}.png`)})`;
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

/** Rounded square with an icon in it, as on the deck. */
export const IconTile: React.FC<{name: string; size?: number; bg?: string; fg?: string; radius?: number}> = ({
  name,
  size = 72,
  bg = C.red,
  fg = C.white,
  radius,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius ?? size * 0.24,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.56} color={fg} />
  </div>
);

export const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; delay?: number; size?: number}> = ({
  children,
  bg = C.red,
  color = C.white,
  delay = 0,
  size = 22,
}) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${size * 0.45}px ${size * 1.1}px`,
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        opacity: p,
        transform: `translateY(${lerp(p, 16, 0)}px) scale(${lerp(p, 0.9, 1)})`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

/** Fade / rise / de-blur wrapper. */
export const Reveal: React.FC<{
  delay: number;
  children: React.ReactNode;
  y?: number;
  x?: number;
  scale?: number;
  style?: React.CSSProperties;
  damping?: number;
}> = ({delay, children, y = 30, x = 0, scale = 1, style, damping = 200}) => {
  const p = useIn(delay, damping);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: `translate(${lerp(p, x, 0)}px, ${lerp(p, y, 0)}px) scale(${lerp(p, scale, 1)})`,
        filter: `blur(${lerp(Math.min(1, p * 1.5), 8, 0)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pop-in with overshoot. */
export const Pop: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({
  delay,
  children,
  style,
  from = 0.6,
}) => {
  const p = useIn(delay, 12);
  const o = useIn(delay, 200);
  return (
    <div style={{opacity: Math.min(1, o * 1.6), transform: `scale(${lerp(p, from, 1)})`, ...style}}>{children}</div>
  );
};

/**
 * Kinetic headline. Wrap words in *stars* to colour them red and sweep an underline beneath them.
 */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  stagger?: number;
  weight?: number;
  style?: React.CSSProperties;
  underline?: boolean;
}> = ({text, delay = 0, size = 72, color = C.ink, stagger = 3, weight = 700, style, underline = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean);
  const words: {w: string; hl: boolean; first: boolean; tail: string}[] = [];
  parts.forEach((part) => {
    const hl = part.startsWith('*');
    const ws = part.replace(/\*/g, '').split(' ').filter(Boolean);
    ws.forEach((w, i) => {
      // Punctuation that follows a highlight sticks to the previous word, uncoloured.
      if (/^[,.;:!?]+$/.test(w) && words.length) words[words.length - 1].tail += w;
      else words.push({w, hl, first: i === 0, tail: ''});
    });
  });
  const end = delay + words.length * stagger + 10;
  const sweep = interpolate(frame, [end, end + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        fontFamily: F.head,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: -size * 0.012,
        color,
        display: 'flex',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {words.map((wd, i) => {
        const p = spring({frame: frame - delay - i * stagger, fps, config: {damping: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              marginRight: size * 0.26,
              opacity: p,
              transform: `translateY(${lerp(p, size * 0.45, 0)}px)`,
              color: wd.hl ? C.red : color,
            }}
          >
            {wd.w}
            {wd.tail ? <span style={{color}}>{wd.tail}</span> : null}
            {wd.hl && underline ? (
              <span
                style={{
                  position: 'absolute',
                  left: wd.first ? 0 : -size * 0.28,
                  right: wd.tail ? size * 0.25 * wd.tail.length : 0,
                  bottom: size * 0.02,
                  height: size * 0.09,
                  borderRadius: 4,
                  background: C.red,
                  opacity: 0.22,
                  transformOrigin: 'left',
                  transform: `scaleX(${sweep})`,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** Animated number: counts the first number in the string, keeps prefix and suffix. */
export const Counter: React.FC<{value: string; delay: number; dur?: number; style?: React.CSSProperties}> = ({
  value,
  delay,
  dur = 32,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = value.match(/(\d[\d,]*\.?\d*)/);
  if (!m || m.index === undefined) return <span style={style}>{value}</span>;
  const raw = m[1];
  const target = parseFloat(raw.replace(/,/g, ''));
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const v = target * p;
  let s = v.toFixed(decimals);
  if (raw.includes(',')) s = Number(s).toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {value.slice(0, m.index)}
      {s}
      {value.slice(m.index + raw.length)}
    </span>
  );
};

export const Source: React.FC<{text: string; delay?: number}> = ({text, delay = 20}) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        bottom: 46,
        fontFamily: F.body,
        fontSize: 17,
        color: C.faint,
        opacity: p * 0.9,
      }}
    >
      Source: {text}
    </div>
  );
};

/** Soft pink rings that drift, echoing the deck's decorative circles. */
export const Rings: React.FC<{x: number; y: number; r: number; delay?: number; opacity?: number}> = ({
  x,
  y,
  r,
  delay = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(delay);
  const drift = Math.sin((frame + delay * 3) / 45) * 10;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r + drift,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: C.pink,
        opacity: p * opacity,
        transform: `scale(${lerp(p, 0.7, 1)})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: r * 0.13,
          borderRadius: '50%',
          border: `3px solid ${C.white}`,
          background: '#FFF4F6',
        }}
      />
    </div>
  );
};

export const Dot: React.FC<{x: number; y: number; r: number; color?: string; delay?: number}> = ({
  x,
  y,
  r,
  color = C.red,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, 12);
  const f = Math.sin((frame + x) / 30) * 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r + f,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: color,
        transform: `scale(${p})`,
      }}
    />
  );
};

export const Floating: React.FC<{children: React.ReactNode; amp?: number; speed?: number; phase?: number}> = ({
  children,
  amp = 10,
  speed = 50,
  phase = 0,
}) => {
  const frame = useCurrentFrame();
  return <div style={{transform: `translateY(${Math.sin(frame / speed + phase) * amp}px)`}}>{children}</div>;
};

export const Illus: React.FC<{name: string; width: number}> = ({name, width}) => (
  <Img src={staticFile(`illus/${name}.png`)} style={{width, display: 'block'}} />
);

export const SectionPills: React.FC<{num: string; name: string; tag?: string}> = ({num, name, tag}) => (
  <div style={{position: 'absolute', left: 120, top: 84, display: 'flex', gap: 16}}>
    <Pill delay={2}>
      {num} · {name}
    </Pill>
    {tag ? (
      <Pill delay={7} bg={C.ink}>
        {tag}
      </Pill>
    ) : null}
  </div>
);

export const Page: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = C.white}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}>{children}</div>
);
