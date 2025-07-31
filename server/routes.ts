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
      console.log('🎯 Creating goal with data:', req.body);
      const goalData = insertGoalSchema.parse(req.body);
      console.log('✅ Goal data validated:', goalData);
      const goal = await storage.createGoal(goalData);
      console.log('✅ Goal created in database:', goal);
      res.json(goal);
    } catch (error) {
      console.error("❌ Error creating goal:", error);
      res.status(400).json({ error: "Invalid goal data", details: error instanceof Error ? error.message : "Unknown error" });
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

  // Add money to goal
  app.post("/api/goals/:id/add-money", async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      const goal = await storage.getGoal(id);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      const currentAmount = parseFloat(goal.currentAmount || '0');
      const newAmount = currentAmount + parseFloat(amount);
      
      const updatedGoal = await storage.updateGoal(id, {
        currentAmount: newAmount.toString()
      });
      
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error adding money to goal:", error);
      res.status(500).json({ error: "Failed to add money to goal" });
    }
  });

  // Update user financial information
  app.patch("/api/user/:id/financial-info", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await storage.updateUser(id, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating financial info:", error);
      res.status(500).json({ error: "Failed to update financial information" });
    }
  });

  // Enhanced Smartie Chat endpoint with SmartCoin system
  app.post("/api/smartie/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required" });
      }

      // Get user profile for personalized responses
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has enough SmartCoins (0.5 coins per message)
      const coinsRequired = 0.5;
      if ((user.smartCoins || 0) < coinsRequired) {
        return res.status(402).json({ 
          error: "Insufficient SmartCoins",
          message: "You need more SmartCoins to chat with Smartie! Earn coins by using the app daily or sharing with friends.",
          coinsNeeded: coinsRequired - (user.smartCoins || 0)
        });
      }

      // Generate ChatGPT-like response using OpenAI directly
      const userContext = `
User Profile:
- Name: ${user?.name || "User"}
- Monthly Income: £${user?.monthlyIncome || "Not set"}
- Currency: ${user?.currency || "GBP"}
- Smart Coins: ${user?.smartCoins || 0}
      `;

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

      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = {
        message: openaiResponse.choices[0].message.content || "I'm here to help! What would you like to know?",
        timestamp: new Date().toISOString(),
        coinsUsed: 0.5
      };
      
      // Deduct coins from user - ensure integer value for smartCoins
      const userIdString = String(userId);
      const newCoinsAmount = Math.max(0, Math.floor((user.smartCoins || 0) - coinsRequired));
      await storage.updateUser(userIdString, { 
        smartCoins: newCoinsAmount
      });
      
      res.json({
        ...response,
        remainingCoins: Math.max(0, (user.smartCoins || 0) - coinsRequired)
      });
    } catch (error) {
      console.error("Smartie chat error:", error);
      res.status(500).json({ 
        error: "Failed to generate response",
        message: "I'm having trouble connecting right now, but I'm still here to help! Try asking me about budgeting, saving, or financial planning. 💰"
      });
    }
  });

  // Daily coin reward endpoint
  app.post("/api/user/:userId/daily-reward", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const lastActive = user.lastActiveDate;
      
      // Check if user already got today's reward
      if (lastActive === today) {
        return res.json({ 
          message: "Already claimed today's reward",
          coins: user.smartCoins,
          streak: user.dailyStreak || 0
        });
      }

      let newStreak = 1;
      let coinsToAdd = 2; // Base daily reward

      // Calculate streak
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          newStreak = (user.dailyStreak || 0) + 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
      }

      // Bonus coins for 7+ day streak
      if (newStreak >= 7) {
        coinsToAdd = 3;
      }

      const updatedCoins = (user.smartCoins || 0) + coinsToAdd;

      await storage.updateUser(userId, {
        smartCoins: updatedCoins,
        dailyStreak: newStreak,
        lastActiveDate: today
      });

      res.json({
        message: `Earned ${coinsToAdd} SmartCoins!`,
        coinsEarned: coinsToAdd,
        totalCoins: updatedCoins,
        streak: newStreak,
        streakBonus: newStreak >= 7
      });
    } catch (error) {
      console.error("Daily reward error:", error);
      res.status(500).json({ error: "Failed to process daily reward" });
    }
  });

  // Sharing reward endpoint
  app.post("/api/user/:userId/sharing-reward", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const sharingReward = 30;
      const updatedCoins = (user.smartCoins || 0) + sharingReward;

      await storage.updateUser(userId, {
        smartCoins: updatedCoins
      });

      res.json({
        message: `Earned ${sharingReward} SmartCoins for sharing!`,
        coinsEarned: sharingReward,
        totalCoins: updatedCoins
      });
    } catch (error) {
      console.error("Sharing reward error:", error);
      res.status(500).json({ error: "Failed to process sharing reward" });
    }
  });

  // Calculate user's real Financial IQ and stats
  app.get("/api/user/:userId/financial-stats", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user's financial data
      const [user, decisions, expenses, budgets, goals] = await Promise.all([
        storage.getUser(userId),
        storage.getDecisionsByUser(userId),
        storage.getExpensesByUser(userId),
        storage.getBudgetsByUser(userId),
        storage.getGoalsByUser(userId)
      ]);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Calculate Financial IQ based on actual behavior
      let financialIQ = calculateFinancialIQ(user, decisions, expenses, budgets, goals);
      
      // Calculate other metrics
      const totalDecisions = decisions.length;
      const smartChoices = decisions.filter(d => 
        (d.recommendation === 'no' && !d.followed) || 
        (d.recommendation === 'yes' && d.followed)
      ).length;
      
      // Calculate money saved from good decisions
      const moneySaved = decisions
        .filter(d => d.recommendation === 'no' && !d.followed)
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);
      
      // Calculate current streak based on recent smart decisions
      const currentStreak = calculateDecisionStreak(decisions);

      res.json({
        totalDecisions,
        smartChoices,
        moneySaved: Math.round(moneySaved),
        currentStreak,
        financialIQ,
        decisionAccuracy: totalDecisions > 0 ? Math.round((smartChoices / totalDecisions) * 100) : 0,
        budgetAdherence: calculateBudgetAdherence(budgets),
        goalProgress: calculateGoalProgress(goals)
      });
    } catch (error) {
      console.error("Error calculating financial stats:", error);
      res.status(500).json({ error: "Failed to calculate financial stats" });
    }
  });

  function calculateFinancialIQ(user: any, decisions: any[], expenses: any[], budgets: any[], goals: any[]): number {
    let score = 30; // Base score
    
    // Onboarding completion (+15 points)
    if (user.onboardingCompleted) {
      score += 15;
    }

    // Decision making quality (+30 points max)
    if (decisions.length > 0) {
      const goodDecisions = decisions.filter(d => 
        (d.recommendation === 'no' && !d.followed) || 
        (d.recommendation === 'yes' && d.followed) ||
        (d.recommendation === 'think_again' && d.followed)
      ).length;
      const decisionScore = Math.min(30, (goodDecisions / decisions.length) * 30);
      score += decisionScore;
    }

    // Budget adherence (+20 points max)
    const budgetScore = calculateBudgetAdherence(budgets);
    score += Math.min(20, budgetScore * 0.2);

    // Goal setting and progress (+10 points max)
    if (goals.length > 0) {
      const activeGoals = goals.filter(g => !g.completed).length;
      const completedGoals = goals.filter(g => g.completed).length;
      score += Math.min(10, activeGoals * 2 + completedGoals * 3);
    }

    // Expense tracking consistency (+10 points max)
    const recentExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.createdAt);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return expenseDate > thirtyDaysAgo;
    });
    
    if (recentExpenses.length >= 10) {
      score += 10; // Active expense tracking
    } else if (recentExpenses.length >= 5) {
      score += 5;
    }

    // Savings rate bonus (+5 points max)
    if (user.monthlyIncome && expenses.length > 0) {
      const monthlyExpenses = expenses
        .filter(e => {
          const expenseDate = new Date(e.createdAt);
          const currentMonth = new Date().getMonth();
          return expenseDate.getMonth() === currentMonth;
        })
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
      
      const savingsRate = (parseFloat(user.monthlyIncome) - monthlyExpenses) / parseFloat(user.monthlyIncome);
      if (savingsRate > 0.2) score += 5; // 20%+ savings rate
      else if (savingsRate > 0.1) score += 3; // 10%+ savings rate
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  function calculateDecisionStreak(decisions: any[]): number {
    if (decisions.length === 0) return 0;
    
    // Sort decisions by date (newest first)
    const sortedDecisions = decisions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    let streak = 0;
    for (const decision of sortedDecisions) {
      const isGoodDecision = 
        (decision.recommendation === 'no' && !decision.followed) ||
        (decision.recommendation === 'yes' && decision.followed) ||
        (decision.recommendation === 'think_again' && decision.followed);
      
      if (isGoodDecision) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  function calculateBudgetAdherence(budgets: any[]): number {
    if (budgets.length === 0) return 0;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentBudgets = budgets.filter(b => b.month === currentMonth);
    
    if (currentBudgets.length === 0) return 0;
    
    let totalAdherence = 0;
    let budgetCount = 0;
    
    for (const budget of currentBudgets) {
      const spent = parseFloat(budget.spent || '0');
      const limit = parseFloat(budget.monthlyLimit);
      
      if (limit > 0) {
        const adherence = Math.max(0, Math.min(100, ((limit - spent) / limit) * 100));
        totalAdherence += adherence;
        budgetCount++;
      }
    }
    
    return budgetCount > 0 ? totalAdherence / budgetCount : 0;
  }

  function calculateGoalProgress(goals: any[]): number {
    if (goals.length === 0) return 0;
    
    let totalProgress = 0;
    let goalCount = 0;
    
    for (const goal of goals) {
      const current = parseFloat(goal.currentAmount || '0');
      const target = parseFloat(goal.targetAmount);
      
      if (target > 0) {
        const progress = Math.min(100, (current / target) * 100);
        totalProgress += progress;
        goalCount++;
      }
    }
    
    return goalCount > 0 ? totalProgress / goalCount : 0;
  }

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
        console.log("🧠 Attempting OpenAI API call...");
        
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

        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key not configured");
        }

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        console.log("✅ OpenAI API call successful");

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

  // Mood tracking endpoints
  app.post("/api/mood", async (req, res) => {
    try {
      const { mood, notes, userId } = req.body;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const moodEntry = await storage.createMoodEntry({
        userId,
        mood,
        notes: notes || null,
        date: today
      });

      res.json(moodEntry);
    } catch (error) {
      console.error("Mood creation error:", error);
      res.status(500).json({ error: "Failed to create mood entry" });
    }
  });

  app.get("/api/mood/today/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const today = new Date().toISOString().split('T')[0];
      
      const mood = await storage.getMoodByDate(userId, today);
      if (!mood) {
        return res.status(404).json({ message: "No mood entry for today" });
      }
      
      res.json(mood);
    } catch (error) {
      console.error("Get today mood error:", error);
      res.status(500).json({ error: "Failed to get mood entry" });
    }
  });

  app.get("/api/mood/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const moods = await storage.getMoodEntriesByUser(userId);
      res.json(moods);
    } catch (error) {
      console.error("Get mood entries error:", error);
      res.status(500).json({ error: "Failed to get mood entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
