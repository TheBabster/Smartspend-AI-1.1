import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, TrendingUp, Zap } from "lucide-react";
import Smartie from "@/components/Smartie";

interface SmartieCornerProps {
  budgetStreak?: number;
  budgetPercentage: number;
  totalSpent: number;
  monthlyIncome?: string;
}

const dailyMotivations = [
  "Every penny saved is a step toward your dreams! 💫",
  "Small budgets can create big futures when spent wisely! 🌱",
  "You're building wealth one smart decision at a time! 🏗️",
  "Financial discipline today means freedom tomorrow! ✨",
  "Remember: needs vs wants - you've got this! 💪",
  "Your future self is cheering you on right now! 📢",
  "Mindful spending is the path to financial peace! 🧘‍♀️",
  "Every budget victory makes you stronger! 🦁"
];

const financialTips = [
  "Try the 24-hour rule: Wait a day before any non-essential purchase over £20!",
  "Set up automatic savings - even £5/week adds up to £260/year! 🎯",
  "Use the envelope method: allocate cash for each spending category!",
  "Track your coffee purchases - small habits make big differences! ☕",
  "Before buying, ask: 'Will this matter in 6 months?' 🤔",
  "Try cooking one extra meal at home this week! 👨‍🍳",
  "Cancel subscriptions you forgot about - check your bank statements! 🔍",
  "Set spending alerts on your phone for budget categories! 📱"
];

const getSmartieMessage = (budgetPercentage: number, budgetStreak?: number) => {
  if (budgetStreak && budgetStreak > 20) {
    return {
      message: `WOW! ${budgetStreak} days of budget mastery! You're a financial superstar! 🌟`,
      emotion: 'celebrating' as const
    };
  }
  
  if (budgetPercentage < 20) {
    return {
      message: "Budget running low, but don't stress! Let's make every pound count. You've got this! 💪",
      emotion: 'concerned' as const
    };
  }
  
  if (budgetPercentage > 80) {
    return {
      message: "Fantastic budget control! You're setting yourself up for success! 🎉",
      emotion: 'proud' as const
    };
  }
  
  if (budgetStreak && budgetStreak > 7) {
    return {
      message: `${budgetStreak} days strong! Your consistency is paying off beautifully! ✨`,
      emotion: 'excited' as const
    };
  }
  
  return {
    message: "Ready to crush your financial goals today? I believe in you! 🚀",
    emotion: 'happy' as const
  };
};

export default function SmartieCorner({ budgetStreak, budgetPercentage, totalSpent, monthlyIncome }: SmartieCornerProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [currentMotivation, setCurrentMotivation] = useState(0);
  
  const smartieMessage = getSmartieMessage(budgetPercentage, budgetStreak);
  
  useEffect(() => {
    // Rotate tips and motivations daily
    const today = new Date().getDate();
    setCurrentTip(today % financialTips.length);
    setCurrentMotivation(today % dailyMotivations.length);
  }, []);

  const getNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % financialTips.length);
  };

  const getNextMotivation = () => {
    setCurrentMotivation((prev) => (prev + 1) % dailyMotivations.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Main Smartie Message */}
      <Card className="shadow-lg border-l-4 border-l-teal-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Smartie's Corner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Smartie 
            message={smartieMessage.message}
            emotion={smartieMessage.emotion}
            showTyping={false}
          />
        </CardContent>
      </Card>

      {/* Daily Motivation */}
      <Card className="shadow-md bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Daily Motivation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {dailyMotivations[currentMotivation]}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getNextMotivation}
                className="mt-2 h-6 px-2 text-xs"
              >
                <RefreshCw size={12} className="mr-1" />
                New Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Tip */}
      <Card className="shadow-md bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Smart Tip</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {financialTips[currentTip]}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getNextTip}
                className="mt-2 h-6 px-2 text-xs"
              >
                <RefreshCw size={12} className="mr-1" />
                New Tip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              <span className="font-medium">Your Progress</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {budgetStreak ? `${budgetStreak} day streak` : 'Building streak...'}
              </div>
              <div className="text-xs text-gray-500">
                {budgetPercentage.toFixed(0)}% budget remaining
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}