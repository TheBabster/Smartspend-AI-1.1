import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import { 
  Send, 
  Mic, 
  Sparkles, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Brain,
  MessageSquare,
  Lightbulb,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { type Budget, type Expense, type Goal } from '@shared/schema';

interface ChatMessage {
  id: string;
  type: 'user' | 'smartie';
  content: string;
  timestamp: Date;
  mood?: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'encouraging';
  suggestions?: string[];
}

interface SmartieIntelligentChatProps {
  className?: string;
  onClose?: () => void;
  initialContext?: 'budget' | 'expense' | 'goal' | 'general';
}

const SmartieIntelligentChat: React.FC<SmartieIntelligentChatProps> = ({
  className = "",
  onClose,
  initialContext = 'general'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'smartie',
      content: "Hi bdaniel6! 👋 I'm Smartie, your AI financial coach. I've got your financial profile loaded and I'm ready to help you make smart money decisions. Each message costs 0.5 SmartCoins (you have 24 coins). What would you like to chat about today?",
      timestamp: new Date(),
      mood: 'happy',
      suggestions: ['Log £20 for food', 'Create goal for laptop £1200', 'Reset my tree']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user data for context
  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ['/api/budgets'] });
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ['/api/expenses'] });
  const { data: goals = [] } = useQuery<Goal[]>({ queryKey: ['/api/goals'] });

  // Real AI Chat mutation using our backend API
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const userId = localStorage.getItem('userId') || '9663b57c-1eff-420e-a77f-4c706e29ef24'; // Default test user
      
      const response = await fetch('/api/smartie/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from Smartie');
      }
      
      return await response.json();
    },
    onSuccess: (response) => {
      setIsTyping(false);
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'smartie',
        content: response.message,
        timestamp: new Date(),
        mood: response.actionPerformed ? 'celebrating' : 'happy',
        suggestions: response.actionPerformed ? [] : ['Log £20 for food', 'Create goal for laptop £1200', 'Reset my tree']
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Show success feedback if action was performed
      if (response.actionPerformed) {
        setTimeout(() => {
          const successMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'smartie',
            content: getSuccessMessage(response.actionPerformed.type),
            timestamp: new Date(),
            mood: 'celebrating'
          };
          setMessages(prev => [...prev, successMessage]);
        }, 1000);
      }
    },
    onError: (error) => {
      setIsTyping(false);
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'smartie',
        content: "I'm having trouble right now, but I'm still here to help! Try asking me to log expenses or create goals.",
        timestamp: new Date(),
        mood: 'concerned'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    chatMutation.mutate(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ExactSmartieAvatar mood="happy" size="md" animated={true} />
            <div>
              <h2 className="text-lg font-bold">Chat with Smartie</h2>
              <p className="text-sm opacity-90">Your AI Financial Assistant</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/50 to-pink-50/50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                {message.type === 'smartie' && (
                  <ExactSmartieAvatar 
                    mood={message.mood || 'happy'} 
                    size="sm" 
                    animated={true} 
                  />
                )}
                
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white border shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-70">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <ExactSmartieAvatar mood="thinking" size="sm" animated={true} />
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-gray-500">Smartie is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Smartie about your finances..."
              className="pr-12 rounded-full border-gray-300 focus:border-purple-400"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {getQuickActions().map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(action.text)}
              className="text-xs flex items-center gap-1"
            >
              <action.icon className="w-3 h-3" />
              {action.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getInitialMessage(context: string): string {
  switch (context) {
    case 'budget':
      return "Hi there! I'm here to help you with your budget planning. I can analyze your spending patterns, suggest optimizations, and help you stay on track with your financial goals. What would you like to know?";
    case 'expense':
      return "Let's talk about your expenses! I can help you categorize spending, identify patterns, and find ways to save money. What specific expense questions do you have?";
    case 'goal':
      return "Great to see you working on your financial goals! I can help you create achievable targets, track progress, and adjust strategies. Which goal would you like to discuss?";
    default:
      return "Hello! I'm Smartie, your AI financial assistant. I'm here to help you make smarter financial decisions, understand your spending patterns, and achieve your money goals. How can I help you today?";
  }
}

function getInitialSuggestions(context: string): string[] {
  switch (context) {
    case 'budget':
      return [
        "How's my budget looking this month?",
        "Where can I cut expenses?",
        "Help me set up a new budget"
      ];
    case 'expense':
      return [
        "Analyze my spending patterns",
        "What's my biggest expense category?",
        "Track my recent purchases"
      ];
    case 'goal':
      return [
        "Help me set a savings goal",
        "Am I on track with my goals?",
        "Create a debt payoff plan"
      ];
    default:
      return [
        "How much have I spent this month?",
        "What's my financial health score?",
        "Give me money-saving tips"
      ];
  }
}

function getQuickActions() {
  return [
    { text: "Budget overview", icon: TrendingUp },
    { text: "Spending tips", icon: Lightbulb },
    { text: "Goal progress", icon: Target },
    { text: "Money insights", icon: Brain }
  ];
}

function generateSmartieResponse(
  message: string, 
  context: { budgets: Budget[], expenses: Expense[], goals: Goal[] }
): { content: string, mood: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'encouraging', suggestions: string[] } {
  const lowercaseMessage = message.toLowerCase();
  
  // Calculate some basic stats for responses
  const totalSpent = context.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalBudget = context.budgets.reduce((sum, budget) => sum + parseFloat(budget.monthlyLimit), 0);
  const remainingBudget = totalBudget - totalSpent;
  
  // Budget-related queries
  if (lowercaseMessage.includes('budget') || lowercaseMessage.includes('spending')) {
    if (remainingBudget > 0) {
      return {
        content: `Great news! You have £${remainingBudget.toFixed(2)} remaining in your budget this month. You've spent £${totalSpent.toFixed(2)} out of £${totalBudget.toFixed(2)}. You're doing well staying on track! 💰`,
        mood: 'happy',
        suggestions: ["Show me spending breakdown", "Tips to save more", "Set up new budget"]
      };
    } else {
      return {
        content: `I notice you've exceeded your budget by £${Math.abs(remainingBudget).toFixed(2)} this month. Don't worry, this happens! Let's look at ways to get back on track. Would you like some money-saving suggestions?`,
        mood: 'concerned',
        suggestions: ["Money-saving tips", "Adjust my budget", "Track overspending"]
      };
    }
  }
  
  // Goal-related queries
  if (lowercaseMessage.includes('goal') || lowercaseMessage.includes('save')) {
    const completedGoals = context.goals.filter(g => g.completed).length;
    const totalGoals = context.goals.length;
    
    return {
      content: `You're making great progress! You've completed ${completedGoals} out of ${totalGoals} financial goals. ${totalGoals > 0 ? "Your dedication is paying off! 🎯" : "Ready to set some exciting financial goals? I can help you create achievable targets!"}`,
      mood: completedGoals > 0 ? 'celebrating' : 'happy',
      suggestions: ["Create new goal", "Review progress", "Goal strategies"]
    };
  }
  
  // Expense analysis
  if (lowercaseMessage.includes('spent') || lowercaseMessage.includes('expense')) {
    const topCategory = getTopSpendingCategory(context.expenses);
    return {
      content: `This month you've spent £${totalSpent.toFixed(2)} across ${context.expenses.length} transactions. Your biggest spending category is ${topCategory.name} at £${topCategory.amount.toFixed(2)}. This represents ${((topCategory.amount / totalSpent) * 100).toFixed(1)}% of your total spending.`,
      mood: 'thinking',
      suggestions: ["Category breakdown", "Spending trends", "Reduce expenses"]
    };
  }
  
  // Tips and advice
  if (lowercaseMessage.includes('tip') || lowercaseMessage.includes('advice') || lowercaseMessage.includes('help')) {
    const tips = [
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings!",
      "Set up automatic transfers to your savings account - pay yourself first!",
      "Use the 24-hour rule for non-essential purchases over £50.",
      "Track your emotional triggers for spending - awareness is the first step!",
      "Consider the 'cost per use' for purchases - is it worth it long-term?"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return {
      content: `Here's a smart tip for you: ${randomTip} 💡 Would you like more personalized advice based on your spending patterns?`,
      mood: 'happy',
      suggestions: ["More tips", "Analyze my habits", "Create action plan"]
    };
  }
  
  // General friendly responses
  return {
    content: "I'm here to help you make the smartest financial decisions! I can analyze your spending, help with budgeting, track your goals, and provide personalized money advice. What specific area would you like to explore? 🤔",
    mood: 'thinking',
    suggestions: ["Budget analysis", "Spending insights", "Financial goals", "Money tips"]
  };
}

function getTopSpendingCategory(expenses: Expense[]) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals).reduce((max, [category, amount]) => 
    amount > max.amount ? { name: category, amount } : max
  , { name: 'Other', amount: 0 });
  
  return topCategory;
}

function getSuccessMessage(actionType: string): string {
  switch (actionType) {
    case 'expense_added':
      return "Perfect! I've successfully logged that expense for you. Your spending is now updated! 💰";
    case 'goal_created':
      return "Awesome! Your new savings goal has been created and added to your tree! 🌱";
    case 'savings_reset':
      return "Done! Your savings tree has been completely reset. Fresh start! 🌱";
    case 'money_added':
      return "Great! I've added money to your goal. You're getting closer! 🎯";
    default:
      return "Success! Your action has been completed! ✅";
  }
}

export default SmartieIntelligentChat;