import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import CategoryCardEnhanced from "@/components/CategoryCardEnhanced";
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
import { type Budget, type User, type Streak, type Achievement } from "@shared/schema";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSmartieChat, setShowSmartieChat] = useState(false);
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
                  budgetPercentage > 60 ? 'warning' as const : 'danger' as const
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

      {/* Main Content */}
      <main className="px-6 -mt-6 relative z-20">
        {/* PRIORITY: Main Functions Section - Moved to TOP per user request */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <PriorityQuickActions
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

        {/* Enhanced Financial Wellness Score with Smartie */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <FinancialWellnessScoreVisual
            score={75}
            previousScore={65}
            breakdown={{
              budgetAdherence: Math.round(budgetPercentage),
              savingsProgress: 68,
              spendingWisdom: 82,
              streakConsistency: budgetStreak?.currentStreak ? Math.min(budgetStreak.currentStreak * 5, 100) : 45
            }}
          />
        </motion.div>
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

        {/* Category Spending Cards */}
        <motion.div 
          className="space-y-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {budgets.map((budget, index) => (
            <CategoryCardEnhanced 
              key={budget.id} 
              budget={budget} 
              delay={index * 0.1}
            />
          ))}
        </motion.div>

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

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-semibold text-high-contrast">
                {budgetStreak?.currentStreak || 0}
              </div>
              <div className="text-sm text-medium-contrast">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-lg font-semibold text-high-contrast">
                £{(totalBudget - totalSpent).toFixed(0)}
              </div>
              <div className="text-sm text-medium-contrast">Saved</div>
            </CardContent>
          </Card>
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
      <SmartieIntelligentChat
        isOpen={showSmartieChat}
        onClose={() => setShowSmartieChat(false)}
        userSpendingData={{
          totalSpent,
          budgetUsed: budgetPercentage,
          streak: budgetStreak?.currentStreak || 0,
          recentCategory: "general"
        }}
      />

      {/* Enhanced Smartie Personality */}
      <EnhancedSmartiePersonality
        userMood="neutral"
        recentSpending={totalSpent}
        budgetHealth={budgetPercentage > 90 ? "danger" : budgetPercentage > 75 ? "warning" : "good"}
        streak={budgetStreak?.currentStreak || 0}
      />

      {/* Bottom Navigation */}
      <BottomNav currentTab="home" />
    </ResponsiveLayout>
  );
}
