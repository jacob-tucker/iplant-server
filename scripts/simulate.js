// Posts fake plant readings to the local server on an interval, so you can
// watch the garden dashboard update live without the real hardware.
//
//   npm run simulate              # posts to http://localhost:3000
//   TARGET=https://iplant-server.onrender.com npm run simulate
//
// Values drift gently around a baseline to look like a real sensor.

const TARGET = process.env.TARGET || "http://localhost:3000";
const INTERVAL_MS = Number(process.env.INTERVAL_MS) || 3000;
const DEVICE_ID = process.env.DEVICE_ID || "plant_01";

// Mutable baseline that we nudge each tick for a natural-looking wander.
// Baselines sit inside a fern's happy ranges so the demo shows a content plant.
const state = {
  temperature: 21,
  humidity: 66,
  pressure: 1013,
  light: 7200,
};

// Random walk: nudge `value` by up to ±`step`, clamped to [min, max].
function drift(value, step, min, max) {
  const next = value + (Math.random() - 0.5) * 2 * step;
  return Math.min(max, Math.max(min, next));
}

function round(n, places = 2) {
  return Number(n.toFixed(places));
}

async function tick() {
  state.temperature = drift(state.temperature, 0.15, 15, 30);
  state.humidity = drift(state.humidity, 0.6, 40, 95);
  state.pressure = drift(state.pressure, 0.2, 995, 1032);
  state.light = drift(state.light, 220, 1000, 11500);

  const reading = {
    device_id: DEVICE_ID,
    temperature: round(state.temperature),
    humidity: round(state.humidity),
    pressure: round(state.pressure),
    light: round(state.light, 0),
  };

  try {
    const res = await fetch(`${TARGET}/api/readings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reading),
    });
    console.log(res.status, JSON.stringify(reading));
  } catch (err) {
    console.error("post failed:", err.message);
  }
}

console.log(`Simulating readings -> ${TARGET} every ${INTERVAL_MS}ms (Ctrl+C to stop)`);
tick();
setInterval(tick, INTERVAL_MS);
