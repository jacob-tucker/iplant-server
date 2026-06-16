"use client";

import { METRICS } from "@/lib/metrics";

function timeAgo(iso) {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

// Scrolling list of recent readings, newest at the top. The first row gets a
// gentle "just arrived" highlight via the `is-new` class.
export default function LiveFeed({ readings }) {
  if (readings.length === 0) {
    return (
      <div className="feed">
        <h2 className="feed-title">🌾 Live feed</h2>
        <p className="feed-empty">No readings yet — waiting for the plant to say hi…</p>
      </div>
    );
  }

  return (
    <div className="feed">
      <h2 className="feed-title">🌾 Live feed</h2>
      <ul className="feed-list">
        {readings.map((r, i) => (
          <li key={r.id || r.receivedAt} className={`feed-row ${i === 0 ? "is-new" : ""}`}>
            <div className="feed-row-top">
              <span className="feed-device">{r.data?.device_id || "device"}</span>
              <span className="feed-time">{timeAgo(r.receivedAt)}</span>
            </div>
            <div className="feed-metrics">
              {METRICS.map((m) => {
                const v = r.data?.[m.key];
                if (v == null) return null;
                return (
                  <span key={m.key} className="feed-chip" title={m.label}>
                    {m.emoji} {v}
                    <em>{m.unit}</em>
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
