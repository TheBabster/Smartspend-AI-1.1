import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface EmotionalContext {
  type: 'purchase' | 'goal_achieved' | 'budget_warning' | 'streak_milestone' | 'spending_pattern' | 'idle';
  data?: {
    amount?: number;
    category?: string;
    utilityScore?: number;
    streakDays?: number;
    goalName?: string;
    budgetHealth?: 'good' | 'warning' | 'danger';
  };
}

interface SmartieEmotion {
  mood: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  message: string;
  animation: "greeting" | "thinking" | "positive" | "milestone" | "warning" | "idle";
  duration: number;
  priority: 'low' | 'medium' | 'high';
}

interface EmotionalSmartieSystemProps {
  context: EmotionalContext;
  userFinancialScore: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const EmotionalSmartieSystem: React.FC<EmotionalSmartieSystemProps> = ({
  context,
  userFinancialScore,
  className = "",
  size = "md"
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<SmartieEmotion | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [emotionQueue, setEmotionQueue] = useState<SmartieEmotion[]>([]);

  // Generate context-aware emotional responses
  const generateEmotionalResponse = useCallback((ctx: EmotionalContext): SmartieEmotion => {
    const { type, data } = ctx;
    
    switch (type) {
      case 'purchase':
        if (data?.utilityScore && data.utilityScore >= 8) {
          return {
            mood: "celebrating",
            message: `Smart choice! That's a ${data.utilityScore}/10 utility score! 🎯`,
            animation: "positive",
            duration: 4000,
            priority: 'medium'
          };
        } else if (data?.utilityScore && data.utilityScore < 5) {
          return {
            mood: "concerned",
            message: `Hmm, only ${data.utilityScore}/10? Let's think twice next time! 🤔`,
            animation: "thinking",
            duration: 5000,
            priority: 'high'
          };
        } else if (data?.amount && data.amount > 100) {
          return {
            mood: "thinking",
            message: `£${data.amount}? That's a big one! Hope it brings real value! 💭`,
            animation: "thinking",
            duration: 4000,
            priority: 'medium'
          };
        }
        return {
          mood: "happy",
          message: "Purchase logged! Every spending decision is a learning opportunity! 📝",
          animation: "greeting",
          duration: 3000,
          priority: 'low'
        };

      case 'goal_achieved':
        return {
          mood: "celebrating",
          message: `🎉 GOAL SMASHED! ${data?.goalName || 'Your goal'} is complete! You're unstoppable!`,
          animation: "milestone",
          duration: 6000,
          priority: 'high'
        };

      case 'budget_warning':
        if (data?.budgetHealth === 'danger') {
          return {
            mood: "worried",
            message: "Budget alert! 🚨 Let's pause and reassess. You've got this!",
            animation: "warning",
            duration: 5000,
            priority: 'high'
          };
        } else {
          return {
            mood: "thinking",
            message: "Getting close to your budget limit. Time to be extra mindful! ⚖️",
            animation: "thinking",
            duration: 4000,
            priority: 'medium'
          };
        }

      case 'streak_milestone':
        const days = data?.streakDays || 0;
        if (days >= 30) {
          return {
            mood: "celebrating",
            message: `🔥 LEGENDARY! ${days} days of smart decisions! You're a financial wizard!`,
            animation: "milestone",
            duration: 6000,
            priority: 'high'
          };
        } else if (days >= 7) {
          return {
            mood: "celebrating",
            message: `🌟 ${days}-day streak! Consistency is your superpower!`,
            animation: "positive",
            duration: 4000,
            priority: 'medium'
          };
        } else {
          return {
            mood: "happy",
            message: `Nice! ${days} days strong. Every day counts! 💪`,
            animation: "positive",
            duration: 3000,
            priority: 'low'
          };
        }

      case 'spending_pattern':
        if (userFinancialScore >= 85) {
          return {
            mood: "confident",
            message: "Your spending patterns are looking fantastic! Keep up the excellent work! ⭐",
            animation: "positive",
            duration: 4000,
            priority: 'medium'
          };
        } else if (userFinancialScore >= 70) {
          return {
            mood: "thinking",
            message: "Good progress! I see some areas where we can optimize further. 📈",
            animation: "thinking",
            duration: 4000,
            priority: 'medium'
          };
        } else {
          return {
            mood: "concerned",
            message: "Let's work together to improve your financial wellness. Small steps, big results! 🌱",
            animation: "thinking",
            duration: 5000,
            priority: 'high'
          };
        }

      case 'idle':
      default:
        const idleMessages = [
          {
            mood: "happy" as const,
            message: "Ready to make some smart money moves? I'm here to help! 😊",
            animation: "greeting" as const,
            duration: 3000,
            priority: 'low' as const
          },
          {
            mood: "thinking" as const,
            message: "Tip: The 24-hour rule works wonders for impulse purchases! ⏰",
            animation: "thinking" as const,
            duration: 4000,
            priority: 'low' as const
          },
          {
            mood: "confident" as const,
            message: "Every financial decision shapes your future. Choose wisely! 🌟",
            animation: "positive" as const,
            duration: 4000,
            priority: 'low' as const
          }
        ];
        return idleMessages[Math.floor(Math.random() * idleMessages.length)];
    }
  }, [userFinancialScore]);

  // Priority queue system for emotions
  const queueEmotion = useCallback((emotion: SmartieEmotion) => {
    setEmotionQueue(prev => {
      const newQueue = [...prev, emotion];
      // Sort by priority (high > medium > low)
      return newQueue.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    });
  }, []);

  // Process emotion queue
  useEffect(() => {
    if (!currentEmotion && emotionQueue.length > 0) {
      const nextEmotion = emotionQueue[0];
      setCurrentEmotion(nextEmotion);
      setIsVisible(true);
      setEmotionQueue(prev => prev.slice(1));

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentEmotion(null), 300); // Allow exit animation
      }, nextEmotion.duration);

      return () => clearTimeout(timer);
    }
  }, [currentEmotion, emotionQueue]);

  // React to context changes
  useEffect(() => {
    if (context.type !== 'idle') {
      const emotion = generateEmotionalResponse(context);
      queueEmotion(emotion);
    }
  }, [context, generateEmotionalResponse, queueEmotion]);

  // Idle behavior - show tips or encouragement periodically
  useEffect(() => {
    const idleTimer = setInterval(() => {
      if (!currentEmotion && emotionQueue.length === 0 && context.type === 'idle') {
        const idleEmotion = generateEmotionalResponse({ type: 'idle' });
        queueEmotion(idleEmotion);
      }
    }, 15000); // Every 15 seconds when idle

    return () => clearInterval(idleTimer);
  }, [currentEmotion, emotionQueue.length, context.type, generateEmotionalResponse, queueEmotion]);

  if (!currentEmotion) {
    return (
      <div className={`w-12 h-12 ${className}`}>
        <ExactSmartieAvatar 
          mood="happy" 
          size={size} 
          animated={false}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className={`relative ${className}`}
        >
          <Card className="shadow-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 max-w-xs">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex-shrink-0">
                  <ExactSmartieAvatar
                    mood={currentEmotion.mood}
                    size={size}
                    animated={true}
                    animationType={currentEmotion.animation}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <motion.p 
                    className="text-sm font-medium text-gray-800 leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentEmotion.message}
                  </motion.p>
                  
                  {/* Priority indicator */}
                  {currentEmotion.priority === 'high' && (
                    <motion.div
                      className="mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full inline-block"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Important
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Dismiss button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 transition-colors"
              >
                ×
              </button>
            </CardContent>
          </Card>

          {/* Celebration effects for high-priority positive emotions */}
          {currentEmotion.priority === 'high' && currentEmotion.mood === 'celebrating' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmotionalSmartieSystem;