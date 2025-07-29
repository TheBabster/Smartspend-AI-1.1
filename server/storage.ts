import { 
  type User, type InsertUser,
  type Budget, type InsertBudget,
  type Expense, type InsertExpense,
  type Goal, type InsertGoal,
  type Decision, type InsertDecision,
  type Streak, type InsertStreak,
  type Achievement, type InsertAchievement
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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

  // Decisions
  getDecisionsByUser(userId: string): Promise<Decision[]>;
  createDecision(decision: InsertDecision): Promise<Decision>;
  updateDecision(id: string, decision: Partial<Decision>): Promise<Decision | undefined>;

  // Streaks
  getStreaksByUser(userId: string): Promise<Streak[]>;
  getStreak(userId: string, type: string): Promise<Streak | undefined>;
  updateStreak(userId: string, type: string, streak: Partial<Streak>): Promise<Streak>;

  // Achievements
  getAchievementsByUser(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private expenses: Map<string, Expense> = new Map();
  private goals: Map<string, Goal> = new Map();
  private decisions: Map<string, Decision> = new Map();
  private streaks: Map<string, Streak> = new Map();
  private achievements: Map<string, Achievement> = new Map();

  constructor() {
    // Initialize with a default user for demo
    const defaultUser: User = {
      id: "demo-user",
      username: "alex",
      email: "alex@example.com",
      name: "Alex",
      currency: "GBP",
      monthlyIncome: "3000.00",
      onboardingCompleted: true,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Initialize default budgets
    const currentMonth = new Date().toISOString().slice(0, 7);
    const defaultBudgets: Budget[] = [
      { id: randomUUID(), userId: "demo-user", category: "Food & Dining", monthlyLimit: "300.00", spent: "127.00", month: currentMonth, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", category: "Shopping", monthlyLimit: "200.00", spent: "85.00", month: currentMonth, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", category: "Entertainment", monthlyLimit: "150.00", spent: "45.00", month: currentMonth, createdAt: new Date() },
    ];
    defaultBudgets.forEach(budget => this.budgets.set(budget.id, budget));

    // Initialize default goals
    const defaultGoals: Goal[] = [
      { id: randomUUID(), userId: "demo-user", title: "Emergency Fund", targetAmount: "5000.00", currentAmount: "2340.00", targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), icon: "🛡️", completed: false, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", title: "Vacation", targetAmount: "2000.00", currentAmount: "1340.00", targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), icon: "✈️", completed: false, createdAt: new Date() },
    ];
    defaultGoals.forEach(goal => this.goals.set(goal.id, goal));

    // Initialize default streaks
    const defaultStreaks: Streak[] = [
      { id: randomUUID(), userId: "demo-user", type: "budget", currentStreak: 21, longestStreak: 21, lastUpdated: new Date() },
      { id: randomUUID(), userId: "demo-user", type: "savings", currentStreak: 14, longestStreak: 28, lastUpdated: new Date() },
    ];
    defaultStreaks.forEach(streak => this.streaks.set(streak.id, streak));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      currency: insertUser.currency || 'GBP',
      monthlyIncome: insertUser.monthlyIncome || null,
      onboardingCompleted: insertUser.onboardingCompleted || false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBudgetsByUser(userId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(budget => budget.userId === userId);
  }

  async getBudgetByCategory(userId: string, category: string, month: string): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(
      budget => budget.userId === userId && budget.category === category && budget.month === month
    );
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = { 
      ...insertBudget, 
      id, 
      createdAt: new Date(),
      spent: insertBudget.spent || "0"
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, budgetUpdate: Partial<Budget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    const updatedBudget = { ...budget, ...budgetUpdate };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async getExpensesByUser(userId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => expense.userId === userId);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = { 
      ...insertExpense, 
      id, 
      createdAt: new Date(),
      emotionalTag: insertExpense.emotionalTag || null
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async getExpensesByCategory(userId: string, category: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      expense => expense.userId === userId && expense.category === category
    );
  }

  async getGoalsByUser(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      createdAt: new Date(),
      currentAmount: insertGoal.currentAmount || "0",
      targetDate: insertGoal.targetDate || null,
      icon: insertGoal.icon || null,
      completed: insertGoal.completed || false
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, goalUpdate: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    const updatedGoal = { ...goal, ...goalUpdate };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async getDecisionsByUser(userId: string): Promise<Decision[]> {
    return Array.from(this.decisions.values()).filter(decision => decision.userId === userId);
  }

  async createDecision(insertDecision: InsertDecision): Promise<Decision> {
    const id = randomUUID();
    const decision: Decision = { 
      ...insertDecision, 
      id, 
      createdAt: new Date(),
      followed: insertDecision.followed || null,
      regretLevel: insertDecision.regretLevel || null
    };
    this.decisions.set(id, decision);
    return decision;
  }

  async updateDecision(id: string, decisionUpdate: Partial<Decision>): Promise<Decision | undefined> {
    const decision = this.decisions.get(id);
    if (!decision) return undefined;
    const updatedDecision = { ...decision, ...decisionUpdate };
    this.decisions.set(id, updatedDecision);
    return updatedDecision;
  }

  async getStreaksByUser(userId: string): Promise<Streak[]> {
    return Array.from(this.streaks.values()).filter(streak => streak.userId === userId);
  }

  async getStreak(userId: string, type: string): Promise<Streak | undefined> {
    return Array.from(this.streaks.values()).find(
      streak => streak.userId === userId && streak.type === type
    );
  }

  async updateStreak(userId: string, type: string, streakUpdate: Partial<Streak>): Promise<Streak> {
    let streak = await this.getStreak(userId, type);
    if (!streak) {
      const id = randomUUID();
      streak = { id, userId, type, currentStreak: 0, longestStreak: 0, lastUpdated: new Date() };
      this.streaks.set(id, streak);
    }
    const updatedStreak = { ...streak, ...streakUpdate, lastUpdated: new Date() };
    this.streaks.set(streak.id, updatedStreak);
    return updatedStreak;
  }

  async getAchievementsByUser(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { ...insertAchievement, id, unlockedAt: new Date() };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
