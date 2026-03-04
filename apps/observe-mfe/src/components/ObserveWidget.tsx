import React from "react";
import { MoodHistory } from "./MoodHistory";
import { PatternsList } from "./PatternsList";

interface ObserveWidgetProps {
  userId: string;
}

export function ObserveWidget({ userId }: ObserveWidgetProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
          📊 Observation Dashboard
        </h2>
      </div>
      <MoodHistory userId={userId} />
      <PatternsList userId={userId} />
    </div>
  );
}
