import { users, budgets, expenses, goals, decisions, streaks, achievements, moodEntries, type User, type Budget, type Expense, type Goal, type Decision, type Streak, type Achievement, type MoodEntry, type InsertUser, type InsertBudget, type InsertExpense, type InsertGoal, type InsertDecision, type InsertStreak, type InsertAchievement, type InsertMoodEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Budgets
  getBudgetsByUser(userId: string): Promise<Budget[]>;
  getBudgetByCategory(userId: string, category: string, month: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<Budget>): Promise<Budget | undefined>;

  // Expenses
  getExpensesByUser(userId: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpensesByCategory(userId: string, category: string): Promise<Expense[]>;

  // Goals
  getGoalsByUser(userId: string): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<void>;

  // Decisions
  getDecisionsByUser(userId: string): Promise<Decision[]>;
  createDecision(decision: InsertDecision): Promise<Decision>;
  updateDecision(id: string, decision: Partial<Decision>): Promise<Decision | undefined>;

  // Streaks
  getStreaksByUser(userId: string): Promise<Streak[]>;
  getStreak(userId: string, type: string): Promise<Streak | undefined>;
  createOrUpdateStreak(streak: InsertStreak): Promise<Streak>;

  // Achievements
  getAchievementsByUser(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Mood tracking
  getMoodByDate(userId: string, date: string): Promise<MoodEntry | undefined>;
  createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntriesByUser(userId: string, limit?: number): Promise<MoodEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getBudgetsByUser(userId: string): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  }

  async getBudgetByCategory(userId: string, category: string, month: string): Promise<Budget | undefined> {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(and(
        eq(budgets.userId, userId),
        eq(budgets.category, category),
        eq(budgets.month, month)
      ));
    return budget || undefined;
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const [budget] = await db
      .insert(budgets)
      .values(insertBudget)
      .returning();
    return budget;
  }

  async updateBudget(id: string, budgetUpdate: Partial<Budget>): Promise<Budget | undefined> {
    const [budget] = await db
      .update(budgets)
      .set(budgetUpdate)
      .where(eq(budgets.id, id))
      .returning();
    return budget || undefined;
  }

  async getExpensesByUser(userId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.userId, userId));
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(insertExpense)
      .returning();
    return expense;
  }

  async getExpensesByCategory(userId: string, category: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(and(
        eq(expenses.userId, userId),
        eq(expenses.category, category)
      ));
  }

  async getGoalsByUser(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal || undefined;
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async updateGoal(id: string, goalUpdate: Partial<Goal>): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set(goalUpdate)
      .where(eq(goals.id, id))
      .returning();
    return goal || undefined;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  async getDecisionsByUser(userId: string): Promise<Decision[]> {
    return await db.select().from(decisions).where(eq(decisions.userId, userId));
  }

  async createDecision(insertDecision: InsertDecision): Promise<Decision> {
    const [decision] = await db
      .insert(decisions)
      .values(insertDecision)
      .returning();
    return decision;
  }

  async updateDecision(id: string, decisionUpdate: Partial<Decision>): Promise<Decision | undefined> {
    const [decision] = await db
      .update(decisions)
      .set(decisionUpdate)
      .where(eq(decisions.id, id))
      .returning();
    return decision || undefined;
  }

  async getStreaksByUser(userId: string): Promise<Streak[]> {
    return await db.select().from(streaks).where(eq(streaks.userId, userId));
  }

  async getStreak(userId: string, type: string): Promise<Streak | undefined> {
    const [streak] = await db
      .select()
      .from(streaks)
      .where(and(
        eq(streaks.userId, userId),
        eq(streaks.type, type)
      ));
    return streak || undefined;
  }

  async createOrUpdateStreak(insertStreak: InsertStreak): Promise<Streak> {
    const existing = await this.getStreak(insertStreak.userId, insertStreak.type);
    
    if (existing) {
      const [streak] = await db
        .update(streaks)
        .set(insertStreak)
        .where(eq(streaks.id, existing.id))
        .returning();
      return streak;
    } else {
      const [streak] = await db
        .insert(streaks)
        .values(insertStreak)
        .returning();
      return streak;
    }
  }

  async getAchievementsByUser(userId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  // Mood tracking methods
  async getMoodByDate(userId: string, date: string): Promise<MoodEntry | undefined> {
    const [mood] = await db.select().from(moodEntries).where(
      and(eq(moodEntries.userId, userId), eq(moodEntries.date, date))
    );
    return mood || undefined;
  }

  async createMoodEntry(insertMood: InsertMoodEntry): Promise<MoodEntry> {
    const [mood] = await db
      .insert(moodEntries)
      .values(insertMood)
      .returning();
    return mood;
  }

  async getMoodEntriesByUser(userId: string, limit: number = 30): Promise<MoodEntry[]> {
    return await db.select().from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(sql`${moodEntries.date} DESC`)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();