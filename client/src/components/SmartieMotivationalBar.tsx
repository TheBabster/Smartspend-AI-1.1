import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SmartieAnimated from "./SmartieAnimated";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MotivationalMessage {
  type: 'daily-goal' | 'encouragement' | 'warning' | 'celebration';
  message: string;
  mood: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'proud' | 'sleepy';
  emoji: string;
}

export default function SmartieMotivationalBar() {
  const [currentMessage, setCurrentMessage] = useState<MotivationalMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: budgets } = useQuery({ queryKey: ['/api/budgets'] });
  const { data: streaks } = useQuery({ queryKey: ['/api/streaks'] });

  useEffect(() => {
    if (isDismissed || !budgets) return;

    // Calculate spending status
    const totalSpent = Array.isArray(budgets) ? budgets.reduce((sum: number, budget: any) => sum + parseFloat(budget.spent), 0) : 0;
    const totalBudget = Array.isArray(budgets) ? budgets.reduce((sum: number, budget: any) => sum + parseFloat(budget.monthlyLimit), 0) : 1;
    const spendingPercentage = (totalSpent / totalBudget) * 100;
    
    const currentStreak = Array.isArray(streaks) && streaks.length > 0 ? streaks[0].currentStreak : 0;

    let message: MotivationalMessage;

    // Determine message based on spending status and streak
    if (spendingPercentage > 90) {
      message = {
        type: 'warning',
        message: "Whoa! You're close to your budget limit. Let's be extra careful today! 🎯",
        mood: 'concerned',
        emoji: '⚠️'
      };
    } else if (spendingPercentage < 50 && currentStreak >= 7) {
      message = {
        type: 'celebration',
        message: `Amazing! ${currentStreak} day streak and great budget control! You're a financial superstar! ⭐`,
        mood: 'celebrating',
        emoji: '🎉'
      };
    } else if (currentStreak >= 3) {
      message = {
        type: 'encouragement',
        message: `${currentStreak} days strong! Today's goal: no impulse buys! You've got this 💪`,
        mood: 'proud',
        emoji: '🏆'
      };
    } else if (spendingPercentage > 75) {
      message = {
        type: 'warning',
        message: "Getting close to budget limits. How about we skip one small purchase today? 🤔",
        mood: 'thinking',
        emoji: '💭'
      };
    } else {
      const dailyGoals = [
        "Today's mission: track every expense! Small steps, big wins! 📝",
        "Let's make today a 'no regret purchase' day! Think before you buy! 🧠",
        "Challenge: Find one way to save £5 today! I believe in you! 💰",
        "Every smart choice builds your financial future! Keep it up! 🌟"
      ];
      
      const randomGoal = dailyGoals[Math.floor(Math.random() * dailyGoals.length)];
      message = {
        type: 'daily-goal',
        message: randomGoal,
        mood: 'happy',
        emoji: '🎯'
      };
    }

    setCurrentMessage(message);
    setIsVisible(true);

    // Auto-dismiss after 10 seconds unless it's a warning
    if (message.type !== 'warning') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [budgets, streaks, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!currentMessage || isDismissed) return null;

  const getBackgroundColor = () => {
    switch (currentMessage.type) {
      case 'warning':
        return 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800';
      case 'celebration':
        return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800';
      case 'encouragement':
        return 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
          className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-md ${getBackgroundColor()} backdrop-blur-md rounded-2xl border shadow-lg`}
        >
          <div className="p-4 flex items-center gap-3">
            {/* Animated Smartie */}
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <SmartieAnimated 
                mood={currentMessage.mood} 
                size="sm"
                isIdle={false}
              />
            </motion.div>

            {/* Message Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-1"
              >
                <span className="text-lg">{currentMessage.emoji}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Smartie Says
                </span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed"
              >
                {currentMessage.message}
              </motion.p>
            </div>

            {/* Dismiss Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="w-8 h-8 p-0 hover:bg-white/20 dark:hover:bg-black/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar for auto-dismiss */}
          {currentMessage.type !== 'warning' && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-2xl"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}