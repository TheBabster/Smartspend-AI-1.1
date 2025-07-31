import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Brain, 
  Sparkles,
  Zap,
  Calendar,
  MessageSquare,
  Trophy,
  Heart
} from 'lucide-react';

interface SmartieCoachingSummaryProps {
  weeklySpending: number;
  smartPurchases: number;
  streak: number;
  personalityMode: 'motivational' | 'funny' | 'strict' | 'chill';
  onPersonalityChange: (mode: 'motivational' | 'funny' | 'strict' | 'chill') => void;
}

export default function SmartieCoachingSummary({ 
  weeklySpending, 
  smartPurchases, 
  streak,
  personalityMode,
  onPersonalityChange 
}: SmartieCoachingSummaryProps) {
  const [currentChallenge, setCurrentChallenge] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

  const challenges = [
    "Can you go 3 days with no impulse buys? 🎯",
    "Try tagging emotions after every purchase for a week 💭",
    "Skip one subscription this month and save extra 💰",
    "Compare prices before buying anything over £20 🔍",
    "Cook at home 5 days this week instead of ordering 👨‍🍳"
  ];

  const getPersonalityResponse = () => {
    const responses = {
      motivational: {
        message: `Amazing progress! You've made ${smartPurchases || 0} smart decisions this week! 🌟`,
        badge: "🧠 Strategic Thinker",
        tone: "You're building incredible financial habits!"
      },
      funny: {
        message: `${smartPurchases || 0} smart buys? Your wallet is doing the happy dance! 💃`,
        badge: "🎭 Budget Comedian",
        tone: "Even your bank account is laughing... with joy!"
      },
      strict: {
        message: `${smartPurchases || 0} smart decisions. Keep this discipline up.`,
        badge: "⚡ Discipline Master",
        tone: "No room for slip-ups. Excellence is the standard."
      },
      chill: {
        message: `Nice and easy, ${smartPurchases || 0} good choices this week. 😌`,
        badge: "🌱 Zen Spender",
        tone: "Take it slow, you're doing great."
      }
    };
    return responses[personalityMode];
  };

  useEffect(() => {
    if (streak >= 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [streak]);

  useEffect(() => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(randomChallenge);
  }, []);

  const personality = getPersonalityResponse();

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="mood">Personality</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <ModernSmartieAvatar 
                mood={streak >= 3 ? 'celebrating' : 'happy'} 
                size="lg"
              />
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, -60],
                        opacity: [1, 0],
                        scale: [1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1
                      }}
                    >
                      🎉
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {personality?.badge || "🧠 Smart Spender"}
                </Badge>
                <span className="text-sm text-gray-600">This week</span>
              </div>
              
              <motion.p 
                key={personalityMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-1"
              >
                {personality?.message || "Keep up the great work with your smart spending!"}
              </motion.p>
              
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {personality?.tone || "You're building excellent financial habits!"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <Brain className="w-6 h-6 mx-auto mb-1 text-purple-600" />
              <div className="font-bold text-lg">{smartPurchases || 0}</div>
              <div className="text-xs text-gray-600">Smart Buys</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <Zap className="w-6 h-6 mx-auto mb-1 text-orange-600" />
              <div className="font-bold text-lg">{streak || 0}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="font-bold text-lg">£{(weeklySpending || 0).toFixed(0)}</div>
              <div className="text-xs text-gray-600">This Week</div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-4">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="font-semibold text-lg mb-2">Weekly Challenge</h3>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
            >
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {currentChallenge}
              </p>
            </motion.div>
            
            <Button 
              onClick={() => {
                const newChallenge = challenges[Math.floor(Math.random() * challenges.length)];
                setCurrentChallenge(newChallenge);
              }}
              variant="outline" 
              className="mt-3"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Challenge
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4 mt-4">
          <div className="text-center mb-4">
            <Heart className="w-12 h-12 mx-auto mb-3 text-pink-600" />
            <h3 className="font-semibold text-lg mb-2">Smartie's Personality</h3>
            <p className="text-sm text-gray-600">Choose how Smartie talks to you</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {(['motivational', 'funny', 'strict', 'chill'] as const).map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPersonalityChange(mode)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  personalityMode === mode
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="text-lg mb-1">
                  {mode === 'motivational' && '🌟'}
                  {mode === 'funny' && '😄'}
                  {mode === 'strict' && '⚡'}
                  {mode === 'chill' && '😌'}
                </div>
                <div className="text-sm font-medium capitalize">{mode}</div>
              </motion.button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-lg mb-2">Smart Insights</h3>
          </div>
          
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                💡 You tend to spend more on Entertainment during weekends. Try planning free activities instead.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
            >
              <p className="text-green-800 dark:text-green-200 text-sm">
                ✅ You make 73% smarter choices after gym days. Exercise = better financial decisions!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
            >
              <p className="text-orange-800 dark:text-orange-200 text-sm">
                ⚠️ Thursday evenings show 40% higher impulse purchases. Set phone reminders to pause and think.
              </p>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}