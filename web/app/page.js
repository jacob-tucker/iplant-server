"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { METRICS } from "@/lib/metrics";
import Gauge from "./components/Gauge";
import Plant from "./components/Plant";
import LiveFeed from "./components/LiveFeed";

const MAX_FEED = 30;

export default function Home() {
  const [readings, setReadings] = useState([]);
  const [status, setStatus] = useState("connecting"); // connecting | live | offline
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef(null);

  // Briefly trigger the plant bounce whenever a new reading arrives.
  function triggerPulse() {
    setPulse(true);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 600);
  }

  // 1) Load the recent readings for an instant-populated dashboard.
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/readings?limit=${MAX_FEED}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setReadings(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Subscribe to the live stream. EventSource auto-reconnects on drop.
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/stream`);

    es.onopen = () => setStatus("live");
    es.onerror = () => setStatus("offline");
    es.onmessage = (e) => {
      try {
        const reading = JSON.parse(e.data);
        setReadings((prev) => [reading, ...prev].slice(0, MAX_FEED));
        setStatus("live");
        triggerPulse();
      } catch {
        // ignore heartbeats / malformed frames
      }
    };

    return () => es.close();
  }, []);

  const latest = readings[0] || null;

  return (
    <main className="garden">
      <header className="garden-header">
        <h1 className="garden-title">🌿 My Little Garden</h1>
        <span className={`status-pill status-${status}`}>
          <span className="status-dot" />
          {status === "live" ? "live" : status === "connecting" ? "connecting…" : "offline"}
        </span>
      </header>

      <section className="hero">
        <Plant latest={latest} pulse={pulse} />
        {latest && (
          <p className="hero-stamp">
            last reading {new Date(latest.receivedAt).toLocaleTimeString()}
          </p>
        )}
      </section>

      <section className="gauges">
        {METRICS.map((m) => (
          <Gauge key={m.key} metric={m} value={latest?.data?.[m.key]} />
        ))}
      </section>

      <section className="feed-section">
        <LiveFeed readings={readings} />
      </section>

      <footer className="garden-footer">
        listening to <code>{API_BASE}</code>
      </footer>
    </main>
  );
}
