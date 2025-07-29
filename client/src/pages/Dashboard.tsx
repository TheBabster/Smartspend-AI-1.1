import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, TrendingUp, Target } from "lucide-react";
import BudgetRing from "@/components/BudgetRing";
import EnhancedBudgetRing from "@/components/EnhancedBudgetRing";
import CategoryCard from "@/components/CategoryCard";
import CategoryCardEnhanced from "@/components/CategoryCardEnhanced";
import ThemeToggle from "@/components/ThemeToggle";
import SmartieMotivationalBar from "@/components/SmartieMotivationalBar";
import BadgeSystem from "@/components/BadgeSystem";
import BottomNav from "@/components/BottomNav";
import EnhancedPurchaseDecisionModal from "@/components/EnhancedPurchaseDecisionModal";
import ExpenseModal from "@/components/ExpenseModal";
import SmartieCorner from "@/components/SmartieCorner";
import SmartieAnimated from "@/components/SmartieAnimated";
import AnimatedButton from "@/components/AnimatedButton";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";
import { type Budget, type User, type Streak, type Achievement } from "@shared/schema";

export default function Dashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header with Gradient */}
      <motion.header 
        className="gradient-bg text-white px-6 py-8 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.name || "Alex"}! 👋
              </h1>
              <p className="text-white/80 text-sm">
                You have £{remainingBudget.toFixed(0)} left to spend this month
              </p>
            </div>
            <EnhancedBudgetRing 
              percentage={budgetPercentage} 
              size="lg"
              showConfetti={budgetPercentage >= 80}
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-6 -mt-6 relative z-20">
        {/* Motivational Bar */}
        <SmartieMotivationalBar />
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

        {/* Enhanced Quick Actions Panel */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GlassmorphicCard 
            gradient="purple" 
            glow 
            className="p-0 border-0 shadow-glow-purple"
          >
            <AnimatedButton
              onClick={() => setShowPurchaseModal(true)}
              className="w-full h-full p-6 bg-transparent hover:bg-white/10 rounded-2xl border-0"
              variant="ghost"
              glowOnHover
            >
              <div className="flex items-center gap-4 w-full">
                <motion.div 
                  className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingCart className="text-white" size={20} />
                </motion.div>
                <div className="text-left text-white">
                  <h3 className="font-semibold">Smart Purchase Decision</h3>
                  <p className="text-sm text-white/80">Get Smartie's AI advice before buying</p>
                </div>
              </div>
            </AnimatedButton>
          </GlassmorphicCard>

          <GlassmorphicCard 
            gradient="green" 
            glow 
            className="p-0 border-0 shadow-glow-blue"
          >
            <AnimatedButton
              onClick={() => setShowExpenseModal(true)}
              className="w-full h-full p-6 bg-transparent hover:bg-white/10 rounded-2xl border-0"
              variant="ghost"
              glowOnHover
            >
              <div className="flex items-center gap-4 w-full">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="text-white" size={20} />
                </motion.div>
                <div className="text-left text-white">
                  <h3 className="font-semibold">Add Expense</h3>
                  <p className="text-sm text-white/80">Track your spending journey</p>
                </div>
              </div>
            </AnimatedButton>
          </GlassmorphicCard>
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
              <div className="text-lg font-semibold">
                {budgetStreak?.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-lg font-semibold">
                £{(totalBudget - totalSpent).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Saved</div>
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

      {/* Bottom Navigation */}
      <BottomNav currentTab="home" />
    </div>
  );
}
