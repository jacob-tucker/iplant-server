// Small stroke icons drawn in SVG so they render identically everywhere
// (no emoji). They inherit color via `currentColor`.
const PATHS = {
  thermometer: (
    <>
      <path d="M10 4.5a2.5 2.5 0 0 1 5 0v8.2a4 4 0 1 1-5 0Z" />
      <path d="M12.5 9v5.2" />
    </>
  ),
  droplet: <path d="M12 3.5c3.2 3.8 5.5 6.6 5.5 9.4a5.5 5.5 0 1 1-11 0c0-2.8 2.3-5.6 5.5-9.4Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15l4-3.5" />
      <circle cx="12" cy="15" r="1.3" />
    </>
  ),
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
