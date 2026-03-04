import { PrismaClient } from "@prisma/client";
import { ReflectionEntry } from "@repo/shared-types";
import { getISOWeek } from "./utils/date.utils";

export class ReflectionService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create new reflection entry
   * Logic:
   * 1. Validate mood and urge values (0-10)
   * 2. Parse context for keywords (triggers, emotions)
   * 3. Calculate day/week/month metadata
   * 4. Save to database
   * 5. Trigger pattern detection
   */
  async createEntry(
    userId: string,
    data: {
      mood: number;
      urge: number;
      context?: string;
      triggers?: string[];
      emotions?: string[];
    }
  ): Promise<ReflectionEntry> {
    if (data.mood < 0 || data.mood > 10) {
      throw new Error("Mood must be between 0 and 10");
    }
    if (data.urge < 0 || data.urge > 10) {
      throw new Error("Urge must be between 0 and 10");
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekNumber = getISOWeek(now);
    const monthNumber = now.getMonth() + 1;

    const entry = await this.prisma.reflectionEntry.create({
      data: {
        userId,
        mood: data.mood,
        urge: data.urge,
        context: data.context,
        triggers: data.triggers ?? [],
        emotions: data.emotions ?? [],
        dayOfWeek,
        weekNumber,
        monthNumber,
      },
    });

    return this.mapEntry(entry);
  }

  async getEntries(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<ReflectionEntry[]> {
    const entries = await this.prisma.reflectionEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
    return entries.map((e) => this.mapEntry(e));
  }

  async getEntry(id: string): Promise<ReflectionEntry | null> {
    const entry = await this.prisma.reflectionEntry.findUnique({
      where: { id },
    });
    return entry ? this.mapEntry(entry) : null;
  }

  async updateEntry(
    id: string,
    data: Partial<{
      mood: number;
      urge: number;
      context: string;
      triggers: string[];
      emotions: string[];
    }>
  ): Promise<ReflectionEntry> {
    if (data.mood !== undefined && (data.mood < 0 || data.mood > 10)) {
      throw new Error("Mood must be between 0 and 10");
    }
    if (data.urge !== undefined && (data.urge < 0 || data.urge > 10)) {
      throw new Error("Urge must be between 0 and 10");
    }

    const entry = await this.prisma.reflectionEntry.update({
      where: { id },
      data,
    });
    return this.mapEntry(entry);
  }

  async deleteEntry(id: string): Promise<boolean> {
    await this.prisma.reflectionEntry.delete({ where: { id } });
    return true;
  }

  private mapEntry(entry: {
    id: string;
    userId: string;
    mood: number;
    urge: number;
    context: string | null;
    triggers: string[];
    emotions: string[];
    dayOfWeek: number;
    weekNumber: number;
    monthNumber: number;
    createdAt: Date;
    updatedAt: Date;
  }): ReflectionEntry {
    return {
      id: entry.id,
      userId: entry.userId,
      mood: entry.mood,
      urge: entry.urge,
      context: entry.context ?? undefined,
      triggers: entry.triggers,
      emotions: entry.emotions,
      dayOfWeek: entry.dayOfWeek,
      weekNumber: entry.weekNumber,
      monthNumber: entry.monthNumber,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
