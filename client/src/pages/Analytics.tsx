import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import BottomNav from "@/components/BottomNav";
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

  // Prepare data for charts
  const categoryData = Object.entries(analytics?.categorySpending || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category as keyof typeof COLORS] || "#6B7280",
  }));

  const budgetComparisonData = budgets.map(budget => ({
    category: budget.category.split(" ")[0], // Shorten names for chart
    budgeted: parseFloat(budget.monthlyLimit),
    spent: parseFloat(budget.spent),
    remaining: parseFloat(budget.monthlyLimit) - parseFloat(budget.spent),
  }));

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
        className="gradient-bg text-white px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-white/80 text-sm mt-1">
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
              <div className="text-lg font-bold">£{analytics?.totalSpent?.toFixed(0) || 0}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Spent</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="text-white" size={16} />
              </div>
              <div className="text-lg font-bold">£{analytics?.remaining?.toFixed(0) || 0}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="text-white" size={16} />
              </div>
              <div className="text-lg font-bold">{analytics?.goals || 0}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Goals</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingDown className="text-white" size={16} />
              </div>
              <div className="text-lg font-bold">
                {analytics?.totalBudget ? Math.round((analytics.totalSpent / analytics.totalBudget) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Budget Used</div>
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
                <CardTitle className="text-lg">Spending by Category</CardTitle>
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
                <CardTitle className="text-lg">Budget vs Actual</CardTitle>
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

        {/* Recent Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Recent Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.length > 0 ? (
                  <>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-8 h-8 smartie-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Spending Pattern Detected</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          You tend to spend more on {categoryData.length > 0 ? categoryData[0].name : "entertainment"} during weekends. Consider setting weekly limits!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 smartie-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Great Progress!</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          You're {analytics?.remaining && analytics.remaining > 0 ? "under" : "over"} budget this month. Keep up the excellent work!
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Start tracking expenses to see insights here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav currentTab="analytics" />
    </div>
  );
}
