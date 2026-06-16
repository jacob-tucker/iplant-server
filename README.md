# iplant-server

A small HTTP server that ingests JSON readings from a plant-reader hardware
device. This is the initial (v0) version — intentionally minimal, but
structured so it can grow into a full server later.

## Live deployment

Deployed on [Render](https://render.com) as a Web Service:

```
https://iplant-server.onrender.com
```

The device should POST readings to:

```
https://iplant-server.onrender.com/api/readings
```

Render assigns the port via the `PORT` environment variable, which the server
reads automatically — no config needed.

> **Heads up (free tier):** the instance sleeps after ~15 min idle. The first
> request after sleep takes ~30–60s to wake, and anything sent *while it's
> asleep is lost*. Since v0 only logs (nothing is persisted), move to an
> always-on instance **and** add a database before this carries real data.

## Run it locally

```bash
npm install
npm start          # or: npm run dev  (auto-restarts on file changes)
```

The server listens on port `3000` by default (override with `PORT`).

## How the device sends data

Have the device make an HTTP **POST** request to `/api/readings` with a JSON
body and `Content-Type: application/json`. The body can be any JSON object —
whatever fields the plant reader produces.

Example with `curl`:

```bash
curl -X POST https://iplant-server.onrender.com/api/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "plant-01", "moisture": 42.5, "temperature": 21.3, "light": 800}'
```

Successful response:

```json
{ "status": "received", "receivedAt": "2026-06-15T19:00:00.000Z" }
```

> For local testing, swap the URL for `http://localhost:3000/api/readings`.

## Endpoints

| Method | Path             | Purpose                                            |
|--------|------------------|----------------------------------------------------|
| GET    | `/`              | Health check                                       |
| GET    | `/api/readings`  | Recent readings, newest first (`?limit=` up to 200)|
| GET    | `/api/stream`    | Live stream of readings (Server-Sent Events)       |
| POST   | `/api/readings`  | Device sends a reading (JSON body)                 |

## The garden dashboard (`web/`)

A cute [Next.js](https://nextjs.org) garden homepage that shows readings come
in **live** — gauges for each metric, a potted plant whose mood reacts to the
latest reading, and a scrolling live feed. It connects to this server's
`/api/stream` (SSE) for live pushes and `/api/readings` for the initial load.

```bash
cd web
npm install
npm run dev        # http://localhost:3001
```

By default it talks to `http://localhost:3000`. Point it at another server
(e.g. the Render deployment) with an env var:

```bash
NEXT_PUBLIC_IPLANT_API=https://iplant-server.onrender.com npm run dev
```

### See it live without the hardware

In a second terminal, run the simulator — it POSTs gently-drifting fake
readings so you can watch the dashboard update:

```bash
npm run simulate                                   # -> http://localhost:3000
TARGET=https://iplant-server.onrender.com npm run simulate   # -> Render
```

So a full local demo is three terminals: `npm start` (server),
`npm run simulate` (fake device), and `cd web && npm run dev` (dashboard).

## Where data goes

For v0, each reading is **logged to the console** (prefixed `READING`) *and*
kept in an **in-memory** ring buffer (the last 200) so the dashboard has
something to show. This buffer is cleared on restart and not shared across
instances — when you're ready to scale, replace the `console.log` /
in-memory store in `server.js` with a database write (Postgres, SQLite, etc.).

## Notes for "eventually a whole server"

Things deliberately left out of v0, easy to add next:
- Authentication (an API key/token from the device)
- A defined schema + validation for readings
- A database instead of a flat file
- HTTPS / deployment config
