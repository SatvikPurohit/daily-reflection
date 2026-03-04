export const typeDefs = `#graphql
  type UserPreferences {
    notificationTime: String!
    theme: String!
    moodScale: Int!
    urgeScale: Int!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    avatar: String
    preferences: UserPreferences!
    createdAt: String!
    updatedAt: String!
  }

  type ReflectionEntry {
    id: ID!
    userId: String!
    mood: Int!
    urge: Int!
    context: String
    triggers: [String!]!
    emotions: [String!]!
    dayOfWeek: Int!
    weekNumber: Int!
    monthNumber: Int!
    createdAt: String!
    updatedAt: String!
  }

  type DailyStats {
    date: String!
    userId: String!
    entryCount: Int!
    avgMood: Float!
    avgUrge: Float!
    maxMood: Int!
    minMood: Int!
    moodTrend: String!
  }

  type WeeklyStats {
    weekNumber: Int!
    userId: String!
    avgMood: Float!
    avgUrge: Float!
    totalEntries: Int!
    bestDay: String!
    worstDay: String!
    moodPattern: [Float!]!
    urgePattern: [Float!]!
  }

  type MonthlyStats {
    monthNumber: Int!
    year: Int!
    userId: String!
    avgMood: Float!
    avgUrge: Float!
    totalEntries: Int!
    moodProgression: [Int!]!
    strongestUrgeDay: String!
    bestMoodDay: String!
  }

  type Pattern {
    id: ID!
    userId: String!
    type: String!
    pattern: String!
    frequency: Int!
    correlationWithMood: Float!
    correlationWithUrge: Float!
    lastOccurrence: String!
    detectedAt: String!
  }

  type Insight {
    id: ID!
    userId: String!
    type: String!
    title: String!
    description: String!
    actionable: Boolean!
    generatedAt: String!
  }

  type Query {
    reflections(userId: ID!, limit: Int, offset: Int): [ReflectionEntry!]!
    reflection(id: ID!): ReflectionEntry
    dailyStats(userId: ID!, date: String!): DailyStats!
    weeklyStats(userId: ID!, weekNumber: Int!, year: Int!): WeeklyStats!
    monthlyStats(userId: ID!, monthNumber: Int!, year: Int!): MonthlyStats!
    patterns(userId: ID!): [Pattern!]!
    insights(userId: ID!): [Insight!]!
  }

  input CreateReflectionInput {
    userId: ID!
    mood: Int!
    urge: Int!
    context: String
    triggers: [String!]
    emotions: [String!]
  }

  input UpdateReflectionInput {
    mood: Int
    urge: Int
    context: String
    triggers: [String!]
    emotions: [String!]
  }

  type Mutation {
    createReflection(input: CreateReflectionInput!): ReflectionEntry!
    updateReflection(id: ID!, input: UpdateReflectionInput!): ReflectionEntry!
    deleteReflection(id: ID!): Boolean!
    generateInsights(userId: ID!): [Insight!]!
    detectPatterns(userId: ID!): [Pattern!]!
  }
`;
