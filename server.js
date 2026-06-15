import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();

// Parse JSON request bodies. The hardware should send Content-Type: application/json.
app.use(express.json());

// Tiny request log so you can see the device hitting the server.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.path}`);
  next();
});

// Health check — handy for confirming the server is up.
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "iplant-server" });
});

// --- Main ingest endpoint -------------------------------------------------
// The device POSTs its reading here as a JSON body.
// We accept any JSON shape for now and just stamp + log it, so your friend
// can start sending data immediately without us locking down a schema yet.
app.post("/api/readings", (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Expected a JSON object body. Send Content-Type: application/json.",
    });
  }

  const reading = {
    receivedAt: new Date().toISOString(),
    data: body,
  };

  // For v0 we just log the reading. Swap this for a DB write when ready.
  console.log("READING", JSON.stringify(reading));

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
});
