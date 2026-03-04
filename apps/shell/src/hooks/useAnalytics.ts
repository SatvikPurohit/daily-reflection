"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "@/lib/graphql-client";
import { DEMO_USER_ID } from "@/lib/constants";
import type { DailyStats, WeeklyStats, MonthlyStats } from "@repo/shared-types";

const DAILY_STATS_QUERY = `
  query GetDailyStats($userId: ID!, $date: String!) {
    dailyStats(userId: $userId, date: $date) {
      date userId entryCount avgMood avgUrge maxMood minMood moodTrend
    }
  }
`;

const WEEKLY_STATS_QUERY = `
  query GetWeeklyStats($userId: ID!, $weekNumber: Int!, $year: Int!) {
    weeklyStats(userId: $userId, weekNumber: $weekNumber, year: $year) {
      weekNumber userId avgMood avgUrge totalEntries
      bestDay worstDay moodPattern urgePattern
    }
  }
`;

const MONTHLY_STATS_QUERY = `
  query GetMonthlyStats($userId: ID!, $monthNumber: Int!, $year: Int!) {
    monthlyStats(userId: $userId, monthNumber: $monthNumber, year: $year) {
      monthNumber year userId avgMood avgUrge totalEntries
      moodProgression strongestUrgeDay bestMoodDay
    }
  }
`;

export function useDailyStats(date?: string) {
  const today = date ?? new Date().toISOString().split("T")[0];
  return useQuery<{ dailyStats: DailyStats }>({
    queryKey: ["dailyStats", DEMO_USER_ID, today],
    queryFn: () =>
      gqlClient.request(DAILY_STATS_QUERY, {
        userId: DEMO_USER_ID,
        date: today,
      }),
  });
}

export function useWeeklyStats() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = now.getFullYear();

  return useQuery<{ weeklyStats: WeeklyStats }>({
    queryKey: ["weeklyStats", DEMO_USER_ID, weekNumber, year],
    queryFn: () =>
      gqlClient.request(WEEKLY_STATS_QUERY, {
        userId: DEMO_USER_ID,
        weekNumber,
        year,
      }),
  });
}

export function useMonthlyStats() {
  const now = new Date();
  const monthNumber = now.getMonth() + 1;
  const year = now.getFullYear();

  return useQuery<{ monthlyStats: MonthlyStats }>({
    queryKey: ["monthlyStats", DEMO_USER_ID, monthNumber, year],
    queryFn: () =>
      gqlClient.request(MONTHLY_STATS_QUERY, {
        userId: DEMO_USER_ID,
        monthNumber,
        year,
      }),
  });
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
