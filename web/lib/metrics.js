// Care thresholds tuned for a fern (Boston fern as the reference plant):
//   • Temperature 18–24°C  (65–75°F daytime)
//   • Humidity    50–80%   (ferns love it damp; higher is better)
//   • Light       5k–10k lux of *bright indirect* light (direct sun scorches)
//   • Pressure    not a plant need — just shown as calm/unsettled ambient air
// `min`/`max` set each meter's full sweep; `good` is the fern's happy band.
export const METRICS = [
  {
    key: "temperature",
    label: "Temperature",
    icon: "thermometer",
    unit: "°C",
    min: 5,
    max: 35,
    good: [18, 24],
    color: "var(--warm)",
    happy: "just right",
    low: "a little cool",
    high: "too toasty",
  },
  {
    key: "humidity",
    label: "Humidity",
    icon: "droplet",
    unit: "%",
    min: 0,
    max: 100,
    good: [50, 80],
    color: "var(--aqua)",
    happy: "perfectly dewy",
    low: "a bit dry",
    high: "very steamy",
  },
  {
    key: "light",
    label: "Light",
    icon: "sun",
    unit: "lux",
    min: 0,
    max: 12000,
    good: [5000, 10000],
    color: "var(--honey)",
    happy: "lovely and bright",
    low: "on the dim side",
    high: "a touch harsh",
  },
  {
    key: "pressure",
    label: "Air pressure",
    icon: "gauge",
    unit: "hPa",
    min: 980,
    max: 1040,
    good: [1005, 1025],
    color: "var(--lilac)",
    happy: "calm skies",
    low: "unsettled air",
    high: "heavy air",
  },
];

// Fraction (0..1) of where `value` sits within the meter's [min, max] sweep.
export function fraction(metric, value) {
  if (value == null || Number.isNaN(value)) return 0;
  const f = (value - metric.min) / (metric.max - metric.min);
  return Math.min(1, Math.max(0, f));
}

export function inGoodRange(metric, value) {
  if (value == null || Number.isNaN(value)) return false;
  return value >= metric.good[0] && value <= metric.good[1];
}

// Friendly one-liner for a single metric, plus a tone for styling.
export function statusFor(metric, value) {
  if (value == null || Number.isNaN(value)) return { text: "waiting", tone: "idle" };
  if (value < metric.good[0]) return { text: metric.low, tone: "low" };
  if (value > metric.good[1]) return { text: metric.high, tone: "high" };
  return { text: metric.happy, tone: "good" };
}

// The fern's overall mood, picked from the latest reading. Drives both the
// drawing's expression and the little speech bubble.
export function fernMood(data) {
  if (!data) return { key: "idle", line: "waiting to hear from the sensor…" };
  const { temperature: t, humidity: h, light: l } = data;
  if (h != null && h < 45) return { key: "thirsty", line: "I'm getting a little thirsty." };
  if (t != null && t > 27) return { key: "hot", line: "Phew, it's toasty in here!" };
  if (t != null && t < 13) return { key: "cold", line: "Brr — a touch chilly." };
  if (l != null && l < 1500) return { key: "dim", line: "It's cozy and dim right now." };
  if (h != null && h > 88) return { key: "lush", line: "So dewy. I love it." };
  return { key: "happy", line: "I'm feeling lovely today." };
}
