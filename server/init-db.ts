import { db } from "./db";
import { users, budgets, expenses, goals, streaks, achievements, decisions } from "@shared/schema";

export async function initializeDatabase() {
  try {
    console.log("Initializing database with demo data...");
    
    // Create demo user
    const [user] = await db
      .insert(users)
      .values({
        username: "alex",
        email: "alex@example.com",
        password: "demo-password-hash",
        name: "Alex Johnson",
        currency: "GBP",
        monthlyIncome: "3500.00",
        onboardingCompleted: true,
      })
      .onConflictDoNothing()
      .returning();

    const userId = user?.id || "demo-user-fallback";
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Create demo budgets
    const budgetData = [
      { category: "Food & Dining", monthlyLimit: "400.00", spent: "267.50" },
      { category: "Shopping", monthlyLimit: "200.00", spent: "134.20" },
      { category: "Entertainment", monthlyLimit: "150.00", spent: "89.30" },
      { category: "Transport", monthlyLimit: "100.00", spent: "67.80" },
      { category: "Utilities", monthlyLimit: "200.00", spent: "180.00" },
      { category: "Other", monthlyLimit: "100.00", spent: "45.60" }
    ];

    for (const budget of budgetData) {
      await db
        .insert(budgets)
        .values({
          userId,
          category: budget.category,
          monthlyLimit: budget.monthlyLimit,
          spent: budget.spent,
          month: currentMonth,
        })
        .onConflictDoNothing();
    }

    // Create demo expenses
    const expenseData = [
      { category: "Food & Dining", amount: "12.50", description: "Lunch - Pret A Manger", emotionalTag: "convenience" },
      { category: "Shopping", amount: "45.99", description: "New headphones", emotionalTag: "want" },
      { category: "Entertainment", amount: "15.00", description: "Netflix subscription", emotionalTag: null },
      { category: "Transport", amount: "8.50", description: "Bus fare", emotionalTag: null },
      { category: "Food & Dining", amount: "28.75", description: "Grocery shopping - Tesco", emotionalTag: null },
    ];

    for (const expense of expenseData) {
      await db
        .insert(expenses)
        .values({
          userId,
          ...expense,
        })
        .onConflictDoNothing();
    }

    // Create demo goals
    await db
      .insert(goals)
      .values([
        {
          userId,
          title: "Emergency Fund",
          targetAmount: "5000.00",
          currentAmount: "2340.00",
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          icon: "🛡️",
          completed: false,
        },
        {
          userId,
          title: "Summer Vacation",
          targetAmount: "2000.00",
          currentAmount: "1340.00",
          targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          icon: "✈️",
          completed: false,
        },
      ])
      .onConflictDoNothing();

    // Create demo decisions
    await db
      .insert(decisions)
      .values([
        {
          userId,
          itemName: "Gaming Headset",
          amount: "89.99",
          category: "Entertainment",
          desireLevel: 7,
          urgency: 3,
          emotion: "excited",
          notes: "Saw good reviews online",
          recommendation: "think_again",
          reasoning: "You already have working headphones. Consider waiting until your current ones break.",
          followed: true,
          regretLevel: null,
        },
        {
          userId,
          itemName: "Coffee Subscription",
          amount: "25.00",
          category: "Food & Dining",
          desireLevel: 6,
          urgency: 2,
          emotion: "content",
          notes: "Monthly subscription",
          recommendation: "yes",
          reasoning: "This fits within your food budget and you enjoy good coffee daily.",
          followed: true,
          regretLevel: 2,
        },
      ])
      .onConflictDoNothing();

    // Create demo streaks
    await db
      .insert(streaks)
      .values([
        {
          userId,
          type: "budget",
          currentStreak: 21,
          longestStreak: 21,
        },
        {
          userId,
          type: "savings",
          currentStreak: 14,
          longestStreak: 28,
        },
      ])
      .onConflictDoNothing();

    // Create demo achievements
    await db
      .insert(achievements)
      .values([
        {
          userId,
          type: "budget",
          title: "Budget Master",
          description: "Stayed under budget for 20 consecutive days!",
          icon: "🏆",
          unlockedAt: new Date(),
        },
        {
          userId,
          type: "decision",
          title: "Smart Spender",
          description: "Used Smartie's advice 10 times",
          icon: "🧠",
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ])
      .onConflictDoNothing();

    console.log("✅ Database initialized successfully with demo data!");
    return { success: true, userId };
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    return { success: false, error };
  }
}