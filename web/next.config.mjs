/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app has its own lockfile separate from the parent Express server.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
