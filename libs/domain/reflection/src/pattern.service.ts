import { PrismaClient } from "@prisma/client";
import { Pattern } from "@repo/shared-types";

type PatternType = "trigger" | "emotion" | "time";

export class PatternService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Detect patterns from user's reflection entries
   * Logic:
   * 1. Aggregate triggers/emotions/time patterns
   * 2. Calculate correlation with mood and urge
   * 3. Upsert pattern records
   */
  async detectPatterns(userId: string): Promise<Pattern[]> {
    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    if (entries.length === 0) return [];

    const triggerCounts: Record<string, { count: number; moods: number[]; urges: number[] }> = {};
    const emotionCounts: Record<string, { count: number; moods: number[]; urges: number[] }> = {};
    const dayMoods: Record<number, number[]> = {};
    const dayUrges: Record<number, number[]> = {};

    for (const entry of entries) {
      for (const trigger of entry.triggers) {
        if (!triggerCounts[trigger]) triggerCounts[trigger] = { count: 0, moods: [], urges: [] };
        triggerCounts[trigger].count++;
        triggerCounts[trigger].moods.push(entry.mood);
        triggerCounts[trigger].urges.push(entry.urge);
      }
      for (const emotion of entry.emotions) {
        if (!emotionCounts[emotion]) emotionCounts[emotion] = { count: 0, moods: [], urges: [] };
        emotionCounts[emotion].count++;
        emotionCounts[emotion].moods.push(entry.mood);
        emotionCounts[emotion].urges.push(entry.urge);
      }
      if (!dayMoods[entry.dayOfWeek]) {
        dayMoods[entry.dayOfWeek] = [];
        dayUrges[entry.dayOfWeek] = [];
      }
      dayMoods[entry.dayOfWeek].push(entry.mood);
      dayUrges[entry.dayOfWeek].push(entry.urge);
    }

    const overallAvgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
    const overallAvgUrge = entries.reduce((s, e) => s + e.urge, 0) / entries.length;

    const patternsToUpsert: Array<{
      type: PatternType;
      pattern: string;
      frequency: number;
      correlationWithMood: number;
      correlationWithUrge: number;
    }> = [];

    // Trigger patterns (frequency >= 2)
    for (const [trigger, data] of Object.entries(triggerCounts)) {
      if (data.count < 2) continue;
      const avgMood = data.moods.reduce((s, v) => s + v, 0) / data.moods.length;
      const avgUrge = data.urges.reduce((s, v) => s + v, 0) / data.urges.length;
      patternsToUpsert.push({
        type: "trigger",
        pattern: trigger,
        frequency: data.count,
        correlationWithMood: normalize(avgMood - overallAvgMood),
        correlationWithUrge: normalize(avgUrge - overallAvgUrge),
      });
    }

    // Emotion patterns (frequency >= 2)
    for (const [emotion, data] of Object.entries(emotionCounts)) {
      if (data.count < 2) continue;
      const avgMood = data.moods.reduce((s, v) => s + v, 0) / data.moods.length;
      const avgUrge = data.urges.reduce((s, v) => s + v, 0) / data.urges.length;
      patternsToUpsert.push({
        type: "emotion",
        pattern: emotion,
        frequency: data.count,
        correlationWithMood: normalize(avgMood - overallAvgMood),
        correlationWithUrge: normalize(avgUrge - overallAvgUrge),
      });
    }

    // Time (day of week) patterns
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (const [day, moods] of Object.entries(dayMoods)) {
      if (moods.length < 2) continue;
      const dayIndex = Number(day);
      // dayOfWeek values come from Date.getDay() which is always 0-6
      if (dayIndex < 0 || dayIndex > 6) continue;
      const dayName = dayNames[dayIndex];
      if (!dayName) continue;
      const avgMood = moods.reduce((s, v) => s + v, 0) / moods.length;
      const urges = dayUrges[dayIndex] ?? [];
      const avgUrge = urges.length > 0 ? urges.reduce((s, v) => s + v, 0) / urges.length : 0;
      patternsToUpsert.push({
        type: "time",
        pattern: dayName,
        frequency: moods.length,
        correlationWithMood: normalize(avgMood - overallAvgMood),
        correlationWithUrge: normalize(avgUrge - overallAvgUrge),
      });
    }

    const now = new Date();
    const upserted: Pattern[] = [];

    for (const p of patternsToUpsert) {
      const existing = await this.prisma.pattern.findFirst({
        where: { userId, type: p.type, pattern: p.pattern },
      });

      const record = existing
        ? await this.prisma.pattern.update({
            where: { id: existing.id },
            data: { ...p, lastOccurrence: now },
          })
        : await this.prisma.pattern.create({
            data: { userId, ...p, lastOccurrence: now },
          });

      upserted.push({
        id: record.id,
        userId: record.userId,
        type: record.type as PatternType,
        pattern: record.pattern,
        frequency: record.frequency,
        correlationWithMood: record.correlationWithMood,
        correlationWithUrge: record.correlationWithUrge,
        lastOccurrence: record.lastOccurrence,
        detectedAt: record.detectedAt,
      });
    }

    return upserted;
  }

  async getPatterns(userId: string): Promise<Pattern[]> {
    const records = await this.prisma.pattern.findMany({
      where: { userId },
      orderBy: { frequency: "desc" },
    });
    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type as PatternType,
      pattern: r.pattern,
      frequency: r.frequency,
      correlationWithMood: r.correlationWithMood,
      correlationWithUrge: r.correlationWithUrge,
      lastOccurrence: r.lastOccurrence,
      detectedAt: r.detectedAt,
    }));
  }
}

/** Clamp a value to [-1, 1] */
function normalize(value: number): number {
  return Math.max(-1, Math.min(1, value / 5));
}
