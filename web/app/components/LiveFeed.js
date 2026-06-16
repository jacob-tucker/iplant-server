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

// A tidy log of recent readings, newest on top. The freshest row gets a soft
// highlight and slides in.
export default function LiveFeed({ readings }) {
  return (
    <section className="feed">
      <h2 className="feed-title">Recent notes</h2>

      {readings.length === 0 ? (
        <p className="feed-empty">No readings yet — your fern will check in soon.</p>
      ) : (
        <ul className="feed-list">
          {readings.map((r, i) => (
            <li key={r.id || r.receivedAt} className={`feed-row ${i === 0 ? "is-new" : ""}`}>
              <div className="feed-row-top">
                <span className="feed-device">{r.data?.device_id || "sensor"}</span>
                <span className="feed-time">{timeAgo(r.receivedAt)}</span>
              </div>
              <div className="feed-chips">
                {METRICS.map((m) => {
                  const v = r.data?.[m.key];
                  if (v == null) return null;
                  return (
                    <span key={m.key} className="chip" style={{ "--accent": m.color }}>
                      <span className="chip-dot" />
                      {v}
                      <em>{m.unit}</em>
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
