import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@dailyreflection.app" },
    update: {},
    create: {
      email: "demo@dailyreflection.app",
      name: "Demo User",
      preferences: {
        notificationTime: "09:00",
        theme: "light",
        moodScale: 10,
        urgeScale: 10,
      },
    },
  });

  console.log(`✅ Created user: ${user.name} (${user.email})`);

  // Create sample reflection entries
  const sampleEntries = [
    { mood: 7, urge: 3, context: "Had a good morning run", triggers: ["exercise"], emotions: ["energized", "calm"] },
    { mood: 5, urge: 6, context: "Stressful meeting at work", triggers: ["work stress"], emotions: ["anxious", "overwhelmed"] },
    { mood: 8, urge: 2, context: "Spent time with family", triggers: ["social connection"], emotions: ["happy", "grateful"] },
    { mood: 4, urge: 7, context: "Poor sleep last night", triggers: ["fatigue"], emotions: ["irritable", "tired"] },
    { mood: 6, urge: 4, context: "Practiced meditation", triggers: ["mindfulness"], emotions: ["peaceful", "focused"] },
  ];

  for (const entry of sampleEntries) {
    const now = new Date();
    await prisma.reflectionEntry.create({
      data: {
        userId: user.id,
        ...entry,
        dayOfWeek: now.getDay(),
        weekNumber: getISOWeek(now),
        monthNumber: now.getMonth() + 1,
      },
    });
  }

  console.log(`✅ Created ${sampleEntries.length} sample reflection entries`);
  console.log("✅ Database seeded successfully");
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
