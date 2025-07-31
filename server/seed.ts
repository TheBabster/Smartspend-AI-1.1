import { db } from "./db";
import { users, budgets, expenses, goals, streaks, achievements, decisions } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Create demo user
    const [user] = await db
      .insert(users)
      .values({
        username: "alex",
        email: "alex@example.com",
        password: "demo-password-hash", // In real app, this would be bcrypt hashed
        name: "Alex Johnson",
        currency: "GBP",
        monthlyIncome: "3500.00",
        onboardingCompleted: true,
      })
      .onConflictDoNothing()
      .returning();

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Don't create demo budgets - let users create their own

    // Don't create demo expenses - let users create their own

    // Don't create demo goals - let users create their own

    // Don't create demo streaks - let users build their own

    // Don't create demo achievements - let users earn their own

    // Don't create demo decisions - let users create their own

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Auto-seed when this file is imported
seedDatabase();