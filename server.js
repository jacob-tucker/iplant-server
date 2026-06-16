import express from "express";

const PORT = process.env.PORT || 3000;

// How many recent readings to keep in memory for the dashboard's initial load.
// v0 is in-memory only — restarting the server clears this. Swap for a DB later.
const MAX_READINGS = 200;

const app = express();

// Parse JSON request bodies. The hardware should send Content-Type: application/json.
app.use(express.json());

// Allow the Next.js dashboard (served from a different origin/port) to read
// from this server, including the SSE stream. v0 is wide open; lock down the
// allowed origin when this carries real data.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Tiny request log so you can see the device hitting the server.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.path}`);
  next();
});

// --- In-memory store + live subscribers ------------------------------------
// Ring buffer of the most recent readings (newest last).
const readings = [];
// Set of connected SSE clients (Express response objects) to broadcast to.
const subscribers = new Set();

function broadcast(reading) {
  const payload = `data: ${JSON.stringify(reading)}\n\n`;
  for (const res of subscribers) {
    res.write(payload);
  }
}

// Health check — handy for confirming the server is up.
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "iplant-server", readings: readings.length });
});

// Recent readings, newest first — used by the dashboard for its initial load.
app.get("/api/readings", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, MAX_READINGS);
  res.json(readings.slice(-limit).reverse());
});

// Live stream of readings via Server-Sent Events. The dashboard subscribes
// here with an EventSource and receives each new reading as it arrives.
app.get("/api/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 3000\n\n"); // tell the browser to reconnect after 3s if dropped
  res.write(": connected\n\n");

  subscribers.add(res);

  // Heartbeat so idle connections aren't closed by proxies (e.g. Render).
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    subscribers.delete(res);
  });
});

// --- Main ingest endpoint -------------------------------------------------
// The device POSTs its reading here as a JSON body.
// We accept any JSON shape for now, stamp + store + broadcast it, then log it.
app.post("/api/readings", (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Expected a JSON object body. Send Content-Type: application/json.",
    });
  }

  const reading = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    data: body,
  };

  // Store (capped), push live to any connected dashboards, then log.
  readings.push(reading);
  if (readings.length > MAX_READINGS) readings.shift();
  broadcast(reading);

  console.log("READING", JSON.stringify({ receivedAt: reading.receivedAt, data: reading.data }));

  res.status(201).json({ status: "received", receivedAt: reading.receivedAt });
});

// Clean JSON error for malformed request bodies (e.g. the device sends bad
// JSON) instead of Express's default HTML stack-trace page.
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON." });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`iplant-server listening on http://localhost:${PORT}`);
  console.log(`POST readings to http://localhost:${PORT}/api/readings`);
  console.log(`Live stream at   http://localhost:${PORT}/api/stream`);
});
