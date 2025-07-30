import { useState, useEffect } from "react";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, MessageCircle, Settings, Sun, Moon, Sparkles, TrendingUp, PiggyBank, Zap, Heart } from "lucide-react";

import CategoryCardEnhanced from "@/components/CategoryCardEnhanced";
import { EnhancedCategoryCard, MoodSelector, SmartTipCard } from "@/components/VisualEnhancements";
import { SlideAnimation, StaggerContainer, AnimatedButton } from "@/components/SlideAnimations";
import { SmartieToast, HoverLift } from "@/components/MicroInteractions";

import EnhancedBudgetRing from "@/components/EnhancedBudgetRing";
import EnhancedHomeDashboard from "@/components/EnhancedHomeDashboard";
import { BrandedLayout } from "@/components/BrandIdentitySystem";

import BottomNav from "@/components/BottomNav";
import EnhancedPurchaseDecisionModal from "@/components/EnhancedPurchaseDecisionModal";
import ExpenseModal from "@/components/ExpenseModal";
import SmartieCorner from "@/components/SmartieCorner";

import AdvancedBudgetVisualizer from "@/components/AdvancedBudgetVisualizer";
import FinancialWellnessScore from "@/components/FinancialWellnessScore";
import EnhancedSmartiePersonality from "@/components/EnhancedSmartiePersonality";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import BrandNewSmartSpendLogo from "@/components/BrandNewSmartSpendLogo";
import ExactSmartSpendLogo from "@/components/ExactSmartSpendLogo";
import SmartieIntelligentChat from "@/components/SmartieIntelligentChat";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";
import PriorityQuickActions from "@/components/PriorityQuickActions";
import FinancialWellnessScoreVisual from "@/components/FinancialWellnessScoreVisual";
import EnhancedSmartieReactions from "@/components/EnhancedSmartieReactions";
import EnhancedQuickActions from "@/components/EnhancedQuickActions";
import SmartieShowcase from "@/components/SmartieShowcase";
import { BounceButton, bounceVariants, LiftCard, liftVariants } from "@/components/MicroAnimations";
import SmartieCoachingSummary from "@/components/SmartieCoachingSummary";
import StreakTracker from "@/components/StreakTracker";
import { CategoryIcon, getCategoryColor } from "@/components/CategoryIcons";
import SmartieLifeAnimations from "@/components/SmartieLifeAnimations";
import { type Budget, type User, type Streak, type Achievement } from "@shared/schema";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSmartieChat, setShowSmartieChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [personalityMode, setPersonalityMode] = useState<'motivational' | 'funny' | 'strict' | 'chill'>('motivational');
  const [showToast, setShowToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'info' | 'celebration';
  } | null>(null);
  const [, navigate] = useLocation();

  const { data: user } = useQuery<User>({ queryKey: ["/api/user"] });
  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ["/api/budgets"] });
  const { data: streaks = [] } = useQuery<Streak[]>({ queryKey: ["/api/streaks"] });
  const { data: achievements = [] } = useQuery<Achievement[]>({ queryKey: ["/api/achievements"] });

  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.monthlyLimit), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent || "0"), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const budgetStreak = streaks.find(s => s.type === "budget");
  const recentAchievement = achievements[achievements.length - 1];

  // Enhanced user context for emotional design
  const userContext = {
    name: user?.name || "SmartSpender",
    financialScore: calculateFinancialScore(),
    streak: budgetStreak?.currentStreak || 0,
    totalSaved: remainingBudget > 0 ? remainingBudget : 0,
    budgetHealth: budgetPercentage > 80 ? 'good' as const : 
                  budgetPercentage > 60 ? 'warning' as const : 'danger' as const,
    mood: 'happy' as const // This would come from user preferences in a real app
  };

  function calculateFinancialScore(): number {
    if (!budgets.length) return 75;
    
    const budgetScore = Math.max(0, Math.min(100, budgetPercentage));
    const streakScore = Math.min(20, (budgetStreak?.currentStreak || 0) * 2);
    const achievementScore = Math.min(15, achievements.length * 3);
    
    return Math.round(budgetScore * 0.65 + streakScore + achievementScore);
  }

  // Check if we should use the enhanced emotional dashboard
  const shouldUseEnhancedDashboard = true; // Enable the new emotional design system

  if (shouldUseEnhancedDashboard) {
    return (
      <>
        <EnhancedHomeDashboard
          user={userContext}
          budgets={budgets}
          goals={[]} // Will be populated when goals are available
          recentExpenses={[]} // Will be populated when expenses are available
        />
        <BottomNav currentTab="home" />
        
        {/* Modals */}
        <EnhancedPurchaseDecisionModal 
          open={showPurchaseModal} 
          onOpenChange={setShowPurchaseModal} 
        />
        <ExpenseModal 
          open={showExpenseModal} 
          onOpenChange={setShowExpenseModal} 
        />
        {showSmartieChat && (
          <SmartieIntelligentChat onClose={() => setShowSmartieChat(false)} />
        )}
      </>
    );
  }

  return (
    <ResponsiveLayout className="bg-gray-50 dark:bg-gray-900 pb-20" maxWidth="xl" padding="none">
      {/* Header with Enhanced Brand Logo */}
      <motion.div
        className="bg-gradient-to-r from-purple-800 via-pink-600 to-blue-700 text-white shadow-lg relative overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-pink-800/70" />
        <div className="absolute inset-0 opacity-15">
          <motion.div 
            className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <ExactSmartSpendLogo size="lg" animated={true} showText={true} />
            
            <div className="flex items-center gap-4">
      
              
              {/* User Welcome */}
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-white/90 font-medium">{getGreeting()}</p>
                <p className="font-bold text-white text-lg">{user?.username || "Financial Explorer"}</p>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Enhanced dashboard stats with budget ring */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                You have £{remainingBudget.toFixed(0)} left this month
              </h2>
              <p className="text-white/95 text-base font-medium drop-shadow-sm">
                {budgetPercentage >= 80 ? "Excellent budget control!" : budgetPercentage >= 60 ? "Good progress!" : "Keep an eye on spending"}
              </p>
            </div>
            <EnhancedBudgetRing 
              percentage={budgetPercentage} 
              size="lg"
              showConfetti={budgetPercentage >= 80}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content with Background Effects */}
      <main className="px-6 -mt-6 relative z-20">
        {/* Background Floating Sparkles for High Scores */}
        {calculateFinancialScore() >= 80 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400/60 text-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  repeatDelay: Math.random() * 3 + 2
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
        {/* Enhanced Quick Actions - No More Placeholders! */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`shadow-xl border-0 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
            <CardContent className="p-6">
              <motion.h3 
                className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Quick Actions
              </motion.h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Log Expense */}
                <motion.button
                  onClick={() => {
                    setShowExpenseModal(true);
                    setShowToast({
                      message: "Let's track your spending together! I'll help you understand your habits 💙",
                      type: 'info'
                    });
                  }}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600' : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500'} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Plus size={24} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">Log Expense</h4>
                      <p className="text-sm opacity-90">Track spending</p>
                    </div>
                  </div>
                </motion.button>

                {/* Smart Purchase Decision */}
                <motion.button
                  onClick={() => {
                    setShowPurchaseModal(true);
                    setShowToast({
                      message: "Smart choice asking me first! Let's make sure this purchase aligns with your goals 🎯",
                      type: 'celebration'
                    });
                  }}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500'} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Zap size={24} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">Smart Decision</h4>
                      <p className="text-sm opacity-90">AI purchase help</p>
                    </div>
                  </div>
                </motion.button>

                {/* Set Goal */}
                <motion.button
                  onClick={() => navigate('/goals')}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600' : 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500'} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Target size={24} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">Set Goal</h4>
                      <p className="text-sm opacity-90">Plan savings</p>
                    </div>
                  </div>
                </motion.button>

                {/* Ask Smartie */}
                <motion.button
                  onClick={() => setShowSmartieChat(true)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600' : 'bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500'} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <MessageCircle size={24} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">Ask Smartie</h4>
                      <p className="text-sm opacity-90">AI coach chat</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Financial Wellness Score - Clickable for Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <motion.div
            onClick={() => setShowScoreModal(true)}
            className="cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`shadow-lg border-0 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <ModernSmartieAvatar mood="happy" size="lg" />
                    </motion.div>
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Financial Wellness Score
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Click to see breakdown
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.div 
                      className={`text-3xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {calculateFinancialScore()}
                    </motion.div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {calculateFinancialScore() >= 80 ? "Excellent!" : 
                       calculateFinancialScore() >= 60 ? "Good work!" : "Keep improving!"}
                    </p>
                  </div>
                </div>
                
                {/* Sparkle effects for high scores */}
                {calculateFinancialScore() >= 80 && (
                  <motion.div
                    className="absolute top-4 right-4 text-yellow-400 text-lg"
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    ✨
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Score Breakdown Modal */}
        {showScoreModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowScoreModal(false)}
          >
            <motion.div
              className={`max-w-md w-full rounded-2xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Your Financial Wellness Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Budget Control</span>
                  <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {Math.round(budgetPercentage)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Streak Consistency</span>
                  <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {Math.min((budgetStreak?.currentStreak || 0) * 10, 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Achievement Progress</span>
                  <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {Math.min(achievements.length * 15, 100)}%
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setShowScoreModal(false)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Mood Tracker - Prominently Placed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? 'bg-gradient-to-r from-indigo-800/90 to-purple-800/90' : 'bg-gradient-to-r from-indigo-100 to-purple-100'} backdrop-blur-sm`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                How are you feeling today?
              </h3>
              <div className="flex justify-between items-center">
                {['😢', '😐', '😊', '😄', '🤩'].map((emoji, index) => (
                  <motion.button
                    key={index}
                    className={`w-12 h-12 rounded-full text-2xl transition-all duration-300 ${darkMode ? 'hover:bg-white/20' : 'hover:bg-white/50'} flex items-center justify-center`}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ModernSmartieAvatar mood="happy" size="sm" />
                </motion.div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Tracking your mood helps Smartie give better advice!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Smart Tip Card */}
        <SlideAnimation direction="right" delay={0.4} className="mb-6">
          <SmartTipCard
            tip={{
              title: "Daily Smart Tip",
              content: "Try the \"24-hour rule\" - wait a full day before making any purchase over £50. You'll be surprised how many impulse buys you avoid!",
              category: "psychology"
            }}
            onMarkHelpful={() => {
              console.log('Marked as helpful');
              setShowToast({
                message: "Thanks for the feedback! This helps me learn what tips are most useful 📚",
                type: 'success'
              });
            }}
            onSaveTip={() => {
              console.log('Tip saved');
              setShowToast({
                message: "Tip saved to your personal collection! You can review it anytime",
                type: 'info'
              });
            }}
          />
        </SlideAnimation>

        {/* Smartie Introduction */}
        {recentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="shadow-lg border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                    <span className="text-white text-lg">{recentAchievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{recentAchievement.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{recentAchievement.description}</p>
                  </div>
                  <div className="text-2xl">✨</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Smartie Corner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <SmartieCorner />
        </motion.div>

        {/* Smartie Coaching Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <SmartieCoachingSummary
            weeklySpending={totalSpent}
            smartPurchases={Math.floor(Math.random() * 8) + 2}
            streak={userContext.streak}
            personalityMode={personalityMode}
            onPersonalityChange={setPersonalityMode}
          />
        </motion.div>

        {/* Streak Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-6"
        >
          <StreakTracker
            loggingStreak={userContext.streak}
            smartSpendingScore={userContext.financialScore}
            budgetAdherence={budgetPercentage}
            goalProgress={75}
            showCelebration={userContext.streak >= 3}
          />
        </motion.div>

        {/* Enhanced Category Spending Cards */}
        <SlideAnimation direction="bottom" delay={0.6}>
          <StaggerContainer className="space-y-4 mb-6">
            {budgets.map((budget, index) => (
              <HoverLift key={budget.id} lift="medium">
                <EnhancedCategoryCard 
                  budget={budget} 
                  delay={index * 0.1}
                />
              </HoverLift>
            ))}
          </StaggerContainer>
        </SlideAnimation>

        {/* Mood Selector */}
        <SlideAnimation direction="left" delay={0.8} className="mb-6">
          <MoodSelector
            selectedMood={userContext.mood || undefined}
            onMoodSelect={(mood) => {
              console.log('Selected mood:', mood);
              setShowToast({
                message: `Got it! Understanding your ${mood} mood helps me give better spending advice`,
                type: 'success'
              });
            }}
          />
        </SlideAnimation>

        {/* Financial Wellness Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-6"
        >
          <FinancialWellnessScore
            budgets={budgets}
            streak={budgetStreak?.currentStreak || 0}
            goalsCompleted={achievements.filter(a => a.unlockedAt !== null).length}
            totalGoals={achievements.length}
            previousScore={85} // This would come from historical data
          />
        </motion.div>

        {/* Advanced Budget Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mb-6"
        >
          <AdvancedBudgetVisualizer 
            budgets={budgets}
            totalIncome={user?.monthlyIncome ? parseFloat(user.monthlyIncome) : 3000}
          />
        </motion.div>

        {/* Enhanced Quick Actions Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-6"
        >
          <EnhancedQuickActions
            onPurchaseDecision={() => setShowPurchaseModal(true)}
            onAddExpense={() => setShowExpenseModal(true)}
            onViewGoals={() => navigate('/goals')}
            onViewAnalytics={() => navigate('/analytics')}
            onChatWithSmartie={() => setShowSmartieChat(true)}
            userSpendingData={{
              totalSpent,
              budgetUsed: budgetPercentage,
              streak: budgetStreak?.currentStreak || 0
            }}
          />
        </motion.div>

        {/* Enhanced Stats Cards with Feedback Button */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <motion.div whileHover={{ scale: 1.02, y: -2 }}>
            <Card className={`shadow-lg border-0 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
              <CardContent className="p-4 text-center">
                <motion.div 
                  className="text-2xl mb-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🎯
                </motion.div>
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {budgetStreak?.currentStreak || 0}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, y: -2 }}>
            <Card className={`shadow-lg border-0 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
              <CardContent className="p-4 text-center">
                <motion.div 
                  className="text-2xl mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  💰
                </motion.div>
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  £{(totalBudget - totalSpent).toFixed(0)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Saved</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* App Store Polish: Feedback Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-6 text-center"
        >
          <motion.button
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} text-white shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>Suggest a Feature</span>
            </div>
          </motion.button>
        </motion.div>
      </main>

      {/* Modals */}
      <EnhancedPurchaseDecisionModal 
        open={showPurchaseModal} 
        onOpenChange={setShowPurchaseModal} 
      />
      <ExpenseModal 
        open={showExpenseModal} 
        onOpenChange={setShowExpenseModal} 
      />
      {showSmartieChat && (
        <SmartieIntelligentChat onClose={() => setShowSmartieChat(false)} />
      )}

      {/* Enhanced Smartie Personality */}
      <EnhancedSmartiePersonality
        userMood="neutral"
        recentSpending={totalSpent}
        budgetHealth={budgetPercentage > 90 ? "danger" : budgetPercentage > 75 ? "warning" : "good"}
        streak={budgetStreak?.currentStreak || 0}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <SmartieToast
            message={showToast.message}
            type={showToast.type}
            onClose={() => setShowToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav currentTab="home" />
    </ResponsiveLayout>
  );
}
