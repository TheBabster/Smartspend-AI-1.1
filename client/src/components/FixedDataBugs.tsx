import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeeklyAnalysisProps {
  data: {
    category: string;
    budgeted: number;
    actual: number;
    change: number;
    icon: string;
  }[];
  currency?: string;
}

const FixedDataBugs: React.FC<WeeklyAnalysisProps> = ({ data, currency = "£" }) => {
  const formatCurrency = (amount: number): string => {
    // Fix overflow issues with proper number formatting
    if (isNaN(amount) || amount === null || amount === undefined) {
      return `${currency}0.00`;
    }
    
    // Prevent extremely long decimal numbers
    const rounded = Math.round(amount * 100) / 100;
    
    return `${currency}${rounded.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number): string => {
    // Fix NaN% display issues
    if (isNaN(percentage) || percentage === null || percentage === undefined) {
      return "0.0%";
    }
    
    // Cap percentage display to prevent overflow
    const cappedPercentage = Math.max(-999, Math.min(999, percentage));
    return `${cappedPercentage.toFixed(1)}%`;
  };

  const getTrendIcon = (change: number) => {
    if (isNaN(change) || Math.abs(change) < 0.1) {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }
    return change > 0 
      ? <TrendingUp className="w-4 h-4 text-red-500" />
      : <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getTrendColor = (change: number) => {
    if (isNaN(change) || Math.abs(change) < 0.1) {
      return "text-gray-500";
    }
    return change > 0 ? "text-red-500" : "text-green-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-high-contrast flex items-center gap-2">
          <span>📈</span>
          Weekly Performance Analysis
        </CardTitle>
        <p className="text-sm text-medium-contrast">Budget vs Actual spending comparison</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={item.category}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Category */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span className="font-medium text-high-contrast truncate">
                  {item.category}
                </span>
              </div>

              {/* Budget vs Actual */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-medium-contrast">Budgeted</p>
                  <p className="text-sm font-semibold text-high-contrast">
                    {formatCurrency(item.budgeted)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-medium-contrast">Actual</p>
                  <p className="text-sm font-semibold text-high-contrast">
                    {formatCurrency(item.actual)}
                  </p>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-1 min-w-[60px] justify-end">
                  {getTrendIcon(item.change)}
                  <span className={`text-sm font-medium ${getTrendColor(item.change)}`}>
                    {formatPercentage(item.change)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-high-contrast mb-2">Week Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-medium-contrast">Total Budgeted</p>
              <p className="font-bold text-high-contrast">
                {formatCurrency(data.reduce((sum, item) => sum + (item.budgeted || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-medium-contrast">Total Spent</p>
              <p className="font-bold text-high-contrast">
                {formatCurrency(data.reduce((sum, item) => sum + (item.actual || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixedDataBugs;