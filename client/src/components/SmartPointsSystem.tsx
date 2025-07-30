import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  Award,
  Zap,
  Target,
  Star,
  TrendingUp,
  Gift,
  Crown,
  Flame,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface SmartPointsSystemProps {
  currentPoints: number;
  weeklyPoints: number;
  streak: number;
  level: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    unlockedAt?: string;
    progress?: number;
    target?: number;
  }>;
  onClaimReward: (rewardId: string) => void;
}

export default function SmartPointsSystem({ 
  currentPoints, 
  weeklyPoints, 
  streak, 
  level,
  achievements,
  onClaimReward 
}: SmartPointsSystemProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPointsEarned, setShowPointsEarned] = useState<{
    points: number;
    reason: string;
  } | null>(null);

  // Points needed for next level (exponential growth)
  const pointsForNextLevel = level * 100 + (level - 1) * 50;
  const pointsInCurrentLevel = currentPoints % pointsForNextLevel;
  const progressToNextLevel = (pointsInCurrentLevel / pointsForNextLevel) * 100;

  // Available rewards based on points
  const availableRewards = [
    {
      id: 'theme-unlock',
      name: 'Cosmic Theme',
      cost: 500,
      icon: '🌌',
      description: 'Unlock the cosmic purple theme',
      available: currentPoints >= 500
    },
    {
      id: 'smartie-hat',
      name: 'Smartie Top Hat',
      cost: 300,
      icon: '🎩',
      description: 'Give Smartie a dapper top hat',
      available: currentPoints >= 300
    },
    {
      id: 'premium-tips',
      name: 'Premium Tips',
      cost: 750,
      icon: '💎',
      description: 'Unlock advanced financial tips',
      available: currentPoints >= 750
    },
    {
      id: 'streak-shield',
      name: 'Streak Shield',
      cost: 200,
      icon: '🛡️',
      description: 'Protect your streak for one bad day',
      available: currentPoints >= 200
    }
  ];

  // Simulate earning points
  const earnPoints = (points: number, reason: string) => {
    setShowPointsEarned({ points, reason });
    setTimeout(() => setShowPointsEarned(null), 3000);
  };

  // Level tier colors and titles
  const getLevelInfo = () => {
    if (level >= 20) return { color: 'text-purple-600 bg-purple-100', title: 'Financial Guru', icon: '👑' };
    if (level >= 15) return { color: 'text-indigo-600 bg-indigo-100', title: 'Smart Saver', icon: '🧠' };
    if (level >= 10) return { color: 'text-blue-600 bg-blue-100', title: 'Budget Master', icon: '⭐' };
    if (level >= 5) return { color: 'text-green-600 bg-green-100', title: 'Wise Spender', icon: '🌱' };
    return { color: 'text-gray-600 bg-gray-100', title: 'Learning', icon: '📚' };
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="space-y-6">
      {/* Points earned animation */}
      <AnimatePresence>
        {showPointsEarned && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <p className="font-bold">+{showPointsEarned.points} Smart Points!</p>
                  <p className="text-sm opacity-90">{showPointsEarned.reason}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center max-w-md"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">Level Up!</h2>
              <p className="text-yellow-700 mb-4">
                You've reached level {level}!
              </p>
              <Button
                onClick={() => setShowLevelUp(false)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                Awesome! 🎉
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main points dashboard */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700 overflow-hidden">
        <div className="p-6">
          {/* Header with level and Smartie */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: streak > 5 ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <ModernSmartieAvatar 
                  mood={streak > 7 ? 'celebrating' : streak > 3 ? 'happy' : 'thinking'} 
                  size="lg" 
                />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${levelInfo.color} border-0 px-3 py-1`}>
                    <span className="mr-1">{levelInfo.icon}</span>
                    Level {level} - {levelInfo.title}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPoints.toLocaleString()} Smart Points earned
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">
                +{weeklyPoints}
              </p>
              <p className="text-sm text-gray-600">This week</p>
            </div>
          </div>

          {/* Progress to next level */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress to Level {level + 1}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {pointsInCurrentLevel}/{pointsForNextLevel}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Streak counter */}
          <motion.div
            className="flex items-center gap-2 mb-6 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg"
            animate={streak > 0 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            <span className="font-semibold text-orange-800 dark:text-orange-200">
              {streak} day smart spending streak!
            </span>
            {streak > 7 && (
              <Badge className="bg-orange-500 text-white ml-auto">
                On fire! 🔥
              </Badge>
            )}
          </motion.div>

          {/* Recent achievements */}
          <div className="grid grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 ${
                  achievement.unlockedAt 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className={`text-xs font-medium ${
                    achievement.unlockedAt ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.name}
                  </span>
                </div>
                
                {achievement.progress !== undefined && achievement.target && !achievement.unlockedAt && (
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.target}
                    </p>
                  </div>
                )}
                
                {achievement.unlockedAt && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Unlocked!</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Rewards shop */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <div className="p-6">
          <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Reward Shop
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  reward.available
                    ? 'bg-white border-purple-200 hover:border-purple-300 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{reward.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {reward.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${reward.available ? 'text-purple-600' : 'text-gray-400'}`}>
                      {reward.cost}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => onClaimReward(reward.id)}
                  disabled={!reward.available}
                  className={`w-full ${
                    reward.available
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  size="sm"
                >
                  {reward.available ? 'Claim Reward' : 'Need More Points'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}