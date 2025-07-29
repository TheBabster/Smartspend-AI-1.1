import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

import { Trophy, Target, Coins, Calendar, TrendingUp, Star } from "lucide-react";

interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

export default function BadgeSystem() {
  const [newlyUnlocked, setNewlyUnlocked] = useState<BadgeData[]>([]);
  
  const { data: budgets } = useQuery({ queryKey: ['/api/budgets'] });
  const { data: streaks } = useQuery({ queryKey: ['/api/streaks'] });
  const { data: achievements } = useQuery({ queryKey: ['/api/achievements'] });

  // Calculate badge progress based on real data
  const calculateBadges = (): BadgeData[] => {
    if (!budgets || !streaks) return [];

    const totalSpent = Array.isArray(budgets) ? budgets.reduce((sum: number, budget: any) => sum + parseFloat(budget.spent), 0) : 0;
    const totalBudget = Array.isArray(budgets) ? budgets.reduce((sum: number, budget: any) => sum + parseFloat(budget.monthlyLimit), 0) : 1;
    const totalSaved = totalBudget - totalSpent;
    const currentStreak = Array.isArray(streaks) && streaks.length > 0 ? streaks[0].currentStreak : 0;
    const spendingPercentage = (totalSpent / totalBudget) * 100;

    return [
      {
        id: 'first-save-100',
        title: 'First £100 Saved',
        description: 'Saved your first £100 this month',
        icon: '💰',
        color: 'from-green-400 to-emerald-600',
        isUnlocked: totalSaved >= 100,
        progress: Math.min(totalSaved, 100),
        maxProgress: 100
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintained budget for 7 days straight',
        icon: '🔥',
        color: 'from-orange-400 to-red-600',
        isUnlocked: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        maxProgress: 7
      },
      {
        id: 'budget-master',
        title: 'Budget Master',
        description: 'Stayed under 80% of budget',
        icon: '🎯',
        color: 'from-blue-400 to-purple-600',
        isUnlocked: spendingPercentage <= 80,
        progress: spendingPercentage <= 80 ? 100 : Math.max(0, 100 - spendingPercentage),
        maxProgress: 100
      },
      {
        id: 'impulse-resister',
        title: 'Impulse Resister',
        description: 'Said no to 5 purchase decisions',
        icon: '🛡️',
        color: 'from-purple-400 to-pink-600',
        isUnlocked: false, // Would need decision tracking
        progress: 3, // Mock progress
        maxProgress: 5
      },
      {
        id: 'month-champion',
        title: 'Month Champion',
        description: 'Maintained streak for 30 days',
        icon: '👑',
        color: 'from-yellow-400 to-orange-600',
        isUnlocked: currentStreak >= 30,
        progress: Math.min(currentStreak, 30),
        maxProgress: 30
      },
      {
        id: 'savings-star',
        title: 'Savings Star',
        description: 'Saved £500 this month',
        icon: '⭐',
        color: 'from-pink-400 to-rose-600',
        isUnlocked: totalSaved >= 500,
        progress: Math.min(totalSaved, 500),
        maxProgress: 500
      }
    ];
  };

  const badges = calculateBadges();

  // Check for newly unlocked badges
  useEffect(() => {
    const unlockedBadges = badges.filter(badge => badge.isUnlocked);
    const previouslyUnlocked = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    
    const newUnlocks = unlockedBadges.filter(badge => 
      !previouslyUnlocked.includes(badge.id)
    );

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges.map(b => b.id)));
      
      // Clear notification after 5 seconds
      setTimeout(() => setNewlyUnlocked([]), 5000);
    }
  }, [badges]);

  const BadgeCard = ({ badge }: { badge: BadgeData }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`relative overflow-hidden ${badge.isUnlocked ? 'opacity-100' : 'opacity-60'}`}
    >
      <Card className={`p-4 bg-gradient-to-br ${badge.color} text-white border-0 shadow-lg`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{badge.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">{badge.title}</h4>
            <p className="text-xs opacity-90">{badge.description}</p>
          </div>
          {badge.isUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-5 h-5" />
            </motion.div>
          )}
        </div>
        
        {/* Progress Bar */}
        {badge.maxProgress && !badge.isUnlocked && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{badge.progress}/{badge.maxProgress}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${((badge.progress || 0) / badge.maxProgress) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Unlock effect */}
        {badge.isUnlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </Card>
    </motion.div>
  );

  return (
    <div>
      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <BadgeCard badge={badge} />
          </motion.div>
        ))}
      </div>

      {/* Newly Unlocked Badge Notification */}
      <AnimatePresence>
        {newlyUnlocked.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-2xl">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-lg mb-1">Badge Unlocked!</h3>
                <h4 className="font-semibold">{badge.title}</h4>
                <p className="text-sm opacity-90">{badge.description}</p>
              </motion.div>

              {/* Confetti effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 2,
                    delay: Math.random() * 0.5
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}