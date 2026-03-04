import { PrismaClient } from "@prisma/client";
import { AnalyticsEvent } from "@repo/shared-types";

export class AnalyticsTrackingService {
  constructor(private readonly prisma: PrismaClient) {}

  async trackEvent(
    userId: string,
    eventType: AnalyticsEvent["eventType"],
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    await this.prisma.analyticsEvent.create({
      data: {
        userId,
        eventType,
        metadata,
        timestamp: new Date(),
      },
    });
  }

  async getEvents(
    userId: string,
    eventType?: AnalyticsEvent["eventType"]
  ): Promise<AnalyticsEvent[]> {
    const records = await this.prisma.analyticsEvent.findMany({
      where: { userId, ...(eventType ? { eventType } : {}) },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return records.map((r) => ({
      userId: r.userId,
      eventType: r.eventType as AnalyticsEvent["eventType"],
      metadata: r.metadata as Record<string, unknown>,
      timestamp: r.timestamp,
    }));
  }
}
