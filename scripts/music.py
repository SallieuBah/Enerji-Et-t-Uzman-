"""Saha haritası videosu için arka plan müziği üretir (sentezleyici, vokalsiz, 120 BPM, Re minör).

Kurumsal-teknolojik bir doku: pad akorları, dijital arpejler, elektronik bas, saat tik-takı gibi vuruşlar ve
haritadaki dönüm noktalarına denk gelen vurgular. Son 3 saniyede tempo yumuşakça yavaşlar ve Re majöre çözülür.

Kullanım:
    pip install numpy scipy
    python scripts/music.py video  video/muzik-video.wav    # 80 sn, videoyla senkron
    python scripts/music.py long   video/muzik-120s.wav     # 120 sn, bağımsız sürüm
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 120
STEP = 60 / BPM / 4                     # 16'lık nota (sn)
RNG = np.random.default_rng(7)

# Bölümler (nominal saniye) ve vurgu anları. "video" sürümü video/harita.html zaman çizelgesiyle eşleşir.
FORMS = {
    "video": dict(end=80, sections=[(0, "intro"), (9, "ch1"), (18, "ch2"), (30, "ch3"), (41, "climax"),
                                    (46, "tour"), (66, "rank"), (73, "outro")],
                  hits=[(9, 1), (18, .7), (30, .8), (41, 1.3), (46, .7), (51, .6), (56, .6), (61, .6), (66, 1.3), (73, .8)],
                  pings=[0.2, 2.5, 4.7], riser=(5.0, 9.0)),
    "long": dict(end=120, sections=[(0, "intro"), (14, "ch1"), (30, "ch2"), (46, "ch3"), (62, "climax"),
                                    (70, "tour"), (94, "rank"), (110, "outro")],
                 hits=[(14, 1), (30, .7), (46, .8), (62, 1.3), (70, .7), (76, .6), (82, .6), (88, .6), (94, 1.3), (110, .8)],
                 pings=[0.5, 4.5, 8.5], riser=(9.0, 14.0)),
}

# Akorlar: pad sesleri, bas kökü (MIDI)
CH = {"Dm": ([50, 57, 62, 65], 38), "Bb": ([46, 53, 58, 62], 34), "F": ([53, 57, 60, 65], 41),
      "C": ([48, 55, 60, 64], 36), "D": ([50, 57, 62, 66], 38)}
PROG = ["Dm", "Bb", "F", "C"]
# Doruk melodisi: her akor için (vuruş, MIDI, süre-vuruş)
MEL = {"Dm": [(0, 69, 1), (1, 74, 1), (2, 77, 1.5), (3.5, 76, .5)], "Bb": [(0, 74, 1), (1, 70, 1), (2, 74, 1), (3, 77, 1)],
       "F": [(0, 77, 1.5), (1.5, 76, .5), (2, 72, 1), (3, 69, 1)], "C": [(0, 72, 1), (1, 76, 1), (2, 79, 2)]}

# Bölüm başına katman seviyeleri
LV = {
    "intro":  dict(pad=.55, cut=700,  pulse=.30, bass=0,   arp=0,   arpcut=1500, kick=0,  clap=0, hat=0,  tick=.10, lead=0),
    "ch1":    dict(pad=.50, cut=1400, pulse=.15, bass=.55, arp=.22, arpcut=2200, kick=.6, clap=0, hat=0,  tick=.30, lead=0),
    "ch2":    dict(pad=.50, cut=2400, pulse=0,   bass=.75, arp=.36, arpcut=3600, kick=1,  clap=.5, hat=0, tick=.32, lead=0),
    "ch3":    dict(pad=.55, cut=3600, pulse=0,   bass=.85, arp=.46, arpcut=6000, kick=1,  clap=.6, hat=.5, tick=.30, lead=0),
    "climax": dict(pad=.65, cut=6000, pulse=0,   bass=.95, arp=.50, arpcut=8000, kick=1,  clap=.7, hat=.6, tick=.25, lead=.30),
    "tour":   dict(pad=.55, cut=4200, pulse=0,   bass=.85, arp=.46, arpcut=6500, kick=1,  clap=.6, hat=.55, tick=.32, lead=0),
    "rank":   dict(pad=.65, cut=7000, pulse=0,   bass=1,   arp=.52, arpcut=9000, kick=1,  clap=.75, hat=.65, tick=.25, lead=.42),
    "outro":  dict(pad=.60, cut=2600, pulse=0,   bass=.55, arp=.30, arpcut=3000, kick=0,  clap=0, hat=0,  tick=.22, lead=0),
}


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR * .45) / (SR / 2), "low", output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), "high", output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], "band", output="sos"), x)


def saw(f, n, harmonics=24, detune=0.0, phase=0.0):
    t = np.arange(n) / SR
    f = f * 2 ** (detune / 1200)
    out = np.zeros(n)
    for k in range(1, min(harmonics, int(SR * .45 / f)) + 1):
        out += np.sin(2 * np.pi * k * f * t + phase * k) / k
    return out * .55


def adsr(n, a=.01, d=.1, s=.7, r=.2):
    env = np.full(n, s)
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    env[:na] = np.linspace(0, 1, na)
    nd = min(nd, n - na)
    env[na:na + nd] = np.linspace(1, s, nd)
    if nr and n > nr:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env


class Mix:
    def __init__(self, seconds):
        self.n = int(seconds * SR)
        self.bus = {k: np.zeros((2, self.n)) for k in ("pad", "arp", "bass", "drums", "tick", "fx", "lead")}

    def add(self, bus, t, sig, pan=0.0, gain=1.0):
        i = int(t * SR)
        if i >= self.n or i < 0:
            return
        sig = sig[: self.n - i] * gain
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.bus[bus][0, i:i + len(sig)] += sig * l * 1.414
        self.bus[bus][1, i:i + len(sig)] += sig * r * 1.414


def grid(end):
    """16'lık adımların zamanları; son 3 sn'de tempo 120'den ~52 BPM'e yumuşakça düşer (ritardando)."""
    times, t, rit = [], 0.0, end - 3.0
    while t < end + 2:
        times.append(t)
        k = 0.0 if t < rit else min(1.0, (t - rit) / 3.0)
        tempo = BPM - 68 * (k ** .9)
        t += STEP * BPM / tempo
    return np.array(times)


def render(form):
    F = FORMS[form]
    END = F["end"]
    T = grid(END)
    m = Mix(END + 1.0)
    sec_at = lambda t: [s for s in F["sections"] if s[0] <= t + 1e-6][-1][1]
    # Son akorun düştüğü ölçü: nominal (END-2) sn'deki ölçü başı
    final_bar = int(round((END - 2) / 2))
    n_bars = final_bar + 1
    chord_of = lambda b: "D" if b == final_bar else ("C" if b == final_bar - 1 else ("Bb" if b == final_bar - 2 else PROG[b % 4]))
    bar_t = lambda b, beat=0.0: float(np.interp(b * 16 + beat * 4, np.arange(len(T)), T))
    kicks = []

    for b in range(n_bars):
        t0, t1 = bar_t(b), bar_t(b + 1)
        sec = sec_at(t0 + .01)
        L = LV[sec]
        name = chord_of(b)
        notes, root = CH[name]
        last = b == final_bar
        dur = (END + .9 - t0) if last else (t1 - t0 + .35)
        n = int(dur * SR)
        # Pad: detuned testere dalgaları, bölüme göre açılan filtre
        if L["pad"]:
            env = adsr(n, a=.35 if not last else .08, d=.4, s=.85, r=.45 if not last else min(1.4, dur * .7))
            for j, note in enumerate(notes):
                for det, pan in ((-7, -.6), (0, 0), (7, .6)):
                    s = lp(saw(mtof(note), n, 18, det, RNG.uniform(0, 6)), L["cut"] if not last else 3200) * env
                    m.add("pad", t0, s, pan, L["pad"] * .1)
        # Bas: 8'lik pompalayan nota + alt sinüs; son ölçüde uzun kök
        if L["bass"] or last:
            steps = [0] if last else range(0, 16, 2)
            for st in steps:
                ts = bar_t(b, st / 4)
                d = (END + .8 - ts) if last else (bar_t(b, (st + 2) / 4) - ts) * .92
                nn = int(d * SR)
                f = mtof(root)
                tt = np.arange(nn) / SR
                s = lp(saw(f, nn, 16), 520 if not last else 300) * .8 + np.sin(2 * np.pi * f / 2 * tt) * .45
                s *= adsr(nn, .004, .08, .75, .03 if not last else min(1.2, d * .6))
                m.add("bass", ts, s, 0, (L["bass"] or .5) * .2)
        # Giriş pulsu
        if L["pulse"]:
            for st in range(0, 16, 2):
                ts = bar_t(b, st / 4)
                nn = int(.16 * SR)
                s = lp(saw(mtof(root + 24), nn, 10), 1100) * adsr(nn, .005, .05, .3, .08)
                m.add("pad", ts, s, -.2 if st % 4 else .2, L["pulse"] * .3)
        # Arpej: akor seslerinden 16'lık dijital desen, oktav yükseltme doruklarda
        if L["arp"] or last:
            pcs = sorted({x % 12 for x in notes})
            tones = sorted(p + 12 * o for o in range(5, 8) for p in pcs if 62 <= p + 12 * o <= 86)
            up = 5 if sec in ("ch3", "climax", "rank") else 0
            if last:   # son akorda inen, yavaşlayan kırık akor
                pat = [5, 4, 3, 2, 1, 0, 1, 0]
            pat = [0, 2, 4, 1, 3, 5, 2, 4, 0, 3, 5, 1, 4, 2, 5, 3]
            for st in range(16):
                if sec == "outro" and st % 2:
                    continue
                ts = bar_t(b, st / 4)
                if last:
                    if ts > END - .3:
                        break
                    note = tones[min(len(tones) - 1, pat[st // 2])]
                    fade_k = max(0.0, 1 - (ts - bar_t(b)) / (END - bar_t(b)))
                    nn = int(.9 * SR)
                    f = mtof(note)
                    tt = np.arange(nn) / SR
                    sg = (np.sign(np.sin(2 * np.pi * f * tt)) * .25 + saw(f, nn, 8) * .8) * np.exp(-tt / .35)
                    m.add("arp", ts, lp(sg, 3200), (.45 if (st // 2) % 2 else -.45), .3 * .21 * (.4 + .6 * fade_k))
                    continue
                note = tones[min(len(tones) - 1, pat[st] % len(tones) + (up if pat[st] + up < len(tones) else 0))]
                nn = int(.32 * SR)
                f = mtof(note)
                tt = np.arange(nn) / SR
                s = (np.sign(np.sin(2 * np.pi * f * tt)) * .35 + saw(f, nn, 8) * .8) * np.exp(-tt / .11)
                s = lp(s, L["arpcut"])
                acc = 1.0 if st % 4 == 0 else .72
                m.add("arp", ts, s, (.55 if st % 2 else -.55), L["arp"] * .21 * acc)
        # Davul: kick, clap, hat
        for st in range(16):
            ts = bar_t(b, st / 4)
            if last:
                break
            if L["kick"] and st % 4 == 0 and (L["kick"] >= 1 or st in (0, 8)):
                nn = int(.45 * SR)
                tt = np.arange(nn) / SR
                fr = 46 + 95 * np.exp(-tt / .035)
                s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / .28)
                s[:120] += RNG.normal(0, .3, 120) * np.linspace(1, 0, 120)
                m.add("drums", ts, s, 0, L["kick"] * .65)
                kicks.append(ts)
            if L["clap"] and st in (4, 12):
                nn = int(.35 * SR)
                tt = np.arange(nn) / SR
                env = np.exp(-tt / .12)
                for off in (0, .011, .022):
                    env += np.where((tt >= off) & (tt < off + .006), 1.2, 0)
                s = bp(RNG.normal(0, 1, nn), 900, 3200) * env
                m.add("drums", ts, s, .1, L["clap"] * .28)
                m.add("fx", ts, s, -.1, L["clap"] * .06)
            if L["hat"] and st % 4 == 2:
                nn = int(.22 * SR)
                tt = np.arange(nn) / SR
                s = hp(RNG.normal(0, 1, nn), 7500) * np.exp(-tt / .07)
                m.add("drums", ts, s, .35, L["hat"] * .16)
        # Saat tik-takı: 8'liklerde tik/tak, 16'lıklarda hafif ara vuruş
        if L["tick"]:
            for st in range(16):
                ts = bar_t(b, st / 4)
                main = st % 2 == 0
                if last and (not main or ts > END - .35):
                    continue
                if sec == "intro" and not main:
                    continue
                nn = int(.03 * SR)
                tt = np.arange(nn) / SR
                f = (3400 if st % 4 == 0 else 2600) if main else 5200
                s = (np.sin(2 * np.pi * f * tt) * .6 + bp(RNG.normal(0, 1, nn), 3000, 9000) * .5) * np.exp(-tt / (.006 if main else .003))
                m.add("tick", ts, s, (-.35 if (st // 2) % 2 else .35), L["tick"] * (.62 if main else .26) * (1.6 if last else 1))
        # Doruk melodisi
        if L["lead"] and not last and name in MEL:
            for beat, note, d in MEL[name]:
                ts = bar_t(b, beat)
                dd = bar_t(b, beat + d) - ts
                nn = int((dd + .4) * SR)
                f = mtof(note)
                tt = np.arange(nn) / SR
                mod = np.sin(2 * np.pi * f * 2 * tt) * 1.6 * np.exp(-tt / .25)      # FM zil tınısı
                s = np.sin(2 * np.pi * f * tt + mod) * adsr(nn, .01, .2, .55, .35)
                s += np.sin(2 * np.pi * f * 2 * tt) * .12 * np.exp(-tt / .3)
                m.add("lead", ts, s, -.15, L["lead"] * .22)

    # Vurgular: alt boom + crash + öncesinde ters süpürme
    for th, g in F["hits"]:
        ts = float(np.interp(th, T, T))
        nn = int(2.2 * SR)
        tt = np.arange(nn) / SR
        boom = np.sin(2 * np.pi * (34 + 24 * np.exp(-tt / .25)) * tt) * np.exp(-tt / .9)
        crash = hp(RNG.normal(0, 1, nn), 4200) * np.exp(-tt / (.55 * g + .3))
        m.add("fx", ts, boom, 0, .38 * g)
        m.add("fx", ts, crash, .2, .07 * g)
        sw = int(1.6 * SR)
        st = ts - 1.6
        if st > 0:
            swn = bp(RNG.normal(0, 1, sw), 1500, 9000) * (np.linspace(0, 1, sw) ** 3)
            m.add("fx", st, swn, -.2, .1 * g)
    # Giriş pingleri (giriş cümleleriyle)
    for tp in F["pings"]:
        nn = int(1.8 * SR)
        tt = np.arange(nn) / SR
        f = mtof(81)
        s = np.sin(2 * np.pi * f * tt + np.sin(2 * np.pi * f * 3.5 * tt) * .8 * np.exp(-tt / .4)) * np.exp(-tt / .6)
        m.add("lead", tp, s, .25, .16)
    # Giriş yükselişi
    a, b2 = F["riser"]
    nn = int((b2 - a) * SR)
    tt = np.arange(nn) / SR
    k = tt / tt[-1]
    noise = bp(RNG.normal(0, 1, nn), 600, 6000) * k ** 2.5
    gl = np.sin(2 * np.pi * np.cumsum(180 + 900 * k ** 2) / SR) * k ** 2
    m.add("fx", a, noise * .12 + gl * .05, 0, 1)

    # Sidechain: kick sonrası pad/bas/arpej hafifçe çekilir
    duck = np.ones(m.n)
    for tk in kicks:
        i = int(tk * SR)
        seg = 1 - .45 * np.exp(-np.arange(int(.3 * SR)) / (.09 * SR))
        j = min(m.n, i + len(seg))
        duck[i:j] = np.minimum(duck[i:j], seg[: j - i])
    for k2 in ("pad", "bass", "arp"):
        m.bus[k2] *= duck

    # Arpej gecikmesi (noktalı 8'lik, karşılıklı)
    arp = m.bus["arp"].copy()
    dly = int(.375 * SR)
    for rep in range(1, 4):
        sh = dly * rep
        g = .33 ** rep
        tgt = m.bus["arp"]
        ch = rep % 2
        tgt[ch, sh:] += lp(arp[1 - ch, :-sh], 4000) * g

    # Reverb: üstel sönümlü gürültü IR
    ir_n = int(2.6 * SR)
    ti = np.arange(ir_n) / SR
    ir = np.stack([lp(RNG.normal(0, 1, ir_n), 6000) * np.exp(-ti / .62) for _ in range(2)])
    ir /= np.abs(ir).sum(axis=1, keepdims=True) ** .5 * 30
    send = (m.bus["pad"] * .35 + m.bus["arp"] * .4 + m.bus["lead"] * .45 + m.bus["drums"] * .06
            + m.bus["tick"] * .25 + m.bus["fx"] * .3)
    wet = np.stack([fftconvolve(send[c], ir[c])[: m.n] for c in range(2)])

    mix = (m.bus["pad"] + m.bus["arp"] + m.bus["bass"] + m.bus["drums"] + m.bus["tick"]
           + m.bus["fx"] + m.bus["lead"] + wet * .9)
    mix = np.stack([hp(mix[c], 28) for c in range(2)])
    # Son: video sonunda yumuşak kapanış
    tail = int(END * SR)
    fade = int(1.4 * SR)
    mix[:, tail - fade:tail] *= np.linspace(1, 0, fade) ** 1.6
    mix = mix[:, :tail]
    mix[:, :int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))
    # Doruğa doğru yükselen genel seviye: bölüm kazançları yumuşak geçişle
    GAIN = {"intro": .55, "ch1": .62, "ch2": .74, "ch3": .84, "climax": 1.0, "tour": .86, "rank": 1.0, "outro": .78}
    tg = np.arange(mix.shape[1]) / SR
    pts = [(t0, GAIN[name]) for t0, name in F["sections"]]
    xs = [p[0] for p in pts for _ in (0, 1)][1:] + [END + 2]
    ys = [g for p in pts for g in (p[1], p[1])]
    xs = [x + (.0 if i % 2 == 0 else -.6) for i, x in enumerate(xs)]
    genv = np.interp(tg, np.maximum.accumulate(np.array(xs)), ys)
    mix *= genv
    # Master: yumuşak sınırlama ve -1 dBFS tepe
    mix = np.tanh(mix / np.percentile(np.abs(mix), 99.95) * .95)
    mix *= 10 ** (-1 / 20) / np.abs(mix).max()
    return mix


def write_wav(path, x):
    pcm = (np.clip(x.T, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in FORMS:
        sys.exit(__doc__)
    write_wav(sys.argv[2], render(sys.argv[1]))
    print(f"{sys.argv[2]} yazıldı ({FORMS[sys.argv[1]]['end']} sn)")
