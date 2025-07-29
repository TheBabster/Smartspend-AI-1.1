import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Target } from 'lucide-react';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface SpendingItem {
  id: string;
  category: string;
  spent: number;
  budget: number;
  percentage: number;
  icon: string;
  status: 'overspent' | 'at-risk' | 'on-track';
}

interface SpendingGroup {
  title: string;
  items: SpendingItem[];
  status: 'overspent' | 'at-risk' | 'on-track';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface SmartieBreakpoint {
  message: string;
  type: 'coaching' | 'praise' | 'warning';
  pose: 'thinking' | 'happy' | 'concerned';
}

interface EnhancedSpendingListProps {
  spendingData: SpendingItem[];
  onSmartieReaction?: (reaction: SmartieBreakpoint) => void;
}

export const EnhancedSpendingList: React.FC<EnhancedSpendingListProps> = ({
  spendingData,
  onSmartieReaction
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showSmartieBreakpoint, setShowSmartieBreakpoint] = useState<SmartieBreakpoint | null>(null);
  const [processedCount, setProcessedCount] = useState(0);

  // Group spending data by status
  const groupedData: SpendingGroup[] = [
    {
      title: "Overspent Categories",
      items: spendingData.filter(item => item.status === 'overspent'),
      status: 'overspent' as const,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    },
    {
      title: "At Risk Categories",
      items: spendingData.filter(item => item.status === 'at-risk'),
      status: 'at-risk' as const,
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    },
    {
      title: "On Track Categories",
      items: spendingData.filter(item => item.status === 'on-track'),
      status: 'on-track' as const,
      icon: <Target className="w-5 h-5" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    }
  ].filter(group => group.items.length > 0);

  // Generate Smartie breakpoint messages
  const generateSmartieBreakpoint = (itemIndex: number, item: SpendingItem): SmartieBreakpoint | null => {
    const breakpointMessages = {
      transport: {
        overspent: { message: "🚗 You're overspending on transport!", type: 'warning' as const, pose: 'concerned' as const },
        coaching: { message: "🚌 Try public transport to save more!", type: 'coaching' as const, pose: 'thinking' as const }
      },
      food: {
        good: { message: "🍔 Nice control on food & dining!", type: 'praise' as const, pose: 'happy' as const },
        overspent: { message: "🍕 Dining out too much this month!", type: 'warning' as const, pose: 'concerned' as const }
      },
      shopping: {
        overspent: { message: "🛒 Shopping spree? Let's slow it down.", type: 'warning' as const, pose: 'concerned' as const },
        coaching: { message: "💡 Try the 24-hour rule before buying!", type: 'coaching' as const, pose: 'thinking' as const }
      },
      general: {
        praise: { message: "💪 You're crushing your budget goals!", type: 'praise' as const, pose: 'happy' as const },
        warning: { message: "⚠️ Watch those spending patterns!", type: 'warning' as const, pose: 'concerned' as const },
        coaching: { message: "🎯 Small adjustments = big savings!", type: 'coaching' as const, pose: 'thinking' as const }
      }
    };

    // Category-specific messages
    const category = item.category.toLowerCase();
    if (category.includes('transport') || category.includes('travel')) {
      return item.status === 'overspent' ? breakpointMessages.transport.overspent : breakpointMessages.transport.coaching;
    }
    if (category.includes('food') || category.includes('dining') || category.includes('restaurant')) {
      return item.status === 'overspent' ? breakpointMessages.food.overspent : breakpointMessages.food.good;
    }
    if (category.includes('shopping') || category.includes('retail') || category.includes('clothes')) {
      return item.status === 'overspent' ? breakpointMessages.shopping.overspent : breakpointMessages.shopping.coaching;
    }

    // General messages based on status
    if (item.status === 'overspent') return breakpointMessages.general.warning;
    if (item.status === 'on-track') return breakpointMessages.general.praise;
    return breakpointMessages.general.coaching;
  };

  // Weekly insights
  const weeklyInsights = [
    { message: "You've saved £48 vs last week 👏", type: 'positive' },
    { message: "You're on track to save £210 this month 🎯", type: 'goal' },
    { message: "3 categories improved since last week! 📈", type: 'progress' },
    { message: "Your best spending week this month! ⭐", type: 'achievement' }
  ];

  // Toggle group collapse
  const toggleGroup = (groupTitle: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupTitle)) {
      newCollapsed.delete(groupTitle);
    } else {
      newCollapsed.add(groupTitle);
    }
    setCollapsedGroups(newCollapsed);
  };

  // Smartie breakpoint logic
  useEffect(() => {
    if ((processedCount + 1) % 3 === 0 && processedCount < spendingData.length) {
      const currentItem = spendingData[processedCount];
      const breakpoint = generateSmartieBreakpoint(processedCount, currentItem);
      
      if (breakpoint) {
        setShowSmartieBreakpoint(breakpoint);
        onSmartieReaction?.(breakpoint);
        
        // Hide breakpoint after 4 seconds
        setTimeout(() => {
          setShowSmartieBreakpoint(null);
        }, 4000);
      }
    }
  }, [processedCount, spendingData, onSmartieReaction]);

  // Increment processed count as items are rendered
  useEffect(() => {
    if (processedCount < spendingData.length) {
      const timer = setTimeout(() => {
        setProcessedCount(prev => prev + 1);
      }, 200); // Stagger item rendering
      return () => clearTimeout(timer);
    }
  }, [processedCount, spendingData.length]);

  return (
    <div className="space-y-6">
      {groupedData.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className={`rounded-xl border-2 ${group.bgColor} overflow-hidden`}
        >
          {/* Group Header */}
          <button
            onClick={() => toggleGroup(group.title)}
            className={`w-full px-6 py-4 flex items-center justify-between ${group.color} hover:opacity-80 transition-opacity`}
          >
            <div className="flex items-center gap-3">
              {group.icon}
              <span className="font-semibold text-lg">{group.title}</span>
              <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                {group.items.length}
              </span>
            </div>
            {collapsedGroups.has(group.title) ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>

          {/* Group Items */}
          <AnimatePresence>
            {!collapsedGroups.has(group.title) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border transition-all hover:shadow-md ${
                        itemIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {item.category}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              £{item.spent.toFixed(2)} of £{item.budget.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            item.status === 'overspent' ? 'text-red-600 dark:text-red-400' :
                            item.status === 'at-risk' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {item.percentage}%
                          </span>
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.status === 'overspent' ? 'bg-red-500' :
                                item.status === 'at-risk' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Weekly Insights Card */}
                  {groupIndex === 0 && group.items.length >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">📊</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                            Weekly Insight
                          </h4>
                          <p className="text-purple-700 dark:text-purple-300">
                            {weeklyInsights[Math.floor(Math.random() * weeklyInsights.length)].message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Smartie Breakpoint Popup */}
      <AnimatePresence>
        {showSmartieBreakpoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-20 right-4 z-50 max-w-xs"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                <ExactSmartieAvatar
                  pose={showSmartieBreakpoint.pose}
                  animated={true}
                  animationType={showSmartieBreakpoint.type === 'praise' ? 'positive' : 'neutral'}
                  size={40}
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    Smartie says:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                    {showSmartieBreakpoint.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};