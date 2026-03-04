import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ReflectionEntry } from "@repo/shared-types";

const client = new GraphQLClient(
  (typeof window !== "undefined" ? window.location.origin : "") + "/graphql"
);

const REFLECTIONS_QUERY = `
  query GetReflections($userId: ID!, $limit: Int) {
    reflections(userId: $userId, limit: $limit) {
      id mood urge createdAt context emotions
    }
  }
`;

interface MoodHistoryProps {
  userId: string;
}

export function MoodHistory({ userId }: MoodHistoryProps) {
  const { data, isLoading } = useQuery<{ reflections: ReflectionEntry[] }>({
    queryKey: ["observe-reflections", userId],
    queryFn: () => client.request(REFLECTIONS_QUERY, { userId, limit: 20 }),
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
        <p style={{ color: "#94a3b8" }}>Loading mood history...</p>
      </div>
    );
  }

  const entries = [...(data?.reflections ?? [])].reverse();
  const chartData = entries.map((e, i) => ({
    index: i + 1,
    mood: e.mood,
    urge: e.urge,
    date: new Date(e.createdAt).toLocaleDateString(),
  }));

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
        Mood &amp; Urge History
      </h3>
      {chartData.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px 0" }}>
          No reflections logged yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number, name: string) => [value, name === "mood" ? "Mood" : "Urge"]}
            />
            <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="mood" />
            <Line type="monotone" dataKey="urge" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="urge" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
