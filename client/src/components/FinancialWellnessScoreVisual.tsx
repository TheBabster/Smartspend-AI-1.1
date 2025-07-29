import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedSmartieReactions from "./EnhancedSmartieReactions";
import { CountUp } from "./MicroAnimations";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";

interface FinancialWellnessScoreVisualProps {
  score: number;
  previousScore?: number;
  breakdown: {
    budgetAdherence: number;
    savingsProgress: number;
    spendingWisdom: number;
    streakConsistency: number;
  };
}

export default function FinancialWellnessScoreVisual({
  score,
  previousScore = 65,
  breakdown
}: FinancialWellnessScoreVisualProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "from-green-400 to-emerald-500", text: "text-green-600", ring: "ring-green-500" };
    if (score >= 60) return { bg: "from-blue-400 to-cyan-500", text: "text-blue-600", ring: "ring-blue-500" };
    if (score >= 40) return { bg: "from-yellow-400 to-orange-500", text: "text-orange-600", ring: "ring-orange-500" };
    return { bg: "from-red-400 to-rose-500", text: "text-red-600", ring: "ring-red-500" };
  };

  const getSmartieMessage = (score: number) => {
    if (score >= 80) return "You're a financial superhero! Keep it up!";
    if (score >= 60) return "Great progress! You're building strong habits.";
    if (score >= 40) return "Good effort! Small improvements make big differences.";
    return "Every journey starts with a single step. You've got this!";
  };

  const getSmartieForScore = (score: number) => {
    if (score <= 30) return "sad_umbrella";
    if (score <= 70) return "lifting_weights";
    return "flying";
  };

  const scoreColor = getScoreColor(score);
  const isImproving = score > previousScore;
  const changeDifference = Math.abs(score - previousScore);

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: score / 100,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0.2 },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <Card className="relative overflow-hidden shadow-lg">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scoreColor.bg} opacity-5`} />
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-high-contrast mb-2">Financial Wellness Score</h2>
          <p className="text-medium-contrast">Your overall financial health rating</p>
        </div>

        {/* Main Score Display */}
        <div className="flex items-center justify-center mb-8">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#scoreGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray="339.292" // 2 * π * 54
                variants={circleVariants}
                initial="hidden"
                animate="visible"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444"} />
                  <stop offset="100%" stopColor={score >= 80 ? "#059669" : score >= 60 ? "#1d4ed8" : score >= 40 ? "#d97706" : "#dc2626"} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score Number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CountUp
                  from={0}
                  to={score}
                  className={`text-3xl font-bold ${scoreColor.text}`}
                />
                <div className="text-xs text-medium-contrast">/ 100</div>
              </div>
            </div>
          </div>

          {/* Smartie Reaction */}
          <div className="ml-8">
            <EnhancedSmartieReactions
              mood={getSmartieForScore(score)}
              size="lg"
              financialScore={score}
              message={getSmartieMessage(score)}
              animated={true}
            />
          </div>
        </div>

        {/* Score Change Indicator */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isImproving 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-600'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            {isImproving ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isImproving ? '+' : '-'}{changeDifference} from last week
            </span>
          </motion.div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-high-contrast text-center mb-4">Score Breakdown</h3>
          
          {[
            { label: "Budget Adherence", value: breakdown.budgetAdherence, icon: Target },
            { label: "Savings Progress", value: breakdown.savingsProgress, icon: TrendingUp },
            { label: "Spending Wisdom", value: breakdown.spendingWisdom, icon: Award },
            { label: "Streak Consistency", value: breakdown.streakConsistency, icon: TrendingUp }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${getScoreColor(item.value).text}`} />
                <span className="text-sm font-medium text-high-contrast">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(item.value).bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className={`text-sm font-bold ${getScoreColor(item.value).text} min-w-[2rem]`}>
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Improvement Suggestions */}
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">💡 Quick Improvement Tips</h4>
          <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
            {score < 40 && <li>• Start with small budget goals to build momentum</li>}
            {score < 60 && <li>• Use the 24-hour rule before non-essential purchases</li>}
            {score < 80 && <li>• Track your emotional triggers for spending</li>}
            <li>• Celebrate small wins to maintain motivation</li>
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}