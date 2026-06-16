// Display config for each sensor field the device sends.
// `min`/`max` define the gauge's full sweep; `good` is the happy range we
// highlight. Keep keys in sync with the device's JSON field names.
export const METRICS = [
  {
    key: "temperature",
    label: "Temperature",
    emoji: "🌡️",
    unit: "°C",
    min: 5,
    max: 35,
    good: [18, 26],
    color: "#ff9a76",
  },
  {
    key: "humidity",
    label: "Humidity",
    emoji: "💧",
    unit: "%",
    min: 0,
    max: 100,
    good: [50, 80],
    color: "#5bb6e0",
  },
  {
    key: "pressure",
    label: "Pressure",
    emoji: "🌬️",
    unit: "hPa",
    min: 980,
    max: 1020,
    good: [995, 1015],
    color: "#b69cf0",
  },
  {
    key: "light",
    label: "Light",
    emoji: "☀️",
    unit: "lux",
    min: 0,
    max: 1200,
    good: [200, 900],
    color: "#f4c95d",
  },
];

// Fraction (0..1) of where `value` sits within the gauge's [min, max] sweep.
export function fraction(metric, value) {
  if (value == null || Number.isNaN(value)) return 0;
  const f = (value - metric.min) / (metric.max - metric.min);
  return Math.min(1, Math.max(0, f));
}

export function inGoodRange(metric, value) {
  if (value == null || Number.isNaN(value)) return false;
  return value >= metric.good[0] && value <= metric.good[1];
}

// Pick the plant's overall mood from the latest reading.
export function plantMood(data) {
  if (!data) return { emoji: "🌱", label: "waiting for the first reading…" };

  const { temperature: t, humidity: h, light: l } = data;
  if (h != null && h < 45) return { emoji: "🥀", label: "a little thirsty" };
  if (t != null && t > 29) return { emoji: "🥵", label: "feeling too warm" };
  if (t != null && t < 12) return { emoji: "🥶", label: "a bit chilly" };
  if (l != null && l < 5) return { emoji: "🌙", label: "resting in the dark" };
  if (h != null && h > 88) return { emoji: "💦", label: "very dewy" };
  return { emoji: "🌿", label: "happy & thriving" };
}
