import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendingUp, TrendingDown, Eye, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { AnimatedProgressFill, CountUp, PulseGlow } from "./MicroAnimations";
import type { Budget } from "@shared/schema";

interface AdvancedBudgetVisualizerProps {
  budgets: Budget[];
  totalIncome?: number;
  viewMode?: "pie" | "bar" | "bubbles";
}

export default function AdvancedBudgetVisualizer({ 
  budgets, 
  totalIncome = 3000,
  viewMode: initialViewMode = "pie" 
}: AdvancedBudgetVisualizerProps) {
  const [viewMode, setViewMode] = useState<"pie" | "bar" | "bubbles">(initialViewMode);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Calculate totals and percentages
  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.monthlyLimit), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent), 0);
  const remainingIncome = totalIncome - totalBudget;

  // Prepare data for charts
  const chartData = budgets.map(budget => {
    const spent = parseFloat(budget.spent);
    const limit = parseFloat(budget.monthlyLimit);
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    
    return {
      category: budget.category,
      spent,
      limit,
      remaining: Math.max(limit - spent, 0),
      percentage,
      color: getCategoryColor(budget.category),
      emoji: getCategoryEmoji(budget.category)
    };
  });

  // Color scheme for categories
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Food': '#f59e0b',
      'Shopping': '#ec4899', 
      'Entertainment': '#3b82f6',
      'Transport': '#10b981',
      'Utilities': '#f97316',
      'Other': '#6b7280'
    };
    return colors[category] || colors['Other'];
  }

  function getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      'Food': '🍕',
      'Shopping': '🛍️',
      'Entertainment': '🎬', 
      'Transport': '🚗',
      'Utilities': '⚡',
      'Other': '📦'
    };
    return emojis[category] || emojis['Other'];
  }

  // Trigger re-animation when view mode changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [viewMode]);

  // Pie Chart Component
  const PieChartView = () => (
    <motion.div
      key={`pie-${animationKey}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            dataKey="spent"
            animationBegin={0}
            animationDuration={1000}
            onMouseEnter={(data) => setSelectedCategory(data.category)}
            onMouseLeave={() => setSelectedCategory(null)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={selectedCategory === entry.category ? "#fff" : "none"}
                strokeWidth={selectedCategory === entry.category ? 3 : 0}
                style={{
                  filter: selectedCategory === entry.category ? 'brightness(1.1) drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold">{data.emoji} {data.category}</p>
                    <p className="text-sm">Spent: £{data.spent.toFixed(2)}</p>
                    <p className="text-sm">Budget: £{data.limit.toFixed(2)}</p>
                    <p className="text-sm">Usage: {data.percentage.toFixed(1)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <CountUp 
            from={0} 
            to={totalSpent} 
            prefix="£" 
            className="text-2xl font-bold text-gray-800 dark:text-gray-200"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
        </div>
      </div>
    </motion.div>
  );

  // Bar Chart Component
  const BarChartView = () => (
    <motion.div
      key={`bar-${animationKey}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => chartData.find(d => d.category === value)?.emoji || value}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload[0]) {
                const data = chartData.find(d => d.category === label);
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold">{data?.emoji} {label}</p>
                    <p className="text-sm text-blue-600">Spent: £{payload[0].value}</p>
                    <p className="text-sm text-gray-600">Remaining: £{payload[1].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="spent" fill="#3b82f6" name="Spent" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" fill="#e5e7eb" name="Remaining" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );

  // Bubble Chart Component
  const BubbleChartView = () => (
    <motion.div
      key={`bubbles-${animationKey}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-80 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl"
    >
      {chartData.map((item, index) => {
        const size = Math.max((item.spent / totalSpent) * 120 + 40, 50);
        const x = (index % 3) * 33.333;
        const y = Math.floor(index / 3) * 50;
        
        return (
          <motion.div
            key={item.category}
            className="absolute cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            onClick={() => setSelectedCategory(
              selectedCategory === item.category ? null : item.category
            )}
          >
            <PulseGlow 
              color={item.percentage > 90 ? "red" : item.percentage > 75 ? "yellow" : "green"}
              intensity={item.percentage > 90 ? "high" : "medium"}
            >
              <div 
                className="w-full h-full rounded-full flex flex-col items-center justify-center text-white font-bold shadow-lg relative overflow-hidden"
                style={{ backgroundColor: item.color }}
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-xs text-center px-1">
                  £{item.spent.toFixed(0)}
                </div>
                
                {/* Ripple effect on click */}
                {selectedCategory === item.category && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-white/50"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </div>
            </PulseGlow>
          </motion.div>
        );
      })}
      
      {/* Legend for bubble sizes */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-600 dark:text-gray-400">
        Bubble size = Amount spent
      </div>
    </motion.div>
  );

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        {/* Header with view toggles */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              Budget Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              £{totalSpent.toFixed(0)} of £{totalBudget.toFixed(0)} spent
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("pie")}
              className="p-2"
            >
              <PieChartIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bar")}
              className="p-2"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "bubbles" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bubbles")}
              className="p-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chart Views */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {viewMode === "pie" && <PieChartView />}
            {viewMode === "bar" && <BarChartView />}
            {viewMode === "bubbles" && <BubbleChartView />}
          </AnimatePresence>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
            <CountUp 
              from={0} 
              to={((totalBudget - totalSpent) / totalBudget) * 100} 
              suffix="%" 
              className="text-lg font-bold text-green-600"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">Budget Left</p>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <CountUp 
              from={0} 
              to={remainingIncome} 
              prefix="£" 
              className="text-lg font-bold text-blue-600"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">Unallocated</p>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <span className="text-lg font-bold text-purple-600">{budgets.length}</span>
            <p className="text-xs text-gray-600 dark:text-gray-400">Categories</p>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <span className="text-lg font-bold text-orange-600">
              {budgets.filter(b => (parseFloat(b.spent) / parseFloat(b.monthlyLimit)) > 0.8).length}
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400">At Risk</p>
          </div>
        </div>

        {/* Selected category details */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30"
            >
              {(() => {
                const categoryData = chartData.find(d => d.category === selectedCategory);
                if (!categoryData) return null;
                
                return (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {categoryData.emoji} {categoryData.category} Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Spent</p>
                        <p className="font-semibold">£{categoryData.spent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Budget</p>
                        <p className="font-semibold">£{categoryData.limit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Remaining</p>
                        <p className="font-semibold">£{categoryData.remaining.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Usage</p>
                        <p className="font-semibold">{categoryData.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <AnimatedProgressFill 
                        percentage={categoryData.percentage}
                        color={categoryData.percentage > 90 ? "bg-red-500" : categoryData.percentage > 75 ? "bg-yellow-500" : "bg-green-500"}
                        height="h-3"
                      />
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}