import { PrismaClient } from "@prisma/client";
import { DailyStats, WeeklyStats, MonthlyStats } from "@repo/shared-types";

export class AnalyticsService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Calculate daily statistics
   * Logic:
   * 1. Get all entries for the day
   * 2. Calculate: count, avg, min, max
   * 3. Detect trend compared to yesterday
   * 4. Cache result
   */
  async getDailyStats(userId: string, date: string): Promise<DailyStats> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId, createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: "asc" },
    });

    if (entries.length === 0) {
      return {
        date,
        userId,
        entryCount: 0,
        avgMood: 0,
        avgUrge: 0,
        maxMood: 0,
        minMood: 0,
        moodTrend: "stable",
      };
    }

    const moodValues = entries.map((e) => e.mood);
    const avgMood =
      moodValues.reduce((sum, v) => sum + v, 0) / moodValues.length;
    const avgUrge =
      entries.reduce((sum, e) => sum + e.urge, 0) / entries.length;
    const maxMood = Math.max(...moodValues);
    const minMood = Math.min(...moodValues);

    // Compare to yesterday
    const yesterday = new Date(start);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const yesterdayEntries = await this.prisma.reflectionEntry.findMany({
      where: { userId, createdAt: { gte: yesterday, lte: yesterdayEnd } },
    });

    let moodTrend: "up" | "down" | "stable" = "stable";
    if (yesterdayEntries.length > 0) {
      const yesterdayAvg =
        yesterdayEntries.reduce((sum, e) => sum + e.mood, 0) /
        yesterdayEntries.length;
      if (avgMood > yesterdayAvg + 0.5) moodTrend = "up";
      else if (avgMood < yesterdayAvg - 0.5) moodTrend = "down";
    }

    return {
      date,
      userId,
      entryCount: entries.length,
      avgMood: Math.round(avgMood * 10) / 10,
      avgUrge: Math.round(avgUrge * 10) / 10,
      maxMood,
      minMood,
      moodTrend,
    };
  }

  async getWeeklyStats(
    userId: string,
    weekNumber: number,
    year: number
  ): Promise<WeeklyStats> {
    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId, weekNumber },
      orderBy: { createdAt: "asc" },
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (entries.length === 0) {
      return {
        weekNumber,
        userId,
        avgMood: 0,
        avgUrge: 0,
        totalEntries: 0,
        bestDay: "",
        worstDay: "",
        moodPattern: Array(7).fill(0),
        urgePattern: Array(7).fill(0),
      };
    }

    const avgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
    const avgUrge = entries.reduce((s, e) => s + e.urge, 0) / entries.length;

    // Build daily mood/urge patterns
    const moodByDay: number[][] = Array(7)
      .fill(null)
      .map(() => []);
    const urgeByDay: number[][] = Array(7)
      .fill(null)
      .map(() => []);

    for (const e of entries) {
      moodByDay[e.dayOfWeek].push(e.mood);
      urgeByDay[e.dayOfWeek].push(e.urge);
    }

    const moodPattern = moodByDay.map((d) =>
      d.length > 0
        ? Math.round((d.reduce((s, v) => s + v, 0) / d.length) * 10) / 10
        : 0
    );
    const urgePattern = urgeByDay.map((d) =>
      d.length > 0
        ? Math.round((d.reduce((s, v) => s + v, 0) / d.length) * 10) / 10
        : 0
    );

    const bestDayIdx = moodPattern.indexOf(Math.max(...moodPattern));
    const nonZeroMoods = moodPattern.filter((v) => v > 0);
    const worstDayIdx =
      nonZeroMoods.length > 0
        ? moodPattern.indexOf(Math.min(...nonZeroMoods))
        : -1;

    return {
      weekNumber,
      userId,
      avgMood: Math.round(avgMood * 10) / 10,
      avgUrge: Math.round(avgUrge * 10) / 10,
      totalEntries: entries.length,
      bestDay: dayNames[bestDayIdx] ?? "",
      worstDay: dayNames[worstDayIdx] ?? "",
      moodPattern,
      urgePattern,
    };
  }

  async getMonthlyStats(
    userId: string,
    monthNumber: number,
    year: number
  ): Promise<MonthlyStats> {
    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId, monthNumber },
      orderBy: { createdAt: "asc" },
    });

    if (entries.length === 0) {
      return {
        monthNumber,
        year,
        userId,
        avgMood: 0,
        avgUrge: 0,
        totalEntries: 0,
        moodProgression: [],
        strongestUrgeDay: "",
        bestMoodDay: "",
      };
    }

    const avgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
    const avgUrge = entries.reduce((s, e) => s + e.urge, 0) / entries.length;
    const moodProgression = entries.map((e) => e.mood);

    const maxUrgeEntry = entries.reduce((max, e) => (e.urge > max.urge ? e : max), entries[0]);
    const maxMoodEntry = entries.reduce((max, e) => (e.mood > max.mood ? e : max), entries[0]);

    return {
      monthNumber,
      year,
      userId,
      avgMood: Math.round(avgMood * 10) / 10,
      avgUrge: Math.round(avgUrge * 10) / 10,
      totalEntries: entries.length,
      moodProgression,
      strongestUrgeDay: maxUrgeEntry.createdAt.toISOString().split("T")[0],
      bestMoodDay: maxMoodEntry.createdAt.toISOString().split("T")[0],
    };
  }
}
