import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, TrendingUp, Award, Brain, MessageCircle } from 'lucide-react';
import { BrandedLayout, BrandedText, BrandedButton, BrandedProgress, SmartSpendBrand } from './BrandIdentitySystem';
import ProfessionalFinTechDashboard from './ProfessionalFinTechDashboard';
import EmotionalSmartieSystem from './EmotionalSmartieSystem';
import ContextualSmartieReactions from './ContextualSmartieReactions';
import FinancialWellnessScore from './FinancialWellnessScore';
import { Link } from 'wouter';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  priority: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: React.ComponentType<any>;
  unlocked: boolean;
}

interface EnhancedHomeDashboardProps {
  user: {
    name: string;
    financialScore: number;
    streak: number;
    totalSaved: number;
    budgetHealth: 'good' | 'warning' | 'danger';
  };
  budgets: any[];
  goals: any[];
  recentExpenses: any[];
}

const EnhancedHomeDashboard: React.FC<EnhancedHomeDashboardProps> = ({
  user,
  budgets,
  goals,
  recentExpenses
}) => {
  // Use the new professional FinTech design system
  const useProfessionalDesign = true;
  
  if (useProfessionalDesign) {
    return (
      <ProfessionalFinTechDashboard
        user={user}
        budgets={budgets}
        goals={goals}
        recentExpenses={recentExpenses}
      />
    );
  }
  const [currentEvent, setCurrentEvent] = useState<{ type: string; data?: any }>({ type: 'app_open' });
  const [showSmartieChat, setShowSmartieChat] = useState(false);

  // Quick actions prioritized by user behavior and financial health
  const quickActions: QuickAction[] = [
    {
      id: 'smart-purchase',
      title: 'Smart Purchase Decision',
      description: 'Get AI guidance before buying',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      route: '/decisions',
      priority: user.budgetHealth === 'danger' ? 1 : 3
    },
    {
      id: 'chat-smartie',
      title: 'Chat with Smartie',
      description: 'Ask your AI financial coach',
      icon: MessageCircle,
      color: 'from-blue-500 to-purple-500',
      route: '/smartie',
      priority: 2
    },
    {
      id: 'add-expense',
      title: 'Log Expense',
      description: 'Track your spending',
      icon: Plus,
      color: 'from-green-500 to-blue-500',
      route: '/expenses',
      priority: 4
    },
    {
      id: 'goals',
      title: 'Savings Goals',
      description: 'Track your progress',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
      route: '/goals',
      priority: goals.filter(g => g.progress < g.target).length > 0 ? 2 : 5
    },
    {
      id: 'analytics',
      title: 'Smart Analytics',
      description: 'AI-powered insights',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      route: '/analytics',
      priority: 6
    }
  ].sort((a, b) => a.priority - b.priority);

  // Generate contextual achievements
  const achievements: Achievement[] = [
    {
      id: 'streak-7',
      title: '7-Day Warrior',
      description: 'Smart decisions for a week',
      progress: user.streak,
      target: 7,
      icon: Award,
      unlocked: user.streak >= 7
    },
    {
      id: 'saved-100',
      title: 'Century Saver',
      description: 'Save £100 total',
      progress: user.totalSaved,
      target: 100,
      icon: Target,
      unlocked: user.totalSaved >= 100
    },
    {
      id: 'wellness-90',
      title: 'Financial Zen Master',
      description: 'Reach 90+ wellness score',
      progress: user.financialScore,
      target: 90,
      icon: Brain,
      unlocked: user.financialScore >= 90
    }
  ];

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${user.name}! 🌤️`;
    return `Good evening, ${user.name}! 🌙`;
  };

  // Calculate total budget usage
  const totalBudgetUsage = budgets.reduce((total, budget) => {
    const spent = parseFloat(budget.spent) || 0;
    const limit = parseFloat(budget.monthlyLimit) || 1;
    return total + (spent / limit);
  }, 0) / Math.max(budgets.length, 1);

  // Trigger contextual reactions
  useEffect(() => {
    // Reset event after processing
    const timer = setTimeout(() => {
      setCurrentEvent({ type: 'idle' });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrandedLayout variant="default" className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Welcome Header with Emotional Connection */}
        <motion.div 
          className="text-center mb-8"
          {...SmartSpendBrand.animations.gentle}
        >
          <BrandedText.Hero className="mb-2">
            {getTimeBasedGreeting()}
          </BrandedText.Hero>
          <BrandedText.Body className="mb-6">
            Ready to make some smart financial moves today?
          </BrandedText.Body>
          
          {/* Contextual Smartie Integration */}
          <div className="flex justify-center mb-6">
            <EmotionalSmartieSystem
              context={currentEvent}
              userFinancialScore={user.financialScore}
              size="lg"
              className="relative"
            />
          </div>
        </motion.div>

        {/* Financial Wellness Score - Prominent Display */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FinancialWellnessScore
            budgets={budgets}
            streak={user.streak}
            goalsCompleted={goals.filter(g => g.progress >= g.target).length}
            totalGoals={goals.length}
            previousScore={user.financialScore - 5} // Mock previous score
          />
        </motion.div>

        {/* Priority Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BrandedText.Heading className="mb-4 text-center">
            Quick Actions
          </BrandedText.Heading>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.slice(0, 6).map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={action.route}>
                  <Card className={`${SmartSpendBrand.components.card} cursor-pointer group h-full`}>
                    <CardContent className="p-4 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {action.description}
                        </p>
                      </div>
                      {action.priority <= 2 && (
                        <div className="mt-2">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Budget Overview with Emotional Feedback */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className={SmartSpendBrand.components.card}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BrandedText.Heading className="text-lg">
                  Monthly Budget Health
                </BrandedText.Heading>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.budgetHealth === 'good' ? 'bg-green-100 text-green-800' :
                  user.budgetHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.budgetHealth === 'good' ? 'Healthy' :
                   user.budgetHealth === 'warning' ? 'Watch Spending' : 'Overspent'}
                </div>
              </div>
              
              <BrandedProgress
                value={totalBudgetUsage * 100}
                max={100}
                color={user.budgetHealth === 'good' ? 'success' : 
                       user.budgetHealth === 'warning' ? 'warning' : 'danger'}
                showLabel={true}
                label="Overall Budget Usage"
                size="lg"
              />
              
              <BrandedText.Caption className="mt-2 block text-center">
                {user.budgetHealth === 'good' && "Great control! You're staying within your limits."}
                {user.budgetHealth === 'warning' && "Getting close to your limits. Time to be mindful."}
                {user.budgetHealth === 'danger' && "Over budget this month. Let's get back on track!"}
              </BrandedText.Caption>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Progress */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <BrandedText.Heading className="mb-4 text-center">
            Achievement Progress
          </BrandedText.Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`${SmartSpendBrand.components.card} ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {achievement.description}
                    </p>
                    <BrandedProgress
                      value={achievement.progress}
                      max={achievement.target}
                      color={achievement.unlocked ? 'success' : 'primary'}
                      showLabel={true}
                      label={`${achievement.progress}/${achievement.target}`}
                      size="sm"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contextual Smartie Reactions */}
        <ContextualSmartieReactions
          currentEvent={currentEvent}
          userContext={{
            financialScore: user.financialScore,
            streak: user.streak,
            totalSaved: user.totalSaved,
            budgetHealth: user.budgetHealth
          }}
          position="fixed"
        />
        
      </div>
    </BrandedLayout>
  );
};

export default EnhancedHomeDashboard;