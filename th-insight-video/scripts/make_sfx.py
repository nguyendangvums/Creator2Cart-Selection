"""Synthesise the sound-effect kit used by the video (no external samples)."""
import numpy as np, wave, os, sys
from scipy import signal

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/sfx"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, l, r=None, peak=0.7):
    if r is None: r = l
    st = np.stack([l, r], 1)
    st = st / (np.abs(st).max() + 1e-9) * peak
    fade = int(0.004 * SR)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def t_(d): return np.arange(int(d * SR)) / SR

def sweep_bp(x, f_start, f_peak, f_end, q=1.2):
    """Band-pass noise whose centre glides start -> peak -> end, block-wise."""
    n = len(x); blk = 256; y = np.zeros(n); zi = None
    for i in range(0, n, blk):
        p = i / n
        fc = f_start * (f_peak / f_start) ** (p * 2) if p < .5 else f_peak * (f_end / f_peak) ** ((p - .5) * 2)
        b, a = signal.iirpeak(min(fc, SR / 2 - 100) / (SR / 2), q)
        if zi is None: zi = signal.lfilter_zi(b, a) * 0
        y[i:i + blk], zi = signal.lfilter(b, a, x[i:i + blk], zi=zi)
    return y

def env(n, a, d_shape=3.0):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na) ** 2
    e[na:] = np.linspace(1, 0, n - na) ** d_shape
    return e

# 1. whoosh (scene transition), panned left -> right
d = 0.7; n = int(d * SR)
x = sweep_bp(rng.standard_normal(n), 250, 2600, 700, q=0.9) + 0.5 * sweep_bp(rng.standard_normal(n), 500, 5000, 1200, q=1.5)
e = np.sin(np.linspace(0, np.pi, n)) ** 2.2
x *= e; pan = np.linspace(0.15, 0.85, n)
save("whoosh", x * np.sqrt(1 - pan), x * np.sqrt(pan), 0.6)

# 2. short swoosh (elements sliding in)
d = 0.32; n = int(d * SR)
x = sweep_bp(rng.standard_normal(n), 900, 5200, 2500, q=1.1) * np.sin(np.linspace(0, np.pi, n)) ** 2
save("swoosh", x, x * 0.85, 0.45)

# 3. pop (card / chip appears)
t = t_(0.14); f = 820 * np.exp(-t * 28) + 260
ph = 2 * np.pi * np.cumsum(f) / SR
x = np.sin(ph) * np.exp(-t * 38) + 0.15 * rng.standard_normal(len(t)) * np.exp(-t * 400)
save("pop", x, x, 0.55)

# 4. tick (counter / list row)
t = t_(0.035)
x = (np.sin(2 * np.pi * 2400 * t) + 0.5 * np.sin(2 * np.pi * 4100 * t)) * np.exp(-t * 180)
save("tick", x, x, 0.35)

# 5. marimba notes (pentatonic, for staggered list items)
def marimba(freq, d=0.6):
    t = t_(d)
    x = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 9) + 0.35 * np.sin(2 * np.pi * freq * 3.93 * t) * np.exp(-t * 30)
         + 0.12 * np.sin(2 * np.pi * freq * 9.2 * t) * np.exp(-t * 70))
    x[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    return x
for i, fr in enumerate([523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]):
    save(f"note{i}", marimba(fr), None, 0.5)

# 6. ding (stat lands): soft bell with inharmonic partials
t = t_(1.6)
partials = [(1, 1, 3.2), (2.76, .45, 6), (5.4, .22, 10), (8.93, .12, 16)]
x = sum(a * np.sin(2 * np.pi * 1318.5 * p * t) * np.exp(-t * dcy) for p, a, dcy in partials)
x[:96] *= np.linspace(0, 1, 96)
save("ding", x, np.roll(x, 90), 0.42)

# 7. impact (big hero number lands): sub drop + noise burst
t = t_(0.9); f = 120 * np.exp(-t * 6) + 42
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5)
nb = sweep_bp(rng.standard_normal(len(t)), 3000, 1200, 400, q=0.7) * np.exp(-t * 22)
save("impact", x + 0.6 * nb, x + 0.6 * np.roll(nb, 60), 0.8)

# 8. riser (section cover build-up), 1.1 s
d = 1.1; n = int(d * SR); t = t_(d)
x = sweep_bp(rng.standard_normal(n), 300, 3000, 7000, q=1.6) * (t / d) ** 2.5
tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / d)) / SR) * (t / d) ** 3 * 0.25
save("riser", x + tone, np.roll(x, 200) + tone, 0.45)

# 9. sparkle ("Did you know?" badge)
d = 0.9; n = int(d * SR); x = np.zeros(n); xr = np.zeros(n)
for k, fr in enumerate([2093, 2637, 3136, 3951, 3520, 4186]):
    s = int(k * 0.06 * SR); tt = t_(0.5)
    p = np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 14)
    m = min(len(p), n - s)
    g = 1 - k * 0.1
    (x if k % 2 == 0 else xr)[s:s + m] += p[:m] * g
    (xr if k % 2 == 0 else x)[s:s + m] += p[:m] * g * 0.4
save("sparkle", x, xr, 0.35)

# 10. bar grow (chart bars): rising filtered blip
t = t_(0.45); f = 300 + 900 * (t / 0.45) ** 1.5
x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.02, 1.5)
b, a = signal.butter(2, 2500 / (SR / 2)); x = signal.lfilter(b, a, x)
save("grow", x, x, 0.25)

# 11. click (UI pill / subscribe)
t = t_(0.05)
x = rng.standard_normal(len(t)) * np.exp(-t * 260)
b, a = signal.butter(2, [1500 / (SR / 2), 6000 / (SR / 2)], 'band'); x = signal.lfilter(b, a, x)
save("click", x, x, 0.45)

# 12. success chord (outro / amplify payoff)
t = t_(2.2)
x = sum(marimba(f, 2.2) * g for f, g in [(523.25, 1), (659.25, .8), (783.99, .7), (1046.5, .5)])
xr = sum(marimba(f * 1.003, 2.2) * g for f, g in [(523.25, .8), (659.25, 1), (783.99, .6), (1046.5, .6)])
save("chord", x, xr, 0.5)
print("ok", sorted(os.listdir(OUT)))
