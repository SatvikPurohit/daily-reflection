"use client";

import { useDailyStats, useWeeklyStats } from "@/hooks/useAnalytics";

const moodEmoji = (mood: number) => {
  if (mood >= 8) return "😊";
  if (mood >= 6) return "🙂";
  if (mood >= 4) return "😐";
  if (mood >= 2) return "😔";
  return "😢";
};

const trendIcon = (trend: string) => {
  if (trend === "up") return "📈";
  if (trend === "down") return "📉";
  return "➡️";
};

export function DashboardSummary() {
  const { data: dailyData, isLoading: dailyLoading } = useDailyStats();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyStats();

  if (dailyLoading || weeklyLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-2" />
            <div className="h-8 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const daily = dailyData?.dailyStats;
  const weekly = weeklyData?.weeklyStats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="card text-center">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
          Today&apos;s Mood
        </p>
        <p className="text-3xl font-bold text-slate-800">
          {daily?.entryCount ? moodEmoji(daily.avgMood) : "—"}
        </p>
        <p className="text-lg font-semibold text-indigo-600">
          {daily?.entryCount ? daily.avgMood.toFixed(1) : "No entries"}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
          Mood Trend
        </p>
        <p className="text-3xl font-bold">
          {daily?.moodTrend ? trendIcon(daily.moodTrend) : "—"}
        </p>
        <p className="text-sm font-medium capitalize text-slate-600">
          {daily?.moodTrend ?? "Unknown"}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
          Today&apos;s Entries
        </p>
        <p className="text-3xl font-bold text-slate-800">
          {daily?.entryCount ?? 0}
        </p>
        <p className="text-sm text-slate-500">reflections</p>
      </div>

      <div className="card text-center">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
          Weekly Avg Mood
        </p>
        <p className="text-3xl font-bold text-slate-800">
          {weekly?.avgMood ? weekly.avgMood.toFixed(1) : "—"}
        </p>
        <p className="text-sm text-slate-500">this week</p>
      </div>
    </div>
  );
}
