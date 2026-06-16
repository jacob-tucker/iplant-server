// Where the iplant ingest server lives. Defaults to the local dev server;
// override with NEXT_PUBLIC_IPLANT_API (e.g. the Render URL) at build/run time.
export const API_BASE =
  process.env.NEXT_PUBLIC_IPLANT_API || "http://localhost:3000";
