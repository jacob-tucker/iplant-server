# iplant-server

A small HTTP server that ingests JSON readings from a plant-reader hardware
device. This is the initial (v0) version — intentionally minimal, but
structured so it can grow into a full server later.

## Run it

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
curl -X POST http://localhost:3000/api/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "plant-01", "moisture": 42.5, "temperature": 21.3, "light": 800}'
```

Successful response:

```json
{ "status": "received", "receivedAt": "2026-06-15T19:00:00.000Z" }
```

> Replace `localhost:3000` with the server's public address once it's
> deployed (e.g. `http://your-server.com/api/readings`).

## Endpoints

| Method | Path             | Purpose                                  |
|--------|------------------|------------------------------------------|
| GET    | `/`              | Health check                             |
| POST   | `/api/readings`  | Device sends a reading (JSON body)       |

## Where data goes

For v0, each reading is just **logged to the console** (stamped with a
`receivedAt` timestamp), so you can watch data arrive while developing. Lines
are prefixed with `READING` for easy grepping. Nothing is persisted yet —
when you're ready to scale, replace the `console.log` in `server.js` with a
database write (Postgres, SQLite, etc.).

## Notes for "eventually a whole server"

Things deliberately left out of v0, easy to add next:
- Authentication (an API key/token from the device)
- A defined schema + validation for readings
- A database instead of a flat file
- HTTPS / deployment config
