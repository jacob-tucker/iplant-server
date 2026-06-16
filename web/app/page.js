"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { METRICS } from "@/lib/metrics";
import Fern from "./components/Fern";
import MetricCard from "./components/MetricCard";
import LiveFeed from "./components/LiveFeed";
import Sky from "./components/Sky";

const MAX_FEED = 24;

const CONNECTION_COPY = {
  connecting: "saying hello…",
  live: "live",
  offline: "asleep",
};

// Is it night in the US Eastern time zone right now? Night = 7pm–6am ET.
function isNightInEastern() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  return hour >= 19 || hour < 6;
}

export default function Home() {
  const [readings, setReadings] = useState([]);
  const [status, setStatus] = useState("connecting");
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef(null);

  // Briefly perk the fern up whenever a fresh reading lands.
  function triggerPulse() {
    setPulse(true);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 700);
  }

  // Load recent readings so the page is populated immediately.
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

  // Switch to the night theme after dark in Eastern time; re-check each minute.
  useEffect(() => {
    const apply = () => document.documentElement.classList.toggle("night", isNightInEastern());
    apply();
    const id = setInterval(apply, 60000);
    return () => {
      clearInterval(id);
      document.documentElement.classList.remove("night");
    };
  }, []);

  // Subscribe to the live stream (EventSource auto-reconnects if dropped).
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
    <main className="page">
      <Sky />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-name">Fernie</span>
        </div>
        <span className={`pulse pulse-${status}`}>
          <span className="firefly" />
          {CONNECTION_COPY[status]}
        </span>
      </header>

      <section className="stage">
        <Fern latest={latest} pulse={pulse} />
        {latest && (
          <p className="stage-stamp">
            checked in at {new Date(latest.receivedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
        )}
      </section>

      <section className="cards">
        {METRICS.map((m) => (
          <MetricCard key={m.key} metric={m} value={latest?.data?.[m.key]} />
        ))}
      </section>

      <LiveFeed readings={readings} />

      <footer className="footer">
        <span>tending to a fern, one reading at a time</span>
      </footer>
    </main>
  );
}
