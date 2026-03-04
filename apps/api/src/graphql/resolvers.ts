import { PrismaClient } from "@prisma/client";
import { ReflectionService } from "@repo/domain-reflection";
import { AnalyticsService } from "@repo/domain-reflection";
import { PatternService } from "@repo/domain-reflection";
import { InsightService } from "@repo/domain-reflection";

export function createResolvers(prisma: PrismaClient) {
  const reflectionService = new ReflectionService(prisma);
  const analyticsService = new AnalyticsService(prisma);
  const patternService = new PatternService(prisma);
  const insightService = new InsightService(prisma);

  return {
    Query: {
      reflections: (
        _: unknown,
        args: { userId: string; limit?: number; offset?: number }
      ) => reflectionService.getEntries(args.userId, { limit: args.limit, offset: args.offset }),

      reflection: (_: unknown, args: { id: string }) =>
        reflectionService.getEntry(args.id),

      dailyStats: (
        _: unknown,
        args: { userId: string; date: string }
      ) => analyticsService.getDailyStats(args.userId, args.date),

      weeklyStats: (
        _: unknown,
        args: { userId: string; weekNumber: number; year: number }
      ) => analyticsService.getWeeklyStats(args.userId, args.weekNumber, args.year),

      monthlyStats: (
        _: unknown,
        args: { userId: string; monthNumber: number; year: number }
      ) => analyticsService.getMonthlyStats(args.userId, args.monthNumber, args.year),

      patterns: (_: unknown, args: { userId: string }) =>
        patternService.getPatterns(args.userId),

      insights: (_: unknown, args: { userId: string }) =>
        insightService.getInsights(args.userId),
    },

    Mutation: {
      createReflection: (
        _: unknown,
        args: {
          input: {
            userId: string;
            mood: number;
            urge: number;
            context?: string;
            triggers?: string[];
            emotions?: string[];
          };
        }
      ) => {
        const { userId, ...data } = args.input;
        return reflectionService.createEntry(userId, data);
      },

      updateReflection: (
        _: unknown,
        args: {
          id: string;
          input: {
            mood?: number;
            urge?: number;
            context?: string;
            triggers?: string[];
            emotions?: string[];
          };
        }
      ) => reflectionService.updateEntry(args.id, args.input),

      deleteReflection: (_: unknown, args: { id: string }) =>
        reflectionService.deleteEntry(args.id),

      generateInsights: (_: unknown, args: { userId: string }) =>
        insightService.generateInsights(args.userId),

      detectPatterns: (_: unknown, args: { userId: string }) =>
        patternService.detectPatterns(args.userId),
    },
  };
}
