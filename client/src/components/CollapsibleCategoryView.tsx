import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Purchase {
  id: string;
  name: string;
  amount: number;
  category: string;
  utilityScore: number;
  timestamp: string;
}

interface CollapsibleCategoryViewProps {
  purchases: Purchase[];
  showCompactView: boolean;
}

interface CategoryGroup {
  category: string;
  purchases: Purchase[];
  totalAmount: number;
  averageUtility: number;
  emoji: string;
}

const CollapsibleCategoryView: React.FC<CollapsibleCategoryViewProps> = ({
  purchases,
  showCompactView
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const categoryEmojis = {
    "Food & Dining": "🍽️",
    "Shopping": "🛍️",
    "Entertainment": "🎬",
    "Transportation": "🚗",
    "Utilities": "⚡",
    "Other": "📦"
  };

  const getUtilityColor = (score: number) => {
    if (score >= 8) return "💚 text-green-700 bg-green-100 border-green-200";
    if (score >= 5) return "🟡 text-yellow-700 bg-yellow-100 border-yellow-200";
    return "🔴 text-red-700 bg-red-100 border-red-200";
  };

  const groupByCategory = (): CategoryGroup[] => {
    const groups = purchases.reduce((acc, purchase) => {
      const category = purchase.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          purchases: [],
          totalAmount: 0,
          averageUtility: 0,
          emoji: categoryEmojis[category as keyof typeof categoryEmojis] || "📦"
        };
      }
      acc[category].purchases.push(purchase);
      acc[category].totalAmount += purchase.amount;
      return acc;
    }, {} as Record<string, CategoryGroup>);

    // Calculate average utility for each category
    Object.values(groups).forEach(group => {
      group.averageUtility = group.purchases.reduce((sum, p) => sum + p.utilityScore, 0) / group.purchases.length;
    });

    return Object.values(groups).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categoryGroups = groupByCategory();

  return (
    <div className="space-y-4">
      {categoryGroups.map((group) => {
        const isExpanded = expandedCategories.has(group.category);
        
        return (
          <Card key={group.category} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(group.category)}
                className="w-full justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.emoji}</span>
                  <div className="text-left">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {group.category}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {group.purchases.length} items
                      </Badge>
                      <Badge 
                        className={`text-xs ${getUtilityColor(group.averageUtility)} border`}
                      >
                        Avg: {group.averageUtility.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    £{group.totalAmount.toFixed(2)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </Button>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {group.purchases
                        .sort((a, b) => b.amount - a.amount)
                        .map((purchase) => (
                          <motion.div
                            key={purchase.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`p-3 rounded-lg border-2 ${getUtilityColor(purchase.utilityScore)}`}
                          >
                            {showCompactView ? (
                              // Compact View
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm">
                                    {purchase.utilityScore}/10
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {purchase.name}
                                  </span>
                                </div>
                                <span className="font-bold text-gray-900">
                                  £{purchase.amount.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              // Expanded View
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-gray-900">
                                    {purchase.name}
                                  </h4>
                                  <span className="text-xl font-bold text-gray-900">
                                    £{purchase.amount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <Badge className="bg-gray-100 text-gray-700">
                                    Utility: {purchase.utilityScore}/10
                                  </Badge>
                                  <span className="text-gray-600">
                                    {new Date(purchase.timestamp).toLocaleDateString()}
                                  </span>
                                  <span className="text-gray-600">
                                    {new Date(purchase.timestamp).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>

                    {/* Category Summary */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category Total:</span>
                        <span className="font-bold text-gray-900">
                          £{group.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average Utility:</span>
                        <span className="font-bold text-gray-900">
                          {group.averageUtility.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Purchase Count:</span>
                        <span className="font-bold text-gray-900">
                          {group.purchases.length} items
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
};

export default CollapsibleCategoryView;