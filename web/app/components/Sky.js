// Decorative, non-interactive backdrop. By day: a soft sun + drifting spores.
// By night (toggled with the .night class on <html>): a moon + twinkling stars.
// Values are fixed (not random) so server and client render identical markup.
const MOTES = [
  { left: 8, size: 7, dur: 17, delay: 0, drift: 18 },
  { left: 22, size: 5, dur: 22, delay: 4, drift: -14 },
  { left: 35, size: 9, dur: 19, delay: 9, drift: 22 },
  { left: 48, size: 4, dur: 25, delay: 2, drift: -10 },
  { left: 61, size: 8, dur: 16, delay: 7, drift: 16 },
  { left: 73, size: 5, dur: 23, delay: 12, drift: -20 },
  { left: 84, size: 7, dur: 20, delay: 5, drift: 12 },
  { left: 93, size: 4, dur: 27, delay: 10, drift: -16 },
];

const STARS = [
  { left: 12, top: 14, size: 3, dur: 3.2, delay: 0 },
  { left: 26, top: 28, size: 2, dur: 4.1, delay: 1.4 },
  { left: 41, top: 10, size: 3, dur: 3.6, delay: 0.7 },
  { left: 58, top: 22, size: 2, dur: 4.6, delay: 2.1 },
  { left: 69, top: 12, size: 3, dur: 3.0, delay: 1.0 },
  { left: 81, top: 30, size: 2, dur: 4.3, delay: 0.4 },
  { left: 90, top: 18, size: 3, dur: 3.8, delay: 1.8 },
  { left: 18, top: 40, size: 2, dur: 4.0, delay: 2.6 },
  { left: 50, top: 38, size: 2, dur: 3.4, delay: 1.2 },
  { left: 75, top: 44, size: 3, dur: 4.4, delay: 0.9 },
];

export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sun" />
      <div className="moon" />

      {STARS.map((s, i) => (
        <span
          key={`star-${i}`}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          }}
        />
      ))}

      {MOTES.map((m, i) => (
        <span
          key={`mote-${i}`}
          className="mote"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            "--dur": `${m.dur}s`,
            "--delay": `${m.delay}s`,
            "--drift": `${m.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
