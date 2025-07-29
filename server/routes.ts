import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBudgetSchema, insertExpenseSchema, insertGoalSchema, insertDecisionSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Default user endpoint
  app.get("/api/user", async (req, res) => {
    const user = await storage.getUser("demo-user");
    res.json(user);
  });

  app.patch("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser("demo-user", userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Budget endpoints
  app.get("/api/budgets", async (req, res) => {
    const budgets = await storage.getBudgetsByUser("demo-user");
    res.json(budgets);
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse({ ...req.body, userId: "demo-user" });
      const budget = await storage.createBudget(budgetData);
      res.json(budget);
    } catch (error) {
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  // Expense endpoints
  app.get("/api/expenses", async (req, res) => {
    const expenses = await storage.getExpensesByUser("demo-user");
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse({ ...req.body, userId: "demo-user" });
      const expense = await storage.createExpense(expenseData);

      // Update budget spent amount
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await storage.getBudgetByCategory("demo-user", expenseData.category, currentMonth);
      if (budget) {
        const newSpent = (parseFloat(budget.spent || "0") + parseFloat(expenseData.amount)).toFixed(2);
        await storage.updateBudget(budget.id, { spent: newSpent });
      }

      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", async (req, res) => {
    const goals = await storage.getGoalsByUser("demo-user");
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse({ ...req.body, userId: "demo-user" });
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const goalData = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(req.params.id, goalData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: "Invalid goal data" });
    }
  });

  // Decision endpoints
  app.get("/api/decisions", async (req, res) => {
    const decisions = await storage.getDecisionsByUser("demo-user");
    res.json(decisions);
  });

  app.post("/api/decisions", async (req, res) => {
    try {
      const { itemName, amount, category, desireLevel, urgency } = req.body;

      // Get user's budget for this category
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await storage.getBudgetByCategory("demo-user", category, currentMonth);
      const remainingBudget = budget ? parseFloat(budget.monthlyLimit) - parseFloat(budget.spent || "0") : 0;

      // Generate AI recommendation using GPT-4o
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const prompt = `You are Smartie, a friendly AI financial assistant. Analyze this purchase decision and provide advice.

Purchase Details:
- Item: ${itemName}
- Cost: £${amount}
- Category: ${category}
- Desire Level: ${desireLevel}/10
- Urgency: ${urgency}/10
- Remaining Budget: £${remainingBudget}

Provide a recommendation (yes/think_again/no) and friendly reasoning in JSON format:
{
  "recommendation": "yes|think_again|no",
  "reasoning": "Your friendly advice here"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{"recommendation": "think_again", "reasoning": "Let me think about this..."}');

      const decisionData = insertDecisionSchema.parse({
        userId: "demo-user",
        itemName,
        amount: amount.toString(),
        category,
        desireLevel: parseInt(desireLevel),
        urgency: parseInt(urgency),
        recommendation: aiResponse.recommendation,
        reasoning: aiResponse.reasoning,
      });

      const decision = await storage.createDecision(decisionData);
      res.json(decision);
    } catch (error) {
      console.error("Decision creation error:", error);
      res.status(400).json({ error: "Invalid decision data" });
    }
  });

  // Streaks endpoints
  app.get("/api/streaks", async (req, res) => {
    const streaks = await storage.getStreaksByUser("demo-user");
    res.json(streaks);
  });

  // Achievements endpoints
  app.get("/api/achievements", async (req, res) => {
    const achievements = await storage.getAchievementsByUser("demo-user");
    res.json(achievements);
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    const expenses = await storage.getExpensesByUser("demo-user");
    const budgets = await storage.getBudgetsByUser("demo-user");
    const goals = await storage.getGoalsByUser("demo-user");

    // Calculate spending by category
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    // Calculate monthly totals
    const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.monthlyLimit), 0);

    res.json({
      categorySpending,
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      goals: goals.length,
      completedGoals: goals.filter(g => g.completed).length,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
