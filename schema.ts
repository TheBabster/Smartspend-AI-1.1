import { pgTable, uuid, text, numeric, boolean } from "drizzle-orm/pg-core";

// --- Users Table ---
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(), // Required for demo data
  name: text("name"),
  currency: text("currency"),
  monthlyIncome: numeric("monthly_income"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
});

// --- Expenses Table ---
export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(), // e.g. 'Food', 'Tech'
  date: text("date").notNull(), // ISO string
  description: text("description"),
  emotionalTag: text("emotional_tag"),
});

// --- Budgets Table ---
export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // e.g. 'Food', 'Entertainment'
  monthlyLimit: numeric("monthly_limit").notNull(),
  spent: numeric("spent").default("0"),
  month: text("month").notNull(), // e.g. '2025-07'
});

// --- Decisions Table ---
export const decisions = pgTable("decisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  itemName: text("item_name").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category"),
  desireLevel: numeric("desire_level").notNull(),
  urgency: numeric("urgency"),
  emotion: text("emotion"),
  notes: text("notes"),
  recommendation: text("recommendation").notNull(), // 'yes' | 'think_again' | 'no'
  reasoning: text("reasoning"),
  followed: boolean("followed").default(false),
  regretLevel: numeric("regret_level"),
});

// --- Goals Table ---
export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  targetAmount: numeric("target_amount").notNull(),
  currentAmount: numeric("current_amount").default("0"),
  targetDate: text("target_date"),
  icon: text("icon"),
  completed: boolean("completed").default(false),
});

// --- Streaks Table ---
export const streaks = pgTable("streaks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // e.g. 'budget' or 'savings'
  currentStreak: numeric("current_streak").default("0"),
  longestStreak: numeric("longest_streak").default("0"),
});

// --- Achievements Table ---
export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // e.g. 'budget', 'decision'
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  unlockedAt: text("unlocked_at"),
});