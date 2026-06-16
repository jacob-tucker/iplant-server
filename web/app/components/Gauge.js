"use client";

import { fraction, inGoodRange } from "@/lib/metrics";

// A circular gauge card for one metric. The ring fills to the value's position
// in the metric's range, glowing green when it's in the happy range.
export default function Gauge({ metric, value }) {
  const f = fraction(metric, value);
  const happy = inGoodRange(metric, value);

  const R = 52; // ring radius
  const C = 2 * Math.PI * R; // circumference
  const dash = C * f;

  const display = value == null || Number.isNaN(value) ? "—" : value;
  const ringColor = happy ? "#6cc070" : metric.color;

  return (
    <div className={`gauge-card ${happy ? "is-happy" : ""}`}>
      <div className="gauge-ring">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r={R} className="gauge-track" />
          <circle
            cx="60"
            cy="60"
            r={R}
            className="gauge-fill"
            stroke={ringColor}
            strokeDasharray={`${dash} ${C}`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-emoji">{metric.emoji}</span>
          <span className="gauge-value">{display}</span>
          <span className="gauge-unit">{metric.unit}</span>
        </div>
      </div>
      <div className="gauge-label">{metric.label}</div>
    </div>
  );
}
