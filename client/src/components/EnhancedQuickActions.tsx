import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SmartieMessaging from './SmartieMessaging';
import EnhancedSmartieReactions from './EnhancedSmartieReactions';

interface EnhancedQuickActionsProps {
  onPurchaseDecision: () => void;
  onAddExpense: () => void;
  onViewGoals: () => void;
  onViewAnalytics: () => void;
  onChatWithSmartie?: () => void;
  userSpendingData?: {
    totalSpent: number;
    budgetUsed: number;
    streak: number;
  };
}

export default function EnhancedQuickActions({
  onPurchaseDecision,
  onAddExpense,
  onViewGoals,
  onViewAnalytics,
  onChatWithSmartie,
  userSpendingData
}: EnhancedQuickActionsProps) {
  const [showSmartieChat, setShowSmartieChat] = useState(false);

  const primaryActions = [
    {
      id: 'purchase',
      title: 'Smart Purchase Decision',
      subtitle: 'Get AI advice before buying',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-on-gradient',
      action: onPurchaseDecision,
      priority: 'high'
    },
    {
      id: 'expense',
      title: 'Add Expense',
      subtitle: 'Track your spending',
      icon: Plus,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-on-gradient',
      action: onAddExpense,
      priority: 'high'
    }
  ];

  const secondaryActions = [
    {
      id: 'chat',
      title: 'Chat with Smartie',
      subtitle: 'Ask financial questions',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-on-gradient',
      action: () => setShowSmartieChat(true),
      priority: 'medium'
    },
    {
      id: 'goals',
      title: 'View Goals',
      subtitle: 'Track your progress',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-on-gradient',
      action: onViewGoals,
      priority: 'medium'
    }
  ];

  const quickStats = [
    {
      id: 'analytics',
      title: 'View Analytics',
      subtitle: 'Spending insights',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      textColor: 'text-on-gradient',
      action: onViewAnalytics,
      priority: 'low'
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Primary Actions - Most Important */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <EnhancedSmartieReactions 
              mood="celebrating" 
              size="sm" 
              animated={true}
            />
            <div>
              <h2 className="text-lg font-bold text-high-contrast">Quick Actions</h2>
              <p className="text-sm text-muted-contrast">Main functions for smart spending</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {primaryActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <div className={`bg-gradient-to-r ${action.color} p-1`}>
                    <CardContent className="p-0">
                      <Button
                        onClick={action.action}
                        variant="ghost"
                        className="w-full h-auto p-6 bg-transparent hover:bg-white/10 rounded-none"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <motion.div
                            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <action.icon className={action.textColor} size={24} />
                          </motion.div>
                          <div className="flex-1 text-left">
                            <h3 className={`font-bold text-lg ${action.textColor}`}>
                              {action.title}
                            </h3>
                            <p className={`text-sm ${action.textColor} opacity-90`}>
                              {action.subtitle}
                            </p>
                          </div>
                          <motion.div
                            className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Zap className={action.textColor} size={16} />
                          </motion.div>
                        </div>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Secondary Actions - Medium Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {secondaryActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <div className={`bg-gradient-to-br ${action.color} p-1`}>
                  <CardContent className="p-0">
                    <Button
                      onClick={action.action}
                      variant="ghost"
                      className="w-full h-auto p-4 bg-transparent hover:bg-white/10 rounded-none"
                    >
                      <div className="text-center space-y-2">
                        <motion.div
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <action.icon className={action.textColor} size={20} />
                        </motion.div>
                        <div>
                          <h4 className={`font-semibold text-sm ${action.textColor}`}>
                            {action.title}
                          </h4>
                          <p className={`text-xs ${action.textColor} opacity-90`}>
                            {action.subtitle}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats - Lower Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 gap-3"
        >
          {quickStats.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0">
                <div className={`bg-gradient-to-r ${action.color} p-1`}>
                  <CardContent className="p-0">
                    <Button
                      onClick={action.action}
                      variant="ghost"
                      className="w-full h-auto p-3 bg-transparent hover:bg-white/10 rounded-none"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <motion.div
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <action.icon className={action.textColor} size={18} />
                        </motion.div>
                        <div className="flex-1 text-left">
                          <h4 className={`font-medium text-sm ${action.textColor}`}>
                            {action.title}
                          </h4>
                          <p className={`text-xs ${action.textColor} opacity-90`}>
                            {action.subtitle}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Smartie Messaging Modal */}
      <SmartieMessaging 
        isOpen={showSmartieChat}
        onClose={() => setShowSmartieChat(false)}
        userSpendingData={userSpendingData}
      />
    </>
  );
}