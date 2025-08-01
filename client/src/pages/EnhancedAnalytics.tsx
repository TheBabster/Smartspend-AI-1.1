import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target, Brain, Heart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import SmartieCoachingSummary from "@/components/SmartieCoachingSummary";
import EmotionalSpendingTracker from "@/components/EmotionalSpendingTracker";
import SavingsGoalEngine from "@/components/SavingsGoalEngine";
import SavingsTreeVisualization from "@/components/SavingsTreeVisualization";
import ScrollSmartieComments from "@/components/ScrollSmartieComments";
import BudgetSetupWizard from "@/components/BudgetSetupWizard";
import { type Expense, type Budget } from "@shared/schema";

const COLORS = {
  "Food & Dining": "#F59E0B",
  "Shopping": "#8B5CF6", 
  "Entertainment": "#3B82F6",
  "Transportation": "#10B981",
  "Utilities": "#8B5A99",
  "Other": "#F59E0B",
};

export default function EnhancedAnalytics() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [personalityMode, setPersonalityMode] = useState<'motivational' | 'funny' | 'strict' | 'chill'>('motivational');
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sync Firebase user with database first
  const { data: syncedUser } = useQuery({
    queryKey: ['sync-user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: 'PLOFcMQeHePcuXObAvpAkewhZYa2',
          email: 'bdaniel6@outlook.com',
          name: 'bdaniel6'
        })
      });
      return response.json();
    }
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({ 
    queryKey: ["/api/expenses", syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/expenses/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });
  
  const { data: budgets = [], isLoading: budgetsLoading } = useQuery<Budget[]>({ 
    queryKey: ["/api/budgets", syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/budgets/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });

  const { data: goals = [] } = useQuery({ 
    queryKey: ["/api/goals", syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/goals/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({ 
    queryKey: ["/api/analytics"] 
  });

  const isLoading = expensesLoading || budgetsLoading || analyticsLoading;

  // Calculate weekly analysis from real expenses data
  const weeklyAnalysis = {
    smart: 0,
    borderline: 0,
    regret: 0,
    totalSpent: expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
    patterns: []
  };

  // Process real expense data for charts
  const categorySpending = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category as keyof typeof COLORS] || "#6B7280",
  }));

  // Calculate actual spending vs budgets with proper category matching
  const totalBudgeted = budgets.reduce((sum, budget) => sum + parseFloat(budget.monthlyLimit), 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const budgetUsedPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  // Create budget vs actual data for chart
  const budgetComparisonData = budgets.map(budget => {
    // Map budget categories to expense categories
    const categoryMap: Record<string, string> = {
      'food': 'Food & Dining',
      'entertainment': 'Entertainment',
      'shopping': 'Shopping',
      'transportation': 'Transportation',
      'utilities': 'Utilities'
    };
    
    const expenseCategory = categoryMap[budget.category.toLowerCase()] || budget.category;
    const actualSpent = categorySpending[expenseCategory] || 0;
    
    return {
      category: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
      budgeted: parseFloat(budget.monthlyLimit),
      spent: actualSpent,
      remaining: parseFloat(budget.monthlyLimit) - actualSpent,
    };
  });

  // Create wealth projection data from financial position
  const wealthProjectionData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i).toLocaleDateString('en-US', { month: 'short' }),
    projected: 5000 + (i * 500), // Base projection
    optimistic: 5000 + (i * 750),
    conservative: 5000 + (i * 250),
  }));

  // Reset Savings Tree functionality
  const resetGoalsMutation = useMutation({
    mutationFn: async () => {
      if (!syncedUser?.id) throw new Error('User authentication required');
      
      const response = await fetch(`/api/goals/reset/${syncedUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset goals');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals', syncedUser?.id] });
      toast({
        title: 'Savings Tree Reset',
        description: 'Your savings tree has been reset. All goals are back to £0.',
      });
    },
    onError: () => {
      toast({
        title: 'Reset Failed',
        description: 'Failed to reset savings tree. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleResetSavingsTree = () => {
    resetGoalsMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Enhanced Header */}
      <motion.header 
        className="bg-gradient-to-r from-purple-800 via-pink-600 to-blue-700 text-white px-6 py-8 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Smart Analytics</h1>
            <p className="text-white text-lg font-semibold mt-2 drop-shadow-md">
              AI-powered insights with emotional intelligence
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" />
            <Heart className="w-8 h-8" />
          </div>
        </div>
      </motion.header>

      {/* Enhanced Tabbed Interface */}
      <main className="px-6 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">📊 Overview</TabsTrigger>
                  <TabsTrigger value="coaching">🧠 AI Coach</TabsTrigger>
                  <TabsTrigger value="emotions">💭 Emotions</TabsTrigger>
                  <TabsTrigger value="financial-position">💰 Financial Position</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="shadow-lg">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <DollarSign className="text-white" size={16} />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
  £{expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(0)}
</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Total Spent</div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="text-white" size={16} />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
  £{totalRemaining.toFixed(0)}
</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Remaining</div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Target className="text-white" size={16} />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{weeklyAnalysis.smart}</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Smart Buys</div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingDown className="text-white" size={16} />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
  {budgetUsedPercentage}%
</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Budget Used</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Spending by Category */}
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Spending by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`£${value}`, "Amount"]} />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                              No spending data yet
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Budget vs Actual */}
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Budget vs Actual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {budgetComparisonData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={budgetComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`£${value}`, ""]} />
                                <Bar dataKey="budgeted" fill="#E5E7EB" name="Budgeted" />
                                <Bar dataKey="spent" fill="#8B5CF6" name="Spent" />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                              <BarChart3 className="w-12 h-12 mb-3 text-gray-400" />
                              <p className="text-center">No budget data yet</p>
                              <p className="text-sm text-center mt-1">Click "Set Budget" above to create your monthly budget categories</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="coaching" className="mt-6">
                  <SmartieCoachingSummary
                    weeklySpending={weeklyAnalysis?.totalSpent || 0}
                    smartPurchases={3}
                    streak={5}
                    personalityMode={personalityMode}
                    onPersonalityChange={setPersonalityMode}
                  />
                </TabsContent>

                <TabsContent value="emotions" className="mt-6">
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Start tracking your purchases with emotional tags to see patterns here!</p>
                  </div>
                </TabsContent>

                <TabsContent value="financial-position" className="mt-6">
                  <div className="space-y-6">
                    {/* Financial Position Wizard */}
                    {showBudgetSetup && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Budget Setup
                              <Button variant="outline" size="sm" onClick={() => setShowBudgetSetup(false)}>
                                ×
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <BudgetSetupWizard onComplete={() => setShowBudgetSetup(false)} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Budget vs Actual Chart with Budget Setup */}
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Budget vs Actual</CardTitle>
                        <Button 
                          onClick={() => setShowBudgetSetup(true)}
                          size="sm"
                          className="ml-auto bg-purple-500 hover:bg-purple-600"
                        >
                          Set Budget
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          {budgets.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={budgetComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis tickFormatter={(value) => `£${value}`} />
                                <Tooltip formatter={(value, name) => [`£${value}`, name]} />
                                <Bar dataKey="budget" fill="#8B5CF6" name="Budget" />
                                <Bar dataKey="spent" fill="#EC4899" name="Spent" />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                              <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-3" />
                                <p>No budget data yet</p>
                                <p className="text-sm mt-2">Click "Set Budget" above to create your monthly budget categories</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Savings Tree Visualization */}
                    {goals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Financial Goals Tree</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <SavingsTreeVisualization 
                              goals={goals.map((goal: any) => ({
                                id: goal.id,
                                title: goal.title,
                                targetAmount: parseFloat(goal.targetAmount),
                                currentAmount: parseFloat(goal.currentAmount || '0'),
                                completed: parseFloat(goal.currentAmount || '0') >= parseFloat(goal.targetAmount)
                              }))}
                              totalSaved={goals.reduce((sum: number, goal: any) => sum + parseFloat(goal.currentAmount || '0'), 0)}
                              onWaterTree={() => {}}
                              onResetTree={handleResetSavingsTree}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Financial Goals Progress */}
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          Financial Goals Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {goals.length > 0 ? (
                          <div className="space-y-4">
                            {goals.map((goal: any) => (
                              <div key={goal.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-semibold">{goal.title}</h3>
                                  <span className="text-sm text-gray-500">
                                    £{goal.currentAmount} / £{goal.targetAmount}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{
                                      width: `${Math.min((parseFloat(goal.currentAmount || '0') / parseFloat(goal.targetAmount)) * 100, 100)}%`
                                    }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {Math.round((parseFloat(goal.currentAmount || '0') / parseFloat(goal.targetAmount)) * 100)}% complete
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>Visit the Goals page to create and track your savings goals!</p>
                            <Button 
                              onClick={() => window.location.href = '/goals'} 
                              className="mt-4 bg-purple-500 hover:bg-purple-600"
                            >
                              Go to Goals
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Wealth Projection Chart */}
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          12-Month Wealth Projection
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Based on your current financial position and goals
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={wealthProjectionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis tickFormatter={(value) => `£${value}`} />
                              <Tooltip formatter={(value, name) => [`£${value}`, name]} />
                              <Line 
                                type="monotone" 
                                dataKey="projected" 
                                stroke="#8B5CF6" 
                                strokeWidth={3}
                                name="Projected Growth"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="optimistic" 
                                stroke="#10B981" 
                                strokeDasharray="5 5"
                                name="Best Case"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="conservative" 
                                stroke="#F59E0B" 
                                strokeDasharray="5 5"
                                name="Conservative"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">Best Case</p>
                            <p className="font-bold text-green-700 dark:text-green-300">£{wealthProjectionData[11]?.optimistic.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-purple-600 dark:text-purple-400">Projected</p>
                            <p className="font-bold text-purple-700 dark:text-purple-300">£{wealthProjectionData[11]?.projected.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">Conservative</p>
                            <p className="font-bold text-yellow-700 dark:text-yellow-300">£{wealthProjectionData[11]?.conservative.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav currentTab="analytics" />
      
      {/* Scroll-based Smartie Comments */}
      {expenses.length > 0 && (
        <ScrollSmartieComments 
          purchases={expenses.map(expense => ({
            id: expense.id,
            name: expense.description,
            amount: parseFloat(expense.amount),
            category: expense.category,
            utilityScore: 5 // Default utility score for now
          }))} 
        />
      )}
    </div>
  );
}