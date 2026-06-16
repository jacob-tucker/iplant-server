"use client";

import { fernMood } from "@/lib/metrics";

// The pivot every frond rotates around — the soil line in the pot.
const PIVOT_X = 150;
const PIVOT_Y = 322;

// Build one frond pointing straight up from the pivot. Every frond shares this
// geometry; each is fanned into place with a per-frond rotation (--a) in CSS,
// so the sway animation and the fan angle compose cleanly.
function frondLeaflets() {
  const tipY = 96;
  const len = PIVOT_Y - tipY;
  const n = 12;
  const leaflets = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.6) / (n + 0.6); // 0..1 from base to tip
    const y = PIVOT_Y - len * t;
    const x = PIVOT_X + Math.sin(t * Math.PI) * 5; // gentle curve
    const size = 17 * (1 - t) + 4; // larger near the base
    leaflets.push({ x, y, size, side: 1 });
    leaflets.push({ x, y, size, side: -1 });
  }
  return { tipY, leaflets };
}

const { tipY, leaflets } = frondLeaflets();

// Fan angles (degrees) and a length scale for each frond. Outer fronds are a
// touch shorter so the silhouette reads as a rounded fern.
const FRONDS = [
  { a: -74, s: 0.82 },
  { a: -55, s: 0.92 },
  { a: -37, s: 1.0 },
  { a: -19, s: 1.05 },
  { a: 0, s: 1.08 },
  { a: 19, s: 1.05 },
  { a: 37, s: 1.0 },
  { a: 55, s: 0.92 },
  { a: 74, s: 0.82 },
];

function Frond({ a, s, i }) {
  const dur = 3.6 + (i % 3) * 0.5; // slight variety so it isn't robotic
  const delay = (i % 4) * 0.35;
  return (
    <g
      className="frond"
      style={{
        "--a": a,
        "--s": s,
        "--dur": `${dur}s`,
        "--delay": `${delay}s`,
      }}
    >
      <path
        className="frond-stem"
        d={`M${PIVOT_X} ${PIVOT_Y} Q ${PIVOT_X + 6} ${(PIVOT_Y + tipY) / 2} ${PIVOT_X} ${tipY}`}
      />
      {leaflets.map((lf, k) => {
        const cx = lf.x + lf.side * lf.size * 0.55;
        const angle = lf.side === 1 ? -48 : -132;
        return (
          <ellipse
            key={k}
            className="leaflet"
            cx={cx}
            cy={lf.y}
            rx={lf.size}
            ry={lf.size * 0.42}
            transform={`rotate(${angle} ${cx} ${lf.y})`}
          />
        );
      })}
      {/* tiny curled tip */}
      <circle className="leaflet" cx={PIVOT_X} cy={tipY - 2} r="4" />
    </g>
  );
}

export default function Fern({ latest, pulse }) {
  const mood = fernMood(latest?.data);

  return (
    <div className={`fern-stage mood-${mood.key}`}>
      <div className="bubble">{mood.line}</div>

      <svg
        className={`fern ${pulse ? "is-perking" : ""}`}
        viewBox="0 0 300 430"
        role="img"
        aria-label={`Fern, ${mood.line}`}
      >
        {/* fronds */}
        <g className="fronds">
          {FRONDS.map((f, i) => (
            <Frond key={i} a={f.a} s={f.s} i={i} />
          ))}
        </g>

        {/* pot */}
        <g className="pot">
          <ellipse className="soil" cx="150" cy="322" rx="58" ry="11" />
          <path className="pot-body" d="M96 330 L204 330 L190 412 Q188 420 180 420 L120 420 Q112 420 110 412 Z" />
          <path className="pot-rim" d="M88 322 L212 322 L204 342 L96 342 Z" />
          <ellipse className="pot-shadow" cx="150" cy="424" rx="70" ry="9" />
        </g>
      </svg>
    </div>
  );
}
