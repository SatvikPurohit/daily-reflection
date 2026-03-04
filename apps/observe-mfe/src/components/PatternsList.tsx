import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import type { Pattern } from "@repo/shared-types";

const client = new GraphQLClient(
  (typeof window !== "undefined" ? window.location.origin : "") + "/graphql"
);

const PATTERNS_QUERY = `
  query GetPatterns($userId: ID!) {
    patterns(userId: $userId) {
      id type pattern frequency correlationWithMood correlationWithUrge lastOccurrence
    }
  }
`;

interface PatternsListProps {
  userId: string;
}

const correlationLabel = (value: number): { label: string; color: string } => {
  if (value > 0.3) return { label: "Positive", color: "#10b981" };
  if (value < -0.3) return { label: "Negative", color: "#f43f5e" };
  return { label: "Neutral", color: "#94a3b8" };
};

export function PatternsList({ userId }: PatternsListProps) {
  const { data, isLoading } = useQuery<{ patterns: Pattern[] }>({
    queryKey: ["observe-patterns", userId],
    queryFn: () => client.request(PATTERNS_QUERY, { userId }),
  });

  if (isLoading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e2e8f0",
        }}
      >
        <p style={{ color: "#94a3b8" }}>Detecting patterns...</p>
      </div>
    );
  }

  const patterns = data?.patterns ?? [];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #e2e8f0",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
        Detected Patterns
      </h3>
      {patterns.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px 0" }}>
          No patterns detected yet. Log more reflections to uncover patterns.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {patterns.map((pattern) => {
            const moodCorr = correlationLabel(pattern.correlationWithMood);
            return (
              <div
                key={pattern.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: 18 }}>
                  {pattern.type === "trigger"
                    ? "⚡"
                    : pattern.type === "emotion"
                    ? "💭"
                    : "🕐"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                    >
                      {pattern.pattern}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        background: "#e0e7ff",
                        color: "#4338ca",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {pattern.type}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {pattern.frequency}× · Mood:{" "}
                    <span style={{ color: moodCorr.color, fontWeight: 500 }}>
                      {moodCorr.label}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
