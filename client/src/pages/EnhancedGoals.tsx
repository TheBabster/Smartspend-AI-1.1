import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Card as TabsCard } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import SmartieAICoach from "@/components/SmartieAICoach";
import SavingsTreeGamification from "@/components/SavingsTreeGamification";
import DailyChallengeSystem from "@/components/DailyChallengeSystem";
import { staggerContainer, staggerItem } from "@/components/MicroAnimations";
import { type Goal, type Budget, type Streak, type Decision } from "@shared/schema";

export default function EnhancedGoals() {
  const { data: goals = [] } = useQuery<Goal[]>({ queryKey: ["/api/goals"] });
  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ["/api/budgets"] });
  const { data: streaks = [] } = useQuery<Streak[]>({ queryKey: ["/api/streaks"] });
  const { data: decisions = [] } = useQuery<Decision[]>({ queryKey: ["/api/decisions"] });

  // Calculate key metrics for AI coaching
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);
  const weeklySpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const lastWeekSpent = weeklySpent * 0.85; // Simulated for demo
  const currentStreak = streaks[0]?.currentStreak || 0;
  const monthlyStreak = Math.floor(currentStreak / 30);
  const weeklyDecisions = decisions.filter(d => 
    new Date(d.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <ResponsiveLayout className="bg-gray-50 dark:bg-gray-900 pb-20" maxWidth="lg" padding="md">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Financial Wellness Hub</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your complete financial coaching and growth center
        </p>
      </motion.div>

      {/* All-in-one Financial Wellness Hub */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* AI Coach Section */}
        <motion.div variants={staggerItem}>
          <SmartieAICoach
            totalSpent={weeklySpent}
            weeklySpent={weeklySpent}
            lastWeekSpent={lastWeekSpent}
            recentDecisions={decisions}
            currentStreak={currentStreak}
          />
        </motion.div>

        {/* Savings Tree Section */}
        <motion.div variants={staggerItem}>
          <SavingsTreeGamification
            totalSaved={totalSaved}
            currentStreak={currentStreak}
            monthlyStreak={monthlyStreak}
          />
        </motion.div>

        {/* Daily Challenges Section */}
        <motion.div variants={staggerItem}>
          <DailyChallengeSystem
            currentStreak={currentStreak}
            weeklySpent={weeklySpent}
            weeklyDecisions={weeklyDecisions}
            totalSaved={totalSaved}
          />
        </motion.div>

        {/* Behavioral Analytics Section */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Behavioral Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">£{totalSaved.toFixed(0)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Saved</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{weeklyDecisions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Decisions</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{monthlyStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotional Spending Patterns */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Emotional Spending Patterns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stress-induced purchases</span>
                  <span className="text-sm font-medium">3 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Boredom shopping</span>
                  <span className="text-sm font-medium">1 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">FOMO purchases</span>
                  <span className="text-sm font-medium">2 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <BottomNav currentTab="goals" />
    </ResponsiveLayout>
  );
}