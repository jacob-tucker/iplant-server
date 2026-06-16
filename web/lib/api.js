// Where the iplant ingest server lives. Defaults to the live Render server so
// the deployed dashboard works out of the box. Override with
// NEXT_PUBLIC_IPLANT_API (e.g. http://localhost:3000) for local development.
export const API_BASE =
  process.env.NEXT_PUBLIC_IPLANT_API || "https://iplant-server.onrender.com";
