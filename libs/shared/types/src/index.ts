export interface UserPreferences {
  notificationTime: string; // "09:00"
  theme: "light" | "dark";
  moodScale: number; // 0-10
  urgeScale: number; // 0-10
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReflectionEntry {
  id: string;
  userId: string;
  mood: number; // 0-10
  urge: number; // 0-10
  context?: string;
  triggers?: string[];
  emotions?: string[];
  createdAt: Date;
  updatedAt: Date;
  dayOfWeek: number; // 0-6 (Monday-Sunday)
  weekNumber: number;
  monthNumber: number;
}

export interface DailyStats {
  date: string;
  userId: string;
  entryCount: number;
  avgMood: number;
  avgUrge: number;
  maxMood: number;
  minMood: number;
  moodTrend: "up" | "down" | "stable";
}

export interface WeeklyStats {
  weekNumber: number;
  userId: string;
  avgMood: number;
  avgUrge: number;
  totalEntries: number;
  bestDay: string;
  worstDay: string;
  moodPattern: number[];
  urgePattern: number[];
}

export interface MonthlyStats {
  monthNumber: number;
  year: number;
  userId: string;
  avgMood: number;
  avgUrge: number;
  totalEntries: number;
  moodProgression: number[];
  strongestUrgeDay: string;
  bestMoodDay: string;
}

export interface Pattern {
  id: string;
  userId: string;
  type: "trigger" | "emotion" | "time";
  pattern: string;
  frequency: number;
  correlationWithMood: number; // -1 to 1
  correlationWithUrge: number; // -1 to 1
  lastOccurrence: Date;
  detectedAt: Date;
}

export interface Insight {
  id: string;
  userId: string;
  type: "pattern" | "trend" | "suggestion" | "milestone";
  title: string;
  description: string;
  dataPoints: any[];
  actionable: boolean;
  generatedAt: Date;
}

export interface AnalyticsEvent {
  userId: string;
  eventType: "entry_logged" | "pattern_detected" | "insight_viewed";
  metadata: Record<string, any>;
  timestamp: Date;
}
