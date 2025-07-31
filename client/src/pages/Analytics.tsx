import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/hooks/useAuth';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { EnhancedSpendingList } from "@/components/EnhancedSpendingList";
import { type Expense, type Budget } from "@shared/schema";

const COLORS = {
  "Food & Dining": "#FB7C37",
  "Shopping": "#8B5CF6",
  "Entertainment": "#3B82F6", 
  "Transport": "#10B981",
  "Utilities": "#8B5A99",
  "Other": "#F59E0B",
};

export default function Analytics() {
  const { user: firebaseUser } = useAuth();
  const [smartieReaction, setSmartieReaction] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);

  // Sync Firebase user with database first
  const { data: syncedUser } = useQuery({
    queryKey: ['sync-user', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      const response = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
        })
      });
      const userData = await response.json();
      setDbUser(userData);
      return userData;
    },
    enabled: !!firebaseUser
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

  const { data: analytics, isLoading: analyticsLoading } = useQuery({ 
    queryKey: ["/api/analytics", syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return {};
      const response = await fetch(`/api/analytics/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });

  const isLoading = expensesLoading || budgetsLoading || analyticsLoading;

  // Prepare data for charts
  const categoryData = Object.entries((analytics as any)?.categorySpending || {}).map(([category, amount]) => ({
    name: category,
    value: amount as number,
    color: COLORS[category as keyof typeof COLORS] || "#6B7280",
  }));

  const budgetComparisonData = budgets.map(budget => ({
    category: budget.category.split(" ")[0], // Shorten names for chart
    budgeted: parseFloat(budget.monthlyLimit),
    spent: parseFloat(budget.spent || "0"),
    remaining: parseFloat(budget.monthlyLimit) - parseFloat(budget.spent || "0"),
  }));

  // Prepare enhanced spending data for the new system
  const enhancedSpendingData = budgets.map(budget => {
    const spent = parseFloat(budget.spent || "0");
    const limit = parseFloat(budget.monthlyLimit);
    const percentage = Math.round((spent / limit) * 100);
    
    let status: 'overspent' | 'at-risk' | 'on-track' = 'on-track';
    if (percentage > 100) status = 'overspent';
    else if (percentage > 75) status = 'at-risk';
    
    return {
      id: budget.id,
      category: budget.category,
      spent,
      budget: limit,
      percentage,
      icon: budget.category.includes('Food') ? '🍔' :
            budget.category.includes('Shopping') ? '🛒' :
            budget.category.includes('Transport') ? '🚗' :
            budget.category.includes('Entertainment') ? '🎬' :
            budget.category.includes('Utilities') ? '⚡' : '💰',
      status
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-r from-purple-800 via-pink-600 to-blue-700 text-white px-6 py-8 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Analytics & Insights</h1>
        <p className="text-white text-lg font-semibold mt-2 drop-shadow-md">
          Your financial patterns and trends
        </p>
      </motion.header>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-20">
        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center mx-auto mb-2">
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
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{(analytics as any)?.goals || 0}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Active Goals</div>
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
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Spending by Category */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
          </motion.div>

          {/* Budget vs Actual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
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
          </motion.div>
        </div>

        {/* Enhanced Spending List with Smartie Breakpoints */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Smart Spending Analysis</CardTitle>
              <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                Organized by spending behavior with Smartie's insights
              </p>
            </CardHeader>
            <CardContent>
              <EnhancedSpendingList 
                spendingData={enhancedSpendingData}
                onSmartieReaction={setSmartieReaction}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav currentTab="analytics" />
    </div>
  );
}
