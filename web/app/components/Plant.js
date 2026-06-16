"use client";

import { plantMood } from "@/lib/metrics";

// The centerpiece: a potted plant whose face/mood reflects the latest reading.
// `pulse` briefly bounces the plant whenever a fresh reading lands.
export default function Plant({ latest, pulse }) {
  const mood = plantMood(latest?.data);

  return (
    <div className="plant-stage">
      <div className={`plant ${pulse ? "plant-pulse" : ""}`}>
        <div className="plant-leaves">{mood.emoji}</div>
        <div className="plant-pot">🪴</div>
      </div>
      <p className="plant-mood">{mood.label}</p>
    </div>
  );
}
