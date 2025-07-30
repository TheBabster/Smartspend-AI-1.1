import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  Flame, 
  Target, 
  Calendar, 
  Award,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

interface StreakTrackerProps {
  loggingStreak: number;
  smartSpendingScore: number;
  budgetAdherence: number;
  goalProgress: number;
  showCelebration?: boolean;
}

export default function StreakTracker({ 
  loggingStreak, 
  smartSpendingScore, 
  budgetAdherence,
  goalProgress,
  showCelebration = false 
}: StreakTrackerProps) {
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [streakMessage, setStreakMessage] = useState("");

  const getStreakMessage = (streak: number) => {
    if (streak >= 7) return "🔥 You're on fire! One week strong!";
    if (streak >= 5) return "🌟 Amazing consistency! Keep it up!";
    if (streak >= 3) return "💪 Building great habits!";
    if (streak >= 1) return "🎯 Great start! Let's build momentum!";
    return "📝 Ready to start your streak?";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-50 dark:bg-red-900/20";
  };

  useEffect(() => {
    setStreakMessage(getStreakMessage(loggingStreak));
    if (showCelebration && loggingStreak >= 3) {
      setCelebrationActive(true);
      setTimeout(() => setCelebrationActive(false), 3000);
    }
  }, [loggingStreak, showCelebration]);

  return (
    <div className="space-y-4">
      {/* Main Streak Display */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 relative overflow-hidden">
        {/* Celebration Effects */}
        <AnimatePresence>
          {celebrationActive && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    y: [-20, -80],
                    opacity: [1, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {['🎉', '⭐', '💫', '🔥', '✨'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: celebrationActive ? [1, 1.2, 1] : 1,
                rotate: celebrationActive ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: celebrationActive ? Infinity : 0 }}
            >
              <ModernSmartieAvatar 
                mood={loggingStreak >= 5 ? 'celebrating' : loggingStreak >= 3 ? 'happy' : 'thinking'} 
                size="md" 
              />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100">
                Daily Streak
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {streakMessage}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Flame className={`w-6 h-6 ${loggingStreak >= 3 ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
              <motion.span 
                key={loggingStreak}
                initial={{ scale: 1.5, color: "#f97316" }}
                animate={{ scale: 1, color: "#1f2937" }}
                className="text-3xl font-bold text-orange-900 dark:text-orange-100"
              >
                {loggingStreak}
              </motion.span>
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">days</div>
          </div>
        </div>

        {/* Streak Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-orange-700 dark:text-orange-300">
            <span>Progress to next milestone</span>
            <span>{loggingStreak % 7}/7 days</span>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((loggingStreak % 7) / 7) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </Card>

      {/* Smart Spending Score */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">Smart Spending Score</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(smartSpendingScore)}`}>
            {smartSpendingScore}/100
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{budgetAdherence}%</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Budget Health</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{Math.round(goalProgress)}%</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Goal Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{loggingStreak}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Consistency</div>
          </div>
        </div>
      </Card>

      {/* Goal Reminder */}
      {goalProgress > 0 && goalProgress < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900 dark:text-purple-100">
                {Math.round(100 - goalProgress)}% away from your goal!
              </span>
            </div>
            <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
              Stay Focused
            </Button>
          </div>
        </motion.div>
      )}

      {/* Weekly Milestones */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
              i < loggingStreak % 7 
                ? 'bg-orange-400 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}
          >
            {i < loggingStreak % 7 ? '✓' : i + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
}