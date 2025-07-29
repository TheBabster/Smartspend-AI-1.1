import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Shield, Star, Award } from "lucide-react";
import { CountUp, PulseGlow } from "./MicroAnimations";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

interface FinancialWellnessScoreProps {
  budgets: any[];
  streak?: number;
  goalsCompleted?: number;
  totalGoals?: number;
  previousScore?: number;
}

interface ScoreBreakdown {
  budgetAdherence: number;
  savingsGoals: number;
  streakBonus: number;
  spendingPatterns: number;
  total: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  trend: "up" | "down" | "stable";
}

export default function FinancialWellnessScore({ 
  budgets = [],
  streak = 0,
  goalsCompleted = 0,
  totalGoals = 0,
  previousScore = 0
}: FinancialWellnessScoreProps) {
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(true);

  // Calculate comprehensive wellness score
  const calculateWellnessScore = (): ScoreBreakdown => {
    // Budget Adherence (40% of score)
    let budgetAdherence = 0;
    if (budgets.length > 0) {
      const adherenceScores = budgets.map(budget => {
        const spent = parseFloat(budget.spent);
        const limit = parseFloat(budget.monthlyLimit);
        if (limit === 0) return 100;
        
        const percentage = (spent / limit) * 100;
        if (percentage <= 75) return 100;
        if (percentage <= 85) return 85;
        if (percentage <= 100) return 70;
        return Math.max(0, 50 - (percentage - 100));
      });
      budgetAdherence = adherenceScores.reduce((sum, score) => sum + score, 0) / adherenceScores.length;
    }

    // Savings Goals Progress (30% of score)
    let savingsGoals = 0;
    if (totalGoals > 0) {
      const goalCompletionRate = (goalsCompleted / totalGoals) * 100;
      savingsGoals = Math.min(goalCompletionRate * 1.2, 100); // Bonus for high completion
    } else {
      savingsGoals = 50; // Neutral score if no goals set
    }

    // Streak Bonus (15% of score)
    const streakBonus = Math.min(streak * 5, 100); // 5 points per day, capped at 100

    // Spending Patterns (15% of score)
    let spendingPatterns = 70; // Base score
    
    // Penalize overspending
    const overspendingCategories = budgets.filter(budget => {
      const spent = parseFloat(budget.spent);
      const limit = parseFloat(budget.monthlyLimit);
      return spent > limit;
    });
    
    spendingPatterns -= overspendingCategories.length * 10;
    
    // Bonus for consistent spending
    if (streak >= 7) spendingPatterns += 15;
    if (streak >= 14) spendingPatterns += 10;
    
    spendingPatterns = Math.max(0, Math.min(100, spendingPatterns));

    // Calculate weighted total
    const total = Math.round(
      (budgetAdherence * 0.4) + 
      (savingsGoals * 0.3) + 
      (streakBonus * 0.15) + 
      (spendingPatterns * 0.15)
    );

    // Determine grade
    let grade: ScoreBreakdown["grade"];
    if (total >= 95) grade = "A+";
    else if (total >= 90) grade = "A";
    else if (total >= 85) grade = "B+";
    else if (total >= 80) grade = "B";
    else if (total >= 75) grade = "C+";
    else if (total >= 70) grade = "C";
    else grade = "D";

    // Determine trend
    let trend: ScoreBreakdown["trend"];
    if (total > previousScore + 2) trend = "up";
    else if (total < previousScore - 2) trend = "down";
    else trend = "stable";

    return {
      budgetAdherence: Math.round(budgetAdherence),
      savingsGoals: Math.round(savingsGoals),
      streakBonus: Math.round(streakBonus),
      spendingPatterns: Math.round(spendingPatterns),
      total,
      grade,
      trend
    };
  };

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const score = calculateWellnessScore();
      setScoreBreakdown(score);
      setIsCalculating(false);
    }, 1500); // Simulate calculation time for drama

    return () => clearTimeout(timer);
  }, [budgets, streak, goalsCompleted, totalGoals]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "from-green-400 to-emerald-500";
    if (grade.startsWith("B")) return "from-yellow-400 to-orange-500";
    if (grade.startsWith("C")) return "from-orange-400 to-red-500";
    return "from-red-400 to-red-600";
  };

  const getSmartieReaction = (score: number) => {
    // Score-based Smartie expressions as per user specification:
    // 😊 for 75–100, 😐 for 50–74, 😟 for <50
    if (score >= 75) return { mood: "happy" as const, message: "Outstanding financial discipline! You're crushing it! 🎉" };
    if (score >= 50) return { mood: "thinking" as const, message: "You're on the right track. Small tweaks will help! 🤔" };
    return { mood: "concerned" as const, message: "Let's work together to improve your financial wellness! 💙" };
  };

  if (isCalculating) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <ExactSmartieAvatar mood="thinking" size="lg" animated={true} animationType="thinking" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Calculating Your Wellness Score...</h3>
            <div className="space-y-3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzing spending patterns, goals, and habits...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreBreakdown) return null;

  const smartieReaction = getSmartieReaction(scoreBreakdown.total);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Financial Wellness Score
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your overall financial health rating
            </p>
          </div>
          
          {/* Trend indicator */}
          <div className="flex items-center gap-2">
            {scoreBreakdown.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
            {scoreBreakdown.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
            {scoreBreakdown.trend === "stable" && <Target className="w-5 h-5 text-gray-500" />}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {scoreBreakdown.trend === "up" && "Improving"}
              {scoreBreakdown.trend === "down" && "Declining"}
              {scoreBreakdown.trend === "stable" && "Stable"}
            </span>
          </div>
        </div>

        {/* Main Score Display */}
        <div className="text-center mb-8">
          <PulseGlow 
            color={scoreBreakdown.total >= 90 ? "green" : scoreBreakdown.total >= 80 ? "yellow" : "purple"}
            intensity="medium"
          >
            <div className="relative">
              <motion.div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl"
                style={{
                  background: `conic-gradient(from 0deg, ${
                    scoreBreakdown.total >= 90 ? '#10b981' : 
                    scoreBreakdown.total >= 80 ? '#f59e0b' : 
                    scoreBreakdown.total >= 70 ? '#f97316' : '#ef4444'
                  } ${(scoreBreakdown.total / 100) * 360}deg, #e5e7eb ${(scoreBreakdown.total / 100) * 360}deg)`
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              >
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <CountUp 
                    from={0} 
                    to={scoreBreakdown.total} 
                    className={`text-3xl font-bold ${getScoreColor(scoreBreakdown.total)}`}
                  />
                </div>
              </motion.div>
              
              {/* Grade Badge */}
              <motion.div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold text-sm bg-gradient-to-r ${getGradeColor(scoreBreakdown.grade)} shadow-lg`}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                {scoreBreakdown.grade}
              </motion.div>
            </div>
          </PulseGlow>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Score Breakdown
          </h4>
          
          {[
            { label: "Budget Adherence", value: scoreBreakdown.budgetAdherence, weight: "40%", icon: Shield },
            { label: "Savings Goals", value: scoreBreakdown.savingsGoals, weight: "30%", icon: Target },
            { label: "Streak Bonus", value: scoreBreakdown.streakBonus, weight: "15%", icon: Star },
            { label: "Spending Patterns", value: scoreBreakdown.spendingPatterns, weight: "15%", icon: TrendingUp }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">Weight: {item.weight}</p>
                </div>
              </div>
              <div className="text-right">
                <CountUp 
                  from={0} 
                  to={item.value} 
                  suffix="/100" 
                  className={`font-bold ${getScoreColor(item.value)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Smartie Reaction */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <ExactSmartieAvatar 
                mood={smartieReaction.mood} 
                size="md" 
                animated={true} 
                animationType={smartieReaction.mood === "celebrating" ? "celebration" : smartieReaction.mood === "thinking" ? "thinking" : "greeting"} 
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                Smartie says:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {smartieReaction.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Improvement Tips */}
        {scoreBreakdown.total < 90 && (
          <motion.div
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Improvements:</h5>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              {scoreBreakdown.budgetAdherence < 80 && (
                <li>• Review and adjust budget limits for overspent categories</li>
              )}
              {scoreBreakdown.savingsGoals < 80 && (
                <li>• Set realistic savings goals to build momentum</li>
              )}
              {scoreBreakdown.streakBonus < 50 && (
                <li>• Build a daily habit of checking your spending</li>
              )}
              {scoreBreakdown.spendingPatterns < 80 && (
                <li>• Track spending patterns to identify improvement areas</li>
              )}
            </ul>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}