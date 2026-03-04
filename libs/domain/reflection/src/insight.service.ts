import { PrismaClient } from "@prisma/client";
import { Insight } from "@repo/shared-types";

type InsightType = "pattern" | "trend" | "suggestion" | "milestone";

export class InsightService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Generate actionable insights from user data
   * Algorithm:
   * 1. Trend analysis - identify mood trends
   * 2. Pattern correlation - link patterns to mood changes
   * 3. Milestone detection - celebrate progress
   * 4. Recommendation generation - suggest actions
   */
  async generateInsights(userId: string): Promise<Insight[]> {
    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    if (entries.length === 0) return [];

    const insights: Array<{
      type: InsightType;
      title: string;
      description: string;
      dataPoints: unknown[];
      actionable: boolean;
    }> = [];

    // Milestone: first entry
    if (entries.length === 1) {
      insights.push({
        type: "milestone",
        title: "First Reflection! 🎉",
        description: "You've logged your first reflection. Consistency is key to understanding your mental health patterns.",
        dataPoints: [],
        actionable: false,
      });
    }

    // Milestone: 7-day streak
    if (entries.length >= 7) {
      insights.push({
        type: "milestone",
        title: "7 Reflections Logged",
        description: "You've logged 7 reflections! You're building a valuable dataset to understand your patterns.",
        dataPoints: [{ count: entries.length }],
        actionable: false,
      });
    }

    // Trend: mood improving
    if (entries.length >= 5) {
      const recentMoods = entries.slice(0, 5).map((e) => e.mood);
      const olderMoods = entries.slice(5, 10).map((e) => e.mood);

      if (olderMoods.length > 0) {
        const recentAvg = recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length;
        const olderAvg = olderMoods.reduce((s, v) => s + v, 0) / olderMoods.length;

        if (recentAvg > olderAvg + 1) {
          insights.push({
            type: "trend",
            title: "Mood Improving 📈",
            description: `Your average mood has improved by ${(recentAvg - olderAvg).toFixed(1)} points over the last 5 entries. Keep it up!`,
            dataPoints: recentMoods,
            actionable: false,
          });
        } else if (recentAvg < olderAvg - 1) {
          insights.push({
            type: "trend",
            title: "Mood Declining 📉",
            description: "Your mood has been trending downward. Consider reviewing your recent triggers and reaching out for support.",
            dataPoints: recentMoods,
            actionable: true,
          });
        }
      }
    }

    // Pattern: high urge days
    const patterns = await this.prisma.pattern.findMany({
      where: { userId, type: "time" },
      orderBy: { correlationWithUrge: "desc" },
      take: 1,
    });

    if (patterns.length > 0 && patterns[0].correlationWithUrge > 0.3) {
      insights.push({
        type: "pattern",
        title: `High Urge on ${patterns[0].pattern}s`,
        description: `You tend to experience higher urges on ${patterns[0].pattern}s. Plan ahead with coping strategies for this day.`,
        dataPoints: [patterns[0]],
        actionable: true,
      });
    }

    // Suggestion: if high urge detected
    const highUrgeEntries = entries.filter((e) => e.urge >= 7);
    if (highUrgeEntries.length >= 3) {
      insights.push({
        type: "suggestion",
        title: "Practice Urge Surfing",
        description: "You've been experiencing high urges frequently. Try the urge surfing technique: observe the urge without acting on it, and notice it naturally subside.",
        dataPoints: highUrgeEntries.map((e) => ({ urge: e.urge, date: e.createdAt })),
        actionable: true,
      });
    }

    // Save generated insights
    const saved: Insight[] = [];
    for (const insight of insights) {
      const record = await this.prisma.insight.create({
        data: {
          userId,
          ...insight,
          dataPoints: insight.dataPoints as object,
        },
      });
      saved.push({
        id: record.id,
        userId: record.userId,
        type: record.type as InsightType,
        title: record.title,
        description: record.description,
        dataPoints: record.dataPoints as unknown[],
        actionable: record.actionable,
        generatedAt: record.generatedAt,
      });
    }

    return saved;
  }

  async getInsights(userId: string): Promise<Insight[]> {
    const records = await this.prisma.insight.findMany({
      where: { userId },
      orderBy: { generatedAt: "desc" },
      take: 20,
    });
    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type as InsightType,
      title: r.title,
      description: r.description,
      dataPoints: r.dataPoints as unknown[],
      actionable: r.actionable,
      generatedAt: r.generatedAt,
    }));
  }
}
