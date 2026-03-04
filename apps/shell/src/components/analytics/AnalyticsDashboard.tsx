"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useWeeklyStats, useMonthlyStats, useDailyStats } from "@/hooks/useAnalytics";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AnalyticsDashboard() {
  const { data: dailyData, isLoading: dailyLoading } = useDailyStats();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyStats();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyStats();

  const isLoading = dailyLoading || weeklyLoading || monthlyLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse h-48" />
        ))}
      </div>
    );
  }

  const weekly = weeklyData?.weeklyStats;
  const monthly = monthlyData?.monthlyStats;
  const daily = dailyData?.dailyStats;

  const weeklyChartData = DAY_LABELS.map((day, i) => ({
    day,
    mood: weekly?.moodPattern?.[i] ?? 0,
    urge: weekly?.urgePattern?.[i] ?? 0,
  }));

  const monthlyChartData = (monthly?.moodProgression ?? []).map(
    (mood, i) => ({
      day: i + 1,
      mood,
    })
  );

  return (
    <div className="space-y-6">
      {/* Today's stats */}
      {daily && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Today&apos;s Overview
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {daily.entryCount ? daily.avgMood.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-slate-500">Avg Mood</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-500">
                {daily.entryCount ? daily.avgUrge.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-slate-500">Avg Urge</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">
                {daily.entryCount}
              </p>
              <p className="text-xs text-slate-500">Entries</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly mood & urge pattern */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          This Week&apos;s Pattern
        </h2>
        {weekly && (
          <p className="text-sm text-slate-500 mb-4">
            Best day: <span className="font-medium text-emerald-600">{weekly.bestDay || "N/A"}</span>
            {" · "}
            {weekly.totalEntries} total entries
          </p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="mood" fill="#6366f1" radius={[4, 4, 0, 0]} name="Mood" />
            <Bar dataKey="urge" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Urge" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly mood progression */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Monthly Mood Progression
        </h2>
        {monthly && (
          <p className="text-sm text-slate-500 mb-4">
            Avg mood: <span className="font-medium text-indigo-600">{monthly.avgMood.toFixed(1)}</span>
            {" · "}
            Best day: <span className="font-medium text-emerald-600">{monthly.bestMoodDay || "N/A"}</span>
          </p>
        )}
        {monthlyChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p>No data for this month yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
