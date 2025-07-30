import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { CategoryIcon } from './CategoryIcons';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  X,
  Brain,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

interface AutoSuggestionEngineProps {
  recentExpenses: Array<{
    description: string;
    amount: number;
    category: string;
    emotion?: string;
  }>;
  currentExpense?: {
    description: string;
    amount?: number;
  };
  onAcceptSuggestion: (suggestion: Suggestion) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

interface Suggestion {
  id: string;
  type: 'category' | 'budget_limit' | 'spending_pattern' | 'emotional_insight' | 'goal_reminder';
  title: string;
  message: string;
  actionText: string;
  confidence: number;
  data?: any;
  icon: string;
}

export default function AutoSuggestionEngine({ 
  recentExpenses, 
  currentExpense, 
  onAcceptSuggestion, 
  onDismissSuggestion 
}: AutoSuggestionEngineProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);

  // AI-powered suggestion generation
  useEffect(() => {
    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
    if (newSuggestions.length > 0) {
      setActiveSuggestion(newSuggestions[0]);
    }
  }, [recentExpenses, currentExpense]);

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Category auto-detection
    if (currentExpense?.description) {
      const categorysuggestion = detectCategory(currentExpense.description);
      if (categorysuggestion) {
        suggestions.push({
          id: `category-${Date.now()}`,
          type: 'category',
          title: 'Category Suggestion',
          message: `Would this go better under "${categorysuggestion}"?`,
          actionText: `Set to ${categorysuggestion}`,
          confidence: 85,
          data: { category: categorysuggestion },
          icon: '🏷️'
        });
      }
    }

    // Spending pattern insights
    const patternInsight = analyzeSpendingPatterns();
    if (patternInsight) {
      suggestions.push(patternInsight);
    }

    // Budget limit suggestions
    const budgetSuggestion = suggestBudgetLimits();
    if (budgetSuggestion) {
      suggestions.push(budgetSuggestion);
    }

    // Emotional spending insights
    const emotionalInsight = analyzeEmotionalSpending();
    if (emotionalInsight) {
      suggestions.push(emotionalInsight);
    }

    // Goal reminders
    const goalReminder = generateGoalReminder();
    if (goalReminder) {
      suggestions.push(goalReminder);
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  const detectCategory = (description: string): string | null => {
    const desc = description.toLowerCase();
    
    const categoryKeywords = {
      'Food & Dining': ['coffee', 'restaurant', 'food', 'lunch', 'dinner', 'breakfast', 'cafe', 'starbucks', 'mcdonald', 'pizza', 'takeaway'],
      'Transport': ['uber', 'taxi', 'bus', 'train', 'petrol', 'gas', 'parking', 'oyster', 'travel'],
      'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'game', 'concert', 'theatre', 'streaming'],
      'Shopping': ['amazon', 'shop', 'clothes', 'clothing', 'shirt', 'shoes', 'dress', 'mall', 'store'],
      'Health': ['pharmacy', 'medicine', 'doctor', 'dentist', 'gym', 'fitness', 'hospital'],
      'Utilities': ['electricity', 'gas', 'water', 'internet', 'phone', 'mobile', 'bill'],
      'Education': ['book', 'course', 'university', 'school', 'training', 'workshop']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return category;
      }
    }

    return null;
  };

  const analyzeSpendingPatterns = (): Suggestion | null => {
    if (recentExpenses.length < 5) return null;

    // Check for weekend spending patterns
    const weekendSpending = recentExpenses.filter(expense => {
      // This would check actual dates in a real implementation
      return Math.random() > 0.7; // Mock weekend detection
    });

    if (weekendSpending.length > recentExpenses.length * 0.6) {
      return {
        id: `pattern-weekend-${Date.now()}`,
        type: 'spending_pattern',
        title: 'Weekend Spending Pattern',
        message: 'You tend to spend 40% more on weekends. Try planning free weekend activities!',
        actionText: 'Set Weekend Budget',
        confidence: 78,
        data: { pattern: 'weekend_overspending' },
        icon: '📊'
      };
    }

    // Check for frequent small purchases
    const smallPurchases = recentExpenses.filter(expense => expense.amount < 10);
    if (smallPurchases.length > recentExpenses.length * 0.7) {
      return {
        id: `pattern-small-${Date.now()}`,
        type: 'spending_pattern',
        title: 'Small Purchase Alert',
        message: 'Small purchases add up! You\'ve made many £5-10 purchases lately.',
        actionText: 'Track Small Spending',
        confidence: 82,
        data: { pattern: 'small_purchases' },
        icon: '🔍'
      };
    }

    return null;
  };

  const suggestBudgetLimits = (): Suggestion | null => {
    // Find categories without limits or with frequently exceeded limits
    const categorySpending = recentExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    if (highestCategory && highestCategory[1] > 200) {
      return {
        id: `budget-limit-${Date.now()}`,
        type: 'budget_limit',
        title: 'Budget Limit Suggestion',
        message: `Consider setting a monthly limit for ${highestCategory[0]}? You've spent £${highestCategory[1].toFixed(0)} recently.`,
        actionText: 'Set Limit',
        confidence: 75,
        data: { 
          category: highestCategory[0], 
          suggestedLimit: Math.ceil(highestCategory[1] * 1.2) 
        },
        icon: '🎯'
      };
    }

    return null;
  };

  const analyzeEmotionalSpending = (): Suggestion | null => {
    const emotionalExpenses = recentExpenses.filter(expense => 
      expense.emotion && ['stressed', 'bored', 'impulsive'].includes(expense.emotion)
    );

    if (emotionalExpenses.length > recentExpenses.length * 0.4) {
      const dominantEmotion = emotionalExpenses
        .reduce((acc, expense) => {
          acc[expense.emotion!] = (acc[expense.emotion!] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topEmotion = Object.entries(dominantEmotion)
        .sort(([,a], [,b]) => b - a)[0][0];

      let message = '';
      if (topEmotion === 'stressed') {
        message = 'You tend to spend when stressed. Next time try taking a walk or calling a friend instead.';
      } else if (topEmotion === 'bored') {
        message = 'Boredom spending detected! Try free activities like reading or exercising next time.';
      } else if (topEmotion === 'impulsive') {
        message = 'Lots of impulse purchases lately. The 24-hour rule works great for purchases over £20!';
      }

      return {
        id: `emotional-${Date.now()}`,
        type: 'emotional_insight',
        title: 'Emotional Spending Insight',
        message,
        actionText: 'Learn More',
        confidence: 88,
        data: { emotion: topEmotion },
        icon: '💭'
      };
    }

    return null;
  };

  const generateGoalReminder = (): Suggestion | null => {
    // Mock goal data - in real app this would come from actual goals
    const mockGoal = {
      name: 'Holiday Fund',
      target: 1500,
      current: 890,
      remaining: 610
    };

    if (currentExpense?.amount && currentExpense.amount > 50) {
      return {
        id: `goal-reminder-${Date.now()}`,
        type: 'goal_reminder',
        title: 'Goal Progress Check',
        message: `You're £${mockGoal.remaining} away from your ${mockGoal.name} goal. Want to skip this purchase?`,
        actionText: 'Stay Focused',
        confidence: 70,
        data: { goal: mockGoal },
        icon: '🎯'
      };
    }

    return null;
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    onAcceptSuggestion(suggestion);
    setActiveSuggestion(null);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    onDismissSuggestion(suggestionId);
    setActiveSuggestion(null);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const nextSuggestion = () => {
    const currentIndex = suggestions.findIndex(s => s.id === activeSuggestion?.id);
    const nextIndex = (currentIndex + 1) % suggestions.length;
    setActiveSuggestion(suggestions[nextIndex] || null);
  };

  if (suggestions.length === 0 || !activeSuggestion) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow-xl">
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ModernSmartieAvatar mood="thinking" size="sm" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {activeSuggestion.title}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-blue-100 text-blue-700"
                  >
                    {activeSuggestion.confidence}% confident
                  </Badge>
                </div>
                
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {activeSuggestion.message}
                </p>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleAcceptSuggestion(activeSuggestion)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {activeSuggestion.actionText}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDismissSuggestion(activeSuggestion.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </motion.button>
                  
                  {suggestions.length > 1 && (
                    <motion.button
                      onClick={nextSuggestion}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight className="w-3 h-3 text-gray-500" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            
            {suggestions.length > 1 && (
              <div className="flex justify-center gap-1">
                {suggestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === suggestions.findIndex(s => s.id === activeSuggestion.id)
                        ? 'bg-blue-500'
                        : 'bg-blue-200 dark:bg-blue-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}