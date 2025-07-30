import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain,
  Heart,
  Calendar,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface WeeklySmartieCoachingSummaryProps {
  weeklyData: {
    smartnessScoreChange: number;
    totalSpent: number;
    goalProgress: number;
    emotionSpendingPatterns: Array<{
      emotion: string;
      amount: number;
      percentage: number;
    }>;
    regretCosts: {
      weeklyRegret: number;
      yearlyProjection: number;
      avoidedImpulses: number;
    };
    predictions: {
      goalCompletionWeeks: number;
      monthlyTrend: 'improving' | 'declining' | 'stable';
    };
    highlights: string[];
    challenges: string[];
  };
}

export default function WeeklySmartieCoachingSummary({ weeklyData }: WeeklySmartieCoachingSummaryProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (weeklyData.smartnessScoreChange > 10) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [weeklyData.smartnessScoreChange]);

  const getSmartieReaction = () => {
    if (weeklyData.smartnessScoreChange > 10) return 'celebrating';
    if (weeklyData.smartnessScoreChange < -5) return 'concerned';
    if (weeklyData.regretCosts.weeklyRegret > 50) return 'thinking';
    return 'happy';
  };

  const getScoreChangeColor = () => {
    if (weeklyData.smartnessScoreChange > 5) return 'text-green-600 bg-green-50';
    if (weeklyData.smartnessScoreChange < -5) return 'text-red-600 bg-red-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700 shadow-xl overflow-hidden relative">
      {/* Celebration animation */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                  y: [-20, -80],
                  x: [0, (Math.random() - 0.5) * 100]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1
                }}
              >
                {['🎉', '✨', '🌟', '💫', '🎊', '👏'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {/* Header with Smartie */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: showCelebration ? [1, 1.2, 1] : 1,
                rotate: showCelebration ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <ModernSmartieAvatar mood={getSmartieReaction()} size="lg" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                Weekly Financial Coaching
              </h2>
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                Your personal AI financial therapist
              </p>
            </div>
          </div>
          
          <Badge className={`${getScoreChangeColor()} border-0 px-3 py-1`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {weeklyData.smartnessScoreChange > 0 ? '+' : ''}{weeklyData.smartnessScoreChange}%
          </Badge>
        </div>

        {/* Tabs for different insights */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Emotions
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="regret" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Regret Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Weekly Highlights */}
            <div className="space-y-3">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <Award className="w-4 h-4" />
                This Week's Highlights
              </h3>
              {weeklyData.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">{highlight}</p>
                </motion.div>
              ))}
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-3">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Growth Opportunities
              </h3>
              {weeklyData.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">{challenge}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Emotion-Spending Heatmap
            </h3>
            
            <div className="space-y-3">
              {weeklyData.emotionSpendingPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.emotion}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {pattern.emotion}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      £{pattern.amount.toFixed(0)} ({pattern.percentage}%)
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        pattern.emotion === 'stressed' ? 'bg-red-400' :
                        pattern.emotion === 'happy' ? 'bg-green-400' :
                        pattern.emotion === 'bored' ? 'bg-gray-400' :
                        pattern.emotion === 'excited' ? 'bg-purple-400' :
                        'bg-blue-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pattern.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                  
                  {pattern.percentage > 30 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 1 }}
                      className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                    >
                      {pattern.emotion === 'stressed' && "Consider stress-relief activities instead of shopping"}
                      {pattern.emotion === 'bored' && "Try free activities when feeling bored"}
                      {pattern.emotion === 'excited' && "Channel excitement into saving goals"}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Future Predictions & Simulations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">Goal Timeline</h4>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  {weeklyData.predictions.goalCompletionWeeks} weeks
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  To reach your savings goal at current rate
                </p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Monthly Trend</h4>
                </div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1 capitalize">
                  {weeklyData.predictions.monthlyTrend}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Based on your spending patterns
                </p>
              </Card>
            </div>

            {/* What-if scenarios */}
            <div className="space-y-3">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-200">What-if Scenarios</h4>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    💡 If you saved £5 more each week, you'd reach your goal {Math.max(1, weeklyData.predictions.goalCompletionWeeks - 4)} weeks earlier
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    ⚡ Avoiding one impulse purchase per week could save you £{((weeklyData.regretCosts.weeklyRegret * 52)).toFixed(0)} annually
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regret" className="space-y-4">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Regret Cost Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    £{weeklyData.regretCosts.weeklyRegret}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">This week's regret spending</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    £{weeklyData.regretCosts.yearlyProjection}
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Yearly projection</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {weeklyData.regretCosts.avoidedImpulses}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Impulses avoided</p>
                </div>
              </Card>
            </div>

            {/* Regret reduction strategies */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-3">
                Smart Strategies to Reduce Regret Spending
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-indigo-700 dark:text-indigo-300">
                  • Use the 24-hour rule for purchases over £{Math.round(weeklyData.regretCosts.weeklyRegret / 3)}
                </p>
                <p className="text-indigo-700 dark:text-indigo-300">
                  • Set up a "regret fund" - save the amount you almost spent impulsively
                </p>
                <p className="text-indigo-700 dark:text-indigo-300">
                  • Track your mood before making purchases to identify patterns
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}