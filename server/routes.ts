import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBudgetSchema, insertExpenseSchema, insertGoalSchema, insertDecisionSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, authenticateToken, optionalAuth, type AuthRequest } from "./auth";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-default_key"
});

import { initializeDatabase } from "./init-db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database on startup
  await initializeDatabase();

  // Firebase + PostgreSQL user management
  app.post("/api/auth/firebase-user", async (req, res) => {
    try {
      const { firebaseUid, email, name } = req.body;
      
      if (!firebaseUid || !email) {
        return res.status(400).json({ error: "Firebase UID and email are required" });
      }

      console.log("🚀 Processing Firebase user:", { firebaseUid, email, name });

      // Check if user already exists in PostgreSQL
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user in PostgreSQL
        const username = email.split('@')[0] + '_' + firebaseUid.slice(0, 8);
        user = await storage.createUser({
          username,
          email,
          password: `firebase_${firebaseUid}`, // Not used for auth, just for schema compatibility
          name: name || email.split('@')[0],
          currency: "GBP",
          onboardingCompleted: false,
        });
        console.log("✅ Created new user in PostgreSQL:", user.id);
      } else {
        console.log("✅ Found existing user in PostgreSQL:", user.id);
      }

      res.json(user);
    } catch (error) {
      console.error("Error managing Firebase user:", error);
      res.status(500).json({ error: "Failed to manage user", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get user by email (for Firebase integration)
  app.get("/api/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(decodeURIComponent(email));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ error: "Failed to get user", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = insertUserSchema.partial().parse(req.body);
      const updatedUser = await storage.updateUser(userId, userData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Complete onboarding for a user
  app.post("/api/user/:userId/complete-onboarding", async (req, res) => {
    try {
      const { userId } = req.params;
      const { financialProfile } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        onboardingCompleted: true,
        financialProfile,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(400).json({ error: "Failed to complete onboarding" });
    }
  });

  // Budget endpoints - User-specific
  app.get("/api/budgets/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const budgets = await storage.getBudgetsByUser(userId);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(budgetData);
      res.json(budget);
    } catch (error) {
      console.error("Error creating budget:", error);
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  // Expense endpoints - User-specific
  app.get("/api/expenses/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const expenses = await storage.getExpensesByUser(userId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Failed to fetch expenses", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);

      // Update budget spent amount
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await storage.getBudgetByCategory(expenseData.userId, expenseData.category, currentMonth);
      if (budget) {
        const newSpent = (parseFloat(budget.spent || "0") + parseFloat(expenseData.amount)).toFixed(2);
        await storage.updateBudget(budget.id, { spent: newSpent });
      }

      res.json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  // Goals endpoints - User-specific
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const goals = await storage.getGoalsByUser(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ error: "Failed to fetch goals", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
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

  // Decision endpoints - User-specific
  app.get("/api/decisions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const decisions = await storage.getDecisionsByUser(userId);
      res.json(decisions);
    } catch (error) {
      console.error("Error fetching decisions:", error);
      res.status(500).json({ error: "Failed to fetch decisions", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/decisions", async (req, res) => {
    try {
      const { userId, itemName, amount, category, desireLevel, urgency, emotion, notes } = req.body;

      // Get user's budget for this category
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await storage.getBudgetByCategory(userId, category, currentMonth);
      const remainingBudget = budget ? parseFloat(budget.monthlyLimit) - parseFloat(budget.spent || "0") : 0;

      let aiResponse;
      
      try {
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

        aiResponse = JSON.parse(response.choices[0].message.content || '{"recommendation": "think_again", "reasoning": "Let me think about this..."}');
      } catch (error) {
        console.log("AI unavailable, using smart fallback logic:", (error as Error).message);
        
        // Smart fallback logic based on financial rules
        const costRatio = remainingBudget > 0 ? parseFloat(amount) / remainingBudget : 1;
        const totalScore = parseInt(desireLevel) + parseInt(urgency);
        
        let recommendation, reasoning;
        
        if (costRatio > 1) {
          recommendation = "no";
          reasoning = "🧠💸 Whoa there! This would put you over budget for this category. Smartie suggests waiting until next month or finding a cheaper alternative!";
        } else if (costRatio > 0.7 && totalScore < 12) {
          recommendation = "think_again";
          reasoning = "🤔 This is a big chunk of your remaining budget. Since it's not super urgent or desired, maybe sleep on it? Future you will thank you!";
        } else if (totalScore >= 16 && costRatio <= 0.3) {
          recommendation = "yes";
          reasoning = "✨ You really want this and it fits comfortably in your budget! Go for it - you've earned this treat!";
        } else if (totalScore >= 14) {
          recommendation = "think_again";
          reasoning = "🎯 You want this pretty badly, but let's be smart about it. Can you wait a few days or find it cheaper elsewhere?";
        } else {
          recommendation = "no";
          reasoning = "💪 Smartie's proud of you for checking first! This seems like an impulse buy. Your future self will thank you for skipping it!";
        }
        
        aiResponse = { recommendation, reasoning };
      }

      const decisionData = insertDecisionSchema.parse({
        userId,
        itemName,
        amount: amount.toString(),
        category,
        desireLevel: parseInt(desireLevel),
        urgency: parseInt(urgency),
        emotion: emotion || null,
        notes: notes || null,
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

  // Enhanced Smartie Chat with OpenAI - ChatGPT-like functionality
  app.post("/api/smartie/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get user context for personalized responses
      let userContext = "";
      if (userId) {
        try {
          const user = await storage.getUser(userId);
          const expenses = await storage.getExpensesByUser(userId);
          const budgets = await storage.getBudgetsByUser(userId);
          const goals = await storage.getGoalsByUser(userId);
          
          userContext = `
User Profile:
- Name: ${user?.name || "User"}
- Monthly Income: £${user?.monthlyIncome || "Not set"}
- Recent Expenses: ${expenses.length} recorded
- Active Budgets: ${budgets.length} categories
- Financial Goals: ${goals.length} goals
          `;
        } catch (error) {
          console.log("Could not fetch user context:", error);
        }
      }

      try {
        // Generate ChatGPT-like response using GPT-4o
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const systemPrompt = `You are Smartie, a friendly, enthusiastic, and knowledgeable AI financial coach. You're part of the SmartSpend app and help users with their financial wellness journey.

Key personality traits:
- Friendly and encouraging, like a supportive friend
- Knowledgeable about personal finance, budgeting, saving, investing
- Can answer ANY question - financial or not - while gently steering back to financial wellness when appropriate
- Use emojis sparingly but effectively
- Be conversational and avoid being preachy
- Celebrate user wins and provide motivation during challenges

${userContext}

IMPORTANT: You can answer any question the user asks - from silly jokes to serious financial advice. If they ask non-financial questions, feel free to engage naturally while occasionally connecting back to financial wellness when relevant.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        const reply = response.choices[0].message.content || "I'm here to help! What would you like to know?";
        
        res.json({ 
          message: reply,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.log("OpenAI unavailable, using fallback response:", error);
        
        // Friendly fallback responses for common topics
        const fallbackResponses = {
          budget: "💰 Great question about budgeting! I'd love to help you create a budget that works for your lifestyle. What's your main challenge with budgeting right now?",
          save: "🎯 Saving money is one of my favorite topics! The key is to start small and build habits. Even £5 a week adds up to £260 a year!",
          debt: "💪 Tackling debt can feel overwhelming, but you're asking the right questions! Let's break it down into manageable steps. What type of debt are you dealing with?",
          invest: "📈 Investing is exciting! It's like planting seeds for your future financial garden. Are you just getting started or looking to diversify?",
          default: "Hi there! I'm Smartie, your AI financial coach! 🧠✨ I'm here to help with all your money questions - budgeting, saving, spending decisions, or just a friendly chat about your financial goals. What's on your mind today?"
        };
        
        let reply = fallbackResponses.default;
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('budget')) reply = fallbackResponses.budget;
        else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) reply = fallbackResponses.save;
        else if (lowerMessage.includes('debt')) reply = fallbackResponses.debt;
        else if (lowerMessage.includes('invest')) reply = fallbackResponses.invest;
        
        res.json({ 
          message: reply,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // User-specific Streaks endpoints
  app.get("/api/streaks/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const streaks = await storage.getStreaksByUser(userId);
      res.json(streaks);
    } catch (error) {
      console.error("Error fetching streaks:", error);
      res.status(500).json({ error: "Failed to fetch streaks" });
    }
  });

  // User-specific Achievements endpoints
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // User-specific Analytics endpoint
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const expenses = await storage.getExpensesByUser(userId);
      const budgets = await storage.getBudgetsByUser(userId);
      const goals = await storage.getGoalsByUser(userId);

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
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
