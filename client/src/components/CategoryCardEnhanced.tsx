import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Edit2, Check, X, TrendingUp, TrendingDown } from "lucide-react";
import AnimatedProgressBar from "./AnimatedProgressBar";
import type { Budget } from "@shared/schema";

interface CategoryCardEnhancedProps {
  budget: Budget;
  delay?: number;
  onUpdateLimit?: (budgetId: string, newLimit: number) => void;
}

export default function CategoryCardEnhanced({ budget, delay = 0, onUpdateLimit }: CategoryCardEnhancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLimit, setEditLimit] = useState(budget.monthlyLimit.toString());

  const spent = parseFloat(budget.spent);
  const limit = parseFloat(budget.monthlyLimit);
  const percentage = Math.min((spent / limit) * 100, 100);
  const remaining = Math.max(limit - spent, 0);

  // Mock data for expanded view - in real app this would come from detailed expense tracking
  const weeklySpend = spent * 0.7; // Simulate this week's spending
  const lastWeekSpend = spent * 0.3; // Last week
  const weeklyTrend = ((weeklySpend - lastWeekSpend) / lastWeekSpend) * 100;

  const categoryConfig = {
    'Food': { emoji: '🍕', color: 'from-orange-400 to-red-500' },
    'Shopping': { emoji: '🛍️', color: 'from-purple-400 to-pink-500' },
    'Entertainment': { emoji: '🎬', color: 'from-blue-400 to-cyan-500' },
    'Transport': { emoji: '🚗', color: 'from-green-400 to-emerald-500' },
    'Utilities': { emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
    'Other': { emoji: '📦', color: 'from-gray-400 to-gray-600' }
  };

  const config = categoryConfig[budget.category as keyof typeof categoryConfig] || categoryConfig['Other'];

  const getProgressColor = () => {
    if (percentage >= 90) return 'red';
    if (percentage >= 75) return 'yellow';
    return 'green';
  };

  const handleSaveEdit = () => {
    const newLimit = parseFloat(editLimit || "0");
    if (newLimit > 0 && onUpdateLimit) {
      onUpdateLimit(budget.id, newLimit);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLimit(budget.monthlyLimit.toString());
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-4">
          {/* Main Category Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl">{config.emoji}</span>
              </motion.div>
              <div>
                <h3 className="font-semibold text-lg">{budget.category}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  £{remaining.toFixed(0)} remaining
                </p>
              </div>
            </div>
            
            {/* Budget Limit with Inline Editing */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    className="w-20 h-8 text-sm"
                    type="number"
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">£{limit}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">£{spent.toFixed(2)} spent</span>
              <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
            </div>
            <AnimatedProgressBar 
              percentage={percentage}
              color={getProgressColor()}
              size="lg"
              showGlow
              animated
            />
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="text-sm">
              {isExpanded ? 'Hide Details' : 'View Analysis'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Expanded Analysis View */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4 border-t pt-4"
              >
                {/* Weekly Trend Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {weeklyTrend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">This Week</span>
                    </div>
                    <p className="text-lg font-bold">£{weeklySpend.toFixed(0)}</p>
                    <p className={`text-xs ${weeklyTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {weeklyTrend > 0 ? '+' : ''}{weeklyTrend.toFixed(0)}% vs last week
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Daily Average</span>
                    </div>
                    <p className="text-lg font-bold">£{(weeklySpend / 7).toFixed(0)}</p>
                    <p className="text-xs text-gray-600">
                      This week's average
                    </p>
                  </div>
                </div>

                {/* Mini Insights */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    💡 Smart Insight
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {percentage > 75 
                      ? `You've used ${percentage.toFixed(0)}% of your ${budget.category.toLowerCase()} budget. Consider reducing spending in this category.`
                      : percentage > 50
                      ? `You're on track with ${percentage.toFixed(0)}% used. Keep monitoring your ${budget.category.toLowerCase()} spending.`
                      : `Great control! Only ${percentage.toFixed(0)}% of your ${budget.category.toLowerCase()} budget used.`
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}