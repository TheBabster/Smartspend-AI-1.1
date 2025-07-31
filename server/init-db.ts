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

    // Don't create demo budgets - let users create their own

    // Don't create demo expenses - let users create their own

    // Don't create demo goals - let users create their own

    // Don't create demo decisions - let users create their own decisions


    // Don't create demo streaks - let users build their own

    // Don't create demo achievements - let users earn their own

    console.log("✅ Database initialized successfully with demo data!");
    return { success: true, userId };
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    return { success: false, error };
  }
}