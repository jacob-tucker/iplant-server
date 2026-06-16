"use client";

import { fraction, inGoodRange, statusFor } from "@/lib/metrics";
import Icon from "./Icon";

// One metric, shown as a soft card with a custom icon, the value, and a little
// "happy band" meter: the green band is the fern's ideal range, the bobbing
// marker is the current reading.
export default function MetricCard({ metric, value }) {
  const f = fraction(metric, value);
  const happy = inGoodRange(metric, value);
  const status = statusFor(metric, value);

  // Map the good range onto the 0..100% track.
  const span = metric.max - metric.min;
  const bandLeft = ((metric.good[0] - metric.min) / span) * 100;
  const bandWidth = ((metric.good[1] - metric.good[0]) / span) * 100;
  const display = value == null || Number.isNaN(value) ? "–" : value;

  return (
    <article className={`card tone-${status.tone}`} style={{ "--accent": metric.color }}>
      <header className="card-head">
        <span className="card-icon">
          <Icon name={metric.icon} />
        </span>
        <span className="card-label">{metric.label}</span>
      </header>

      <div className="card-value">
        <span className="num">{display}</span>
        <span className="unit">{metric.unit}</span>
      </div>

      <div className="meter">
        <span className="meter-band" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
        <span className={`meter-marker ${happy ? "in-range" : ""}`} style={{ left: `${f * 100}%` }} />
      </div>

      <p className="card-status">{status.text}</p>
    </article>
  );
}
