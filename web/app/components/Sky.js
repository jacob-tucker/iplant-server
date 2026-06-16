// Decorative, non-interactive backdrop: a soft sun that slowly turns and a
// handful of spores drifting upward. Values are fixed (not random) so the
// server and client render the same markup.
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

export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sun" />
      {MOTES.map((m, i) => (
        <span
          key={i}
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
