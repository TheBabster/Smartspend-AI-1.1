import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("GBP"),
  monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }),
  jobTitle: text("job_title"),
  annualSalary: decimal("annual_salary", { precision: 10, scale: 2 }),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  financialProfile: json("financial_profile"), // Store onboarding questionnaire data
  smartCoins: integer("smart_coins").default(25), // Starting coins for new users
  dailyStreak: integer("daily_streak").default(0),
  lastActiveDate: text("last_active_date"), // Store as YYYY-MM-DD string
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // Food, Entertainment, Shopping, etc.
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0"),
  month: text("month").notNull(), // YYYY-MM format
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  emotionalTag: text("emotional_tag"), // stress, boredom, peer pressure, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  targetDate: timestamp("target_date"),
  icon: text("icon").default("🎯"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decisions = pgTable("decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemName: text("item_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  desireLevel: integer("desire_level").notNull(), // 1-10
  urgency: integer("urgency").notNull(), // 1-10
  emotion: text("emotion"), // emoji or text describing emotion
  notes: text("notes"), // optional user notes
  recommendation: text("recommendation").notNull(), // yes, think_again, no
  reasoning: text("reasoning").notNull(),
  followed: boolean("followed"),
  regretLevel: integer("regret_level"), // 1-10, filled after purchase
  createdAt: timestamp("created_at").defaultNow(),
});

export const streaks = pgTable("streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // budget, savings, decision
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // budget_master, saving_streak, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true, createdAt: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true });
export const insertDecisionSchema = createInsertSchema(decisions).omit({ id: true, createdAt: true });
export const insertStreakSchema = createInsertSchema(streaks).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, unlockedAt: true });

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: text("mood").notNull(),
  notes: text("notes"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMoodSchema = createInsertSchema(moodEntries).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Decision = typeof decisions.$inferSelect;
export type InsertDecision = z.infer<typeof insertDecisionSchema>;
export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodSchema>;
