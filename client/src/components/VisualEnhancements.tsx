import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { CategoryIcon, getCategoryColor, getCategoryGradient } from './CategoryIcons';
import { 
  TrendingUp, 
  Award, 
  Star, 
  Flame,
  Target,
  Calendar,
  CheckCircle,
  Zap,
  Heart,
  Brain
} from 'lucide-react';

// Enhanced Category Cards with improved spacing and animations
interface EnhancedCategoryCardProps {
  budget: {
    id: string;
    category: string;
    monthlyLimit: string;
    spent: string;
  };
  delay?: number;
}

export function EnhancedCategoryCard({ budget, delay = 0 }: EnhancedCategoryCardProps) {
  const spent = parseFloat(budget.spent || "0");
  const limit = parseFloat(budget.monthlyLimit);
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'from-red-400 to-red-500';
    if (percentage >= 75) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <motion.div
          className="p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with category icon and status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-xl ${getCategoryColor(budget.category)}`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryIcon category={budget.category} size="md" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                  {budget.category}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  £{remaining.toFixed(0)} left
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor()} border-0`}>
              {percentage.toFixed(0)}%
            </Badge>
          </div>

          {/* Progress section with enhanced visuals */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                £{spent.toFixed(0)} of £{limit.toFixed(0)}
              </span>
              <span className={`font-semibold ${
                percentage >= 90 ? 'text-red-600' : 
                percentage >= 75 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {remaining >= 0 ? `£${remaining.toFixed(0)} left` : `£${Math.abs(remaining).toFixed(0)} over`}
              </span>
            </div>
            
            {/* Enhanced progress bar */}
            <div className="relative">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor()} relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: delay + 0.3 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
              </div>
              
              {/* Sparkle effect for good budget control */}
              {percentage < 75 && (
                <motion.div
                  className="absolute -top-1 -right-1 text-yellow-400"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              )}
            </div>
          </div>

          {/* Quick insights */}
          <motion.div
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }}
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-3 h-3" />
              {percentage < 50 ? "Great control! " : 
               percentage < 80 ? "Watch spending " : "Nearly at limit!"}
              <span className="text-gray-400">•</span>
              <span>Updated just now</span>
            </div>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}

// Enhanced Achievement Celebration
interface AchievementCelebrationProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: string;
  };
  onClose: () => void;
}

export function AchievementCelebration({ achievement, onClose }: AchievementCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 max-w-md mx-auto text-center border border-yellow-200 dark:border-yellow-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                y: [-20, -80, -120],
                rotate: [0, 360, 720],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        {/* Smartie celebration */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-6"
        >
          <ModernSmartieAvatar mood="celebrating" size="xl" />
        </motion.div>

        {/* Achievement details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            Achievement Unlocked!
          </h2>
          <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
            {achievement.title}
          </h3>
          <p className="text-yellow-600 dark:text-yellow-400 mb-6">
            {achievement.description}
          </p>
          
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Awesome! 🎉
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Daily Challenge Card with improved design
interface DailyChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    reward: string;
  };
  onComplete: () => void;
}

export function DailyChallengeCard({ challenge, onComplete }: DailyChallengeCardProps) {
  const progressPercentage = (challenge.progress / challenge.target) * 100;
  const isCompleted = progressPercentage >= 100;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg"
              whileHover={{ rotate: 10 }}
            >
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Daily Challenge
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {challenge.reward}
              </p>
            </div>
          </div>
          
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              <CheckCircle className="w-6 h-6" />
            </motion.div>
          )}
        </div>

        {/* Challenge details */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-2">
            {challenge.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {challenge.description}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-purple-600 dark:text-purple-300">
              {challenge.progress}/{challenge.target}
            </span>
          </div>
          
          <div className="w-full h-2 bg-purple-100 dark:bg-purple-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Action button */}
        {isCompleted && (
          <motion.button
            onClick={onComplete}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Claim Reward! 🎁
          </motion.button>
        )}
      </div>
    </Card>
  );
}

// Mood Selector with enhanced design
interface MoodSelectorProps {
  selectedMood?: string;
  onMoodSelect: (mood: string) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-purple-100 hover:bg-purple-200' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-100 hover:bg-blue-200' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-red-100 hover:bg-red-200' },
    { id: 'bored', emoji: '😴', label: 'Bored', color: 'bg-gray-100 hover:bg-gray-200' },
    { id: 'social', emoji: '🎉', label: 'Social', color: 'bg-pink-100 hover:bg-pink-200' }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-700">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <ModernSmartieAvatar mood="happy" size="sm" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">
            How are you feeling?
          </h3>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            This helps me give better advice!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`p-3 rounded-xl text-center transition-all duration-200 ${mood.color} ${
              selectedMood === mood.id 
                ? 'ring-2 ring-orange-400 scale-105' 
                : 'hover:scale-105'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {mood.label}
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}

// Smart Tip Card with Smartie
interface SmartTipCardProps {
  tip: {
    title: string;
    content: string;
    category: 'saving' | 'spending' | 'budgeting' | 'psychology';
  };
  onMarkHelpful: () => void;
  onSaveTip: () => void;
}

export function SmartTipCard({ tip, onMarkHelpful, onSaveTip }: SmartTipCardProps) {
  const getCategoryConfig = () => {
    switch (tip.category) {
      case 'saving':
        return { icon: '💰', color: 'from-green-400 to-emerald-400', bgColor: 'from-green-50 to-emerald-50' };
      case 'spending':
        return { icon: '🛒', color: 'from-blue-400 to-indigo-400', bgColor: 'from-blue-50 to-indigo-50' };
      case 'budgeting':
        return { icon: '📊', color: 'from-purple-400 to-pink-400', bgColor: 'from-purple-50 to-pink-50' };
      default:
        return { icon: '🧠', color: 'from-yellow-400 to-orange-400', bgColor: 'from-yellow-50 to-orange-50' };
    }
  };

  const config = getCategoryConfig();

  return (
    <Card className={`bg-gradient-to-br ${config.bgColor} dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg overflow-hidden relative`}>
      {/* Animated gradient border */}
      <motion.div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mt-1"
          >
            <ModernSmartieAvatar mood="thinking" size="sm" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{config.icon}</span>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {tip.title}
              </h3>
            </div>
            
            <motion.p
              className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {tip.content}
            </motion.p>
            
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={onMarkHelpful}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👍 Helpful
              </motion.button>
              
              <motion.button
                onClick={onSaveTip}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📚 Save
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
}