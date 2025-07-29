import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target, Brain, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import SmartieCoachingSummary from "@/components/SmartieCoachingSummary";
import EmotionalSpendingTracker from "@/components/EmotionalSpendingTracker";
import SavingsGoalEngine from "@/components/SavingsGoalEngine";
import ScrollSmartieComments from "@/components/ScrollSmartieComments";
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

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({ 
    queryKey: ["/api/expenses"] 
  });
  
  const { data: budgets = [], isLoading: budgetsLoading } = useQuery<Budget[]>({ 
    queryKey: ["/api/budgets"] 
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({ 
    queryKey: ["/api/analytics"] 
  });

  const isLoading = expensesLoading || budgetsLoading || analyticsLoading;

  // Mock data for demo purposes - in real app this would come from API
  const mockPurchases = [
    { id: "1", name: "Grocery Shopping", amount: 45.20, category: "Food & Dining", utilityScore: 9, timestamp: new Date().toISOString(), mood: "happy" },
    { id: "2", name: "Netflix Subscription", amount: 12.99, category: "Entertainment", utilityScore: 7, timestamp: new Date(Date.now() - 86400000).toISOString(), mood: "bored" },
    { id: "3", name: "Impulse Amazon Buy", amount: 67.50, category: "Shopping", utilityScore: 3, timestamp: new Date(Date.now() - 172800000).toISOString(), mood: "stressed" },
    { id: "4", name: "Coffee & Lunch", amount: 15.80, category: "Food & Dining", utilityScore: 6, timestamp: new Date(Date.now() - 259200000).toISOString(), mood: "happy" },
    { id: "5", name: "Designer Trainers", amount: 120.00, category: "Shopping", utilityScore: 4, timestamp: new Date(Date.now() - 345600000).toISOString(), mood: "excited" },
  ];

  const mockMoodData = [
    { mood: "happy", emoji: "😊", totalSpent: 180.50, averageUtility: 7.2, purchaseCount: 8, categories: ["Food & Dining", "Entertainment"] },
    { mood: "stressed", emoji: "😰", totalSpent: 245.80, averageUtility: 4.1, purchaseCount: 6, categories: ["Shopping", "Food & Dining"] },
    { mood: "bored", emoji: "😐", totalSpent: 156.20, averageUtility: 5.8, purchaseCount: 4, categories: ["Entertainment", "Shopping"] },
    { mood: "excited", emoji: "🤩", totalSpent: 320.75, averageUtility: 6.0, purchaseCount: 5, categories: ["Shopping", "Entertainment"] },
  ];

  const mockGoals = [
    { id: "1", name: "PlayStation 5", targetAmount: 500, currentAmount: 187.50, category: "Gaming", emoji: "🕹️", createdAt: new Date().toISOString() },
    { id: "2", name: "Summer Holiday", targetAmount: 1500, currentAmount: 340.00, category: "Travel", emoji: "✈️", deadline: "2025-06-01", createdAt: new Date().toISOString() },
  ];

  const weeklyAnalysis = {
    smart: mockPurchases.filter(p => p.utilityScore >= 8).length,
    borderline: mockPurchases.filter(p => p.utilityScore >= 5 && p.utilityScore < 8).length,
    regret: mockPurchases.filter(p => p.utilityScore < 5).length,
    totalSpent: mockPurchases.reduce((sum, p) => sum + p.amount, 0),
    patterns: ["Late night spending increased", "Stress purchases trending up"]
  };

  // Prepare data for charts
  const categoryData = Object.entries((analytics as any)?.categorySpending || {}).map(([category, amount]) => ({
    name: category,
    value: amount as number,
    color: COLORS[category as keyof typeof COLORS] || "#6B7280",
  }));

  const budgetComparisonData = budgets.map(budget => ({
    category: budget.category.split(" ")[0],
    budgeted: parseFloat(budget.monthlyLimit),
    spent: parseFloat(budget.spent || "0"),
    remaining: parseFloat(budget.monthlyLimit) - parseFloat(budget.spent || "0"),
  }));

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
                  <TabsTrigger value="goals">🎯 Goals</TabsTrigger>
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
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">£{((analytics as any)?.totalSpent || 0).toFixed(0)}</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Total Spent</div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="text-white" size={16} />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">£{((analytics as any)?.remaining || 0).toFixed(0)}</div>
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
                            {(analytics as any)?.totalBudget ? Math.round(((analytics as any).totalSpent / (analytics as any).totalBudget) * 100) : 0}%
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
                            <div className="flex items-center justify-center h-64 text-gray-500">
                              No budget data yet
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="coaching" className="mt-6">
                  <SmartieCoachingSummary
                    weeklyAnalysis={weeklyAnalysis}
                    recentPurchases={mockPurchases}
                  />
                </TabsContent>

                <TabsContent value="emotions" className="mt-6">
                  <EmotionalSpendingTracker
                    moodData={mockMoodData}
                    onMoodSelect={setSelectedMood}
                  />
                </TabsContent>

                <TabsContent value="goals" className="mt-6">
                  <SavingsGoalEngine
                    goals={mockGoals}
                    onCreateGoal={(goal) => console.log("Create goal:", goal)}
                    onUpdateGoal={(id, amount) => console.log("Update goal:", id, amount)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav currentTab="analytics" />
      
      {/* Scroll-based Smartie Comments */}
      <ScrollSmartieComments purchases={mockPurchases} />
    </div>
  );
}