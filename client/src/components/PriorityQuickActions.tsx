import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ModernSmartieAvatar from './ModernSmartieAvatar';

interface PriorityQuickActionsProps {
  onPurchaseDecision: () => void;
  onAddExpense: () => void;
  onViewGoals: () => void;
  onViewAnalytics: () => void;
  onChatWithSmartie: () => void;
  userSpendingData?: {
    totalSpent: number;
    budgetUsed: number;
    streak: number;
  };
}

const PriorityQuickActions: React.FC<PriorityQuickActionsProps> = ({
  onPurchaseDecision,
  onAddExpense,
  onViewGoals,
  onViewAnalytics,
  onChatWithSmartie,
  userSpendingData
}) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Cohesive pastel color palette as requested
  const mainActions = [
    {
      id: 'purchase',
      title: 'Smart Purchase Decision',
      subtitle: 'Get AI advice before buying',
      icon: ShoppingCart,
      gradient: 'from-indigo-400 to-purple-500', // Softer, more cohesive
      hoverGradient: 'from-indigo-500 to-purple-600',
      textColor: 'text-white',
      action: onPurchaseDecision,
      priority: 'high',
      size: 'large'
    },
    {
      id: 'chat',
      title: 'Chat with Smartie',
      subtitle: 'Ask your AI financial coach',
      icon: MessageCircle,
      gradient: 'from-cyan-400 to-blue-500', // Cohesive blue family
      hoverGradient: 'from-cyan-500 to-blue-600',
      textColor: 'text-white',
      action: onChatWithSmartie,
      priority: 'high',
      size: 'large'
    }
  ];

  const secondaryActions = [
    {
      id: 'expense',
      title: 'Add Expense',
      subtitle: 'Track spending',
      icon: Plus,
      gradient: 'from-emerald-300 to-green-400', // Reduced saturation
      hoverGradient: 'from-emerald-400 to-green-500',
      textColor: 'text-white',
      action: onAddExpense,
      priority: 'medium',
      size: 'medium'
    },
    {
      id: 'goals',
      title: 'Goals',
      subtitle: 'Track progress',
      icon: Target,
      gradient: 'from-orange-300 to-amber-400', // Softer orange
      hoverGradient: 'from-orange-400 to-amber-500',
      textColor: 'text-white',
      action: onViewGoals,
      priority: 'medium',
      size: 'medium'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'View insights',
      icon: TrendingUp,
      gradient: 'from-pink-300 to-rose-400', // Softer pink
      hoverGradient: 'from-pink-400 to-rose-500',
      textColor: 'text-white',
      action: onViewAnalytics,
      priority: 'medium',
      size: 'medium'
    }
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 md:col-span-1 p-6 min-h-[120px]';
      case 'medium':
        return 'col-span-1 p-4 min-h-[100px]';
      default:
        return 'col-span-1 p-4 min-h-[80px]';
    }
  };

  const getSmartieMessage = () => {
    const { budgetUsed = 0, streak = 0 } = userSpendingData || {};
    
    if (streak > 5) {
      return { text: "Amazing streak!", mood: "celebrating" as const, animation: "milestone" as const };
    } else if (budgetUsed > 80) {
      return { text: "Watch spending!", mood: "concerned" as const, animation: "warning" as const };
    } else {
      return { text: "Let's be smart!", mood: "happy" as const, animation: "greeting" as const };
    }
  };

  const smartieMessage = getSmartieMessage();

  return (
    <div className="space-y-6">
      {/* Header with Smartie Motivation */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Main Functions</h2>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Your core financial tools, always accessible</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{smartieMessage.text}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Smartie says</p>
              </div>
              <ModernSmartieAvatar
                mood={smartieMessage.mood}
                size="md"
                animated={true}
                animationType={smartieMessage.animation}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main High-Priority Actions */}
      <div className="grid grid-cols-2 gap-4">
        {mainActions.map((action) => (
          <motion.div
            key={action.id}
            className={getSizeClasses(action.size)}
            onHoverStart={() => setHoveredAction(action.id)}
            onHoverEnd={() => setHoveredAction(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card 
              className={`h-full cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl bg-gradient-to-br ${
                hoveredAction === action.id ? action.hoverGradient : action.gradient
              }`}
              onClick={action.action}
            >
              <CardContent className={`${getSizeClasses(action.size)} flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 text-4xl transform rotate-12">
                    <action.icon />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="mb-3"
                    animate={hoveredAction === action.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <action.icon className="w-8 h-8 text-white mx-auto" />
                  </motion.div>
                  <h3 className={`font-bold text-lg ${action.textColor} mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${action.textColor} opacity-90`}>
                    {action.subtitle}
                  </p>
                </div>

                {/* Sparkle Effect on Hover */}
                {hoveredAction === action.id && (
                  <motion.div
                    className="absolute top-2 left-2 text-white opacity-80"
                    animate={{ 
                      rotate: [0, 180, 360],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-3 gap-3">
        {secondaryActions.map((action, index) => (
          <motion.div
            key={action.id}
            className={getSizeClasses(action.size)}
            onHoverStart={() => setHoveredAction(action.id)}
            onHoverEnd={() => setHoveredAction(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <Card 
              className={`h-full cursor-pointer transition-all duration-300 border-0 shadow-md hover:shadow-lg bg-gradient-to-br ${
                hoveredAction === action.id ? action.hoverGradient : action.gradient
              }`}
              onClick={action.action}
            >
              <CardContent className={`${getSizeClasses(action.size)} flex flex-col justify-center items-center text-center`}>
                <motion.div
                  className="mb-2"
                  animate={hoveredAction === action.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <action.icon className="w-6 h-6 text-white mx-auto" />
                </motion.div>
                <h3 className={`font-semibold text-sm ${action.textColor} mb-1`}>
                  {action.title}
                </h3>
                <p className={`text-xs ${action.textColor} opacity-80`}>
                  {action.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PriorityQuickActions;