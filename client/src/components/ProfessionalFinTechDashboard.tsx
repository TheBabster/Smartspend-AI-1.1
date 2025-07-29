import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FinTechLayout, FinTechText, FinTechButton, FinTechProgress, FinTechBadge, FinTechDesign } from './FinTechDesignSystem';
import { ProfessionalIcon, CategoryIcon, StatusIcon, NavigationIcon, IconBadge } from './ProfessionalIconSystem';
import { DelightfulCopy, getRandomMessage, generateContextualMessage } from './DelightfulMicrocopy';
import ExactSmartieAvatar from './ExactSmartieAvatar';
import ExactSmartSpendLogo from './ExactSmartSpendLogo';
import { Link } from 'wouter';

interface ProfessionalFinTechDashboardProps {
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

const ProfessionalFinTechDashboard: React.FC<ProfessionalFinTechDashboardProps> = ({
  user,
  budgets,
  goals,
  recentExpenses
}) => {
  const [currentTip, setCurrentTip] = useState<string>('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Time-based professional greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const name = user.name.split(' ')[0]; // Use first name only
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Calculate financial health status
  const getFinancialHealthStatus = () => {
    if (user.financialScore >= 85) return { status: 'excellent', color: 'success' as const };
    if (user.financialScore >= 70) return { status: 'good', color: 'success' as const };
    if (user.financialScore >= 50) return { status: 'fair', color: 'warning' as const };
    return { status: 'needs attention', color: 'danger' as const };
  };

  const healthStatus = getFinancialHealthStatus();

  // Professional quick actions with contextual priorities
  const quickActions = [
    {
      id: 'smart-decision',
      title: 'Smart Purchase Decision',
      description: 'Get AI guidance before buying',
      icon: 'brain',
      route: '/decisions',
      priority: user.budgetHealth === 'danger' ? 1 : 3,
      variant: 'primary'
    },
    {
      id: 'expense-tracking',
      title: 'Track Expense',
      description: 'Log your spending',
      icon: 'add',
      route: '/expenses',
      priority: 2,
      variant: 'secondary'
    },
    {
      id: 'goals',
      title: 'Savings Goals',
      description: 'Monitor your progress',
      icon: 'target',
      route: '/goals',
      priority: goals.length > 0 ? 3 : 1,
      variant: 'secondary'
    },
    {
      id: 'analytics',
      title: 'Financial Insights',
      description: 'View detailed analytics',
      icon: 'activity',
      route: '/analytics',
      priority: 4,
      variant: 'ghost'
    }
  ].sort((a, b) => a.priority - b.priority);

  // Generate contextual tip
  useEffect(() => {
    const tip = generateContextualMessage({
      type: 'tip'
    });
    setCurrentTip(tip);
  }, []);

  // Auto-hide welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total budget utilization
  const totalBudgetUsage = budgets.length > 0 
    ? budgets.reduce((total, budget) => {
        const spent = parseFloat(budget.spent) || 0;
        const limit = parseFloat(budget.monthlyLimit) || 1;
        return total + (spent / limit);
      }, 0) / budgets.length
    : 0;

  return (
    <FinTechLayout variant="page" className="pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Professional Header with New Logo */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          {...FinTechDesign.animations.fadeInUp}
        >
          <ExactSmartSpendLogo 
            size="lg" 
            animated={true} 
            showText={true} 
          />
        </motion.div>
        {/* Greeting Section */}
        <motion.div 
          className="text-center mb-8"
          {...FinTechDesign.animations.fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <FinTechText.H1 className="mb-2">
            {getTimeBasedGreeting()}
          </FinTechText.H1>
          <FinTechText.Body className="mb-6">
            Ready to make smart financial decisions today?
          </FinTechText.Body>
          
          {/* Smartie with contextual message */}
          <motion.div 
            className="flex justify-center items-center gap-4 mb-6"
            {...FinTechDesign.animations.scaleIn}
          >
            <div className="w-16 h-16">
              <ExactSmartieAvatar 
                mood={user.financialScore >= 75 ? "happy" : user.financialScore >= 50 ? "thinking" : "concerned"} 
                size="lg" 
                animated={true} 
                animationType="greeting" 
              />
            </div>
            
            <AnimatePresence>
              {showWelcomeMessage && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={FinTechDesign.cards.status.info + " p-3 max-w-xs"}
                >
                  <FinTechText.BodySmall>
                    {generateContextualMessage({
                      type: 'budget',
                      budgetHealth: user.budgetHealth
                    })}
                  </FinTechText.BodySmall>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Financial Health Score - Professional Card */}
        <motion.div 
          className="mb-8"
          {...FinTechDesign.animations.fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Card className={FinTechDesign.cards.elevated}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <FinTechText.H3>Financial Wellness Score</FinTechText.H3>
                  <FinTechText.BodySmall className="mt-1">
                    Based on your spending patterns and goals
                  </FinTechText.BodySmall>
                </div>
                <div className="text-right">
                  <FinTechText.Number className="text-3xl">
                    {user.financialScore}
                  </FinTechText.Number>
                  <FinTechText.Caption className="block">
                    out of 100
                  </FinTechText.Caption>
                </div>
              </div>
              
              <FinTechProgress
                value={user.financialScore}
                max={100}
                variant={healthStatus.color}
                size="lg"
                animated={true}
              />
              
              <div className="flex items-center justify-between mt-4">
                <FinTechBadge variant={healthStatus.color}>
                  {healthStatus.status}
                </FinTechBadge>
                <FinTechText.Caption>
                  {user.streak > 0 && `${user.streak} day streak!`}
                </FinTechText.Caption>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Professional Grid */}
        <motion.div 
          className="mb-8"
          {...FinTechDesign.animations.fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <FinTechText.H2 className="mb-4 text-center">
            Quick Actions
          </FinTechText.H2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={action.route}>
                  <Card className={`${FinTechDesign.cards.interactive} h-full`}>
                    <CardContent className="p-4 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ProfessionalIcon 
                            name={action.icon} 
                            category="intelligence"
                            size="md"
                            color="primary"
                          />
                        </div>
                        <FinTechText.H3 className="text-sm mb-1">
                          {action.title}
                        </FinTechText.H3>
                        <FinTechText.Caption>
                          {action.description}
                        </FinTechText.Caption>
                      </div>
                      {action.priority <= 2 && (
                        <div className="mt-2">
                          <FinTechBadge variant="info" className="text-xs">
                            Recommended
                          </FinTechBadge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Budget Overview - Professional Summary */}
        <motion.div 
          className="mb-8"
          {...FinTechDesign.animations.fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <Card className={FinTechDesign.cards.primary}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FinTechText.H3>Monthly Budget Health</FinTechText.H3>
                <FinTechBadge 
                  variant={
                    user.budgetHealth === 'good' ? 'primary' :
                    user.budgetHealth === 'warning' ? 'warning' : 'danger'
                  }
                >
                  {user.budgetHealth === 'good' ? 'On Track' :
                   user.budgetHealth === 'warning' ? 'Watch Spending' : 'Over Budget'}
                </FinTechBadge>
              </div>
              
              <FinTechProgress
                value={totalBudgetUsage * 100}
                max={100}
                variant={
                  user.budgetHealth === 'good' ? 'safe' :
                  user.budgetHealth === 'warning' ? 'warning' : 'danger'
                }
                showLabel={true}
                label="Overall Budget Usage"
                size="lg"
                animated={true}
              />
              
              <FinTechText.BodySmall className="mt-3 text-center">
                {generateContextualMessage({
                  type: 'budget',
                  budgetHealth: user.budgetHealth
                })}
              </FinTechText.BodySmall>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Overview - Professional Cards */}
        {budgets.length > 0 && (
          <motion.div 
            className="mb-8"
            {...FinTechDesign.animations.fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <FinTechText.H3 className="mb-4 text-center">
              Spending Categories
            </FinTechText.H3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {budgets.slice(0, 6).map((budget, index) => {
                const spent = parseFloat(budget.spent || "0");
                const limit = parseFloat(budget.monthlyLimit);
                const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                const remaining = Math.max(0, limit - spent);
                
                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card className={FinTechDesign.cards.primary}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <CategoryIcon 
                            category={budget.category} 
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <FinTechText.H3 className="text-sm truncate">
                              {budget.category}
                            </FinTechText.H3>
                            <FinTechText.Caption>
                              £{remaining.toFixed(0)} left
                            </FinTechText.Caption>
                          </div>
                        </div>
                        
                        <FinTechProgress
                          value={percentage}
                          max={100}
                          variant={percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : 'safe'}
                          size="sm"
                          animated={true}
                        />
                        
                        <div className="flex justify-between mt-2">
                          <FinTechText.Caption>
                            £{spent.toFixed(0)}
                          </FinTechText.Caption>
                          <FinTechText.Caption>
                            £{limit.toFixed(0)}
                          </FinTechText.Caption>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Daily Tip - Professional Card */}
        <motion.div 
          className="mb-8"
          {...FinTechDesign.animations.fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <Card className={FinTechDesign.cards.status.info}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ProfessionalIcon 
                    name="idea" 
                    category="intelligence"
                    size="sm"
                    color="primary"
                  />
                </div>
                <div className="flex-1">
                  <FinTechText.H3 className="text-sm mb-1">
                    Daily Smart Tip
                  </FinTechText.H3>
                  <FinTechText.BodySmall>
                    {currentTip}
                  </FinTechText.BodySmall>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </FinTechLayout>
  );
};

export default ProfessionalFinTechDashboard;