import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface ContextualReaction {
  trigger: 'purchase' | 'goal_progress' | 'budget_exceeded' | 'streak_broken' | 'milestone_hit' | 'app_open' | 'idle';
  condition?: (data: any) => boolean;
  reactions: {
    mood: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
    message: string;
    animation: "greeting" | "thinking" | "positive" | "milestone" | "warning" | "idle";
    duration: number;
    sound?: string; // For future audio implementation
  }[];
}

interface ContextualSmartieReactionsProps {
  currentEvent: {
    type: string;
    data?: any;
  };
  userContext: {
    financialScore: number;
    streak: number;
    totalSaved: number;
    lastPurchaseAmount?: number;
    budgetHealth: 'good' | 'warning' | 'danger';
  };
  position?: 'fixed' | 'inline';
  className?: string;
}

const ContextualSmartieReactions: React.FC<ContextualSmartieReactionsProps> = ({
  currentEvent,
  userContext,
  position = 'fixed',
  className = ""
}) => {
  const [currentReaction, setCurrentReaction] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Define contextual reaction rules
  const reactionRules: ContextualReaction[] = [
    // Purchase reactions
    {
      trigger: 'purchase',
      condition: (data) => data.utilityScore >= 8,
      reactions: [
        {
          mood: "celebrating",
          message: `Brilliant choice! ${data?.utilityScore}/10 utility score! You're getting smarter with money! 🎯`,
          animation: "positive",
          duration: 4000
        }
      ]
    },
    {
      trigger: 'purchase',
      condition: (data) => data.utilityScore < 4,
      reactions: [
        {
          mood: "concerned",
          message: `Hmm, only ${data?.utilityScore}/10? Let's learn from this one! Every mistake is wisdom gained! 🤔`,
          animation: "thinking",
          duration: 5000
        }
      ]
    },
    {
      trigger: 'purchase',
      condition: (data) => data.amount > 100,
      reactions: [
        {
          mood: "thinking",
          message: `Whoa! £${data?.amount}? That's a significant purchase. Hope it brings genuine value to your life! 💭`,
          animation: "thinking",
          duration: 4500
        }
      ]
    },
    {
      trigger: 'purchase',
      condition: (data) => data.category === 'Food & Dining' && data.amount > 30,
      reactions: [
        {
          mood: "thinking",
          message: `£${data?.amount} for food? Sometimes experiences are worth it, but let's keep an eye on dining expenses! 🍽️`,
          animation: "thinking",
          duration: 4000
        }
      ]
    },

    // Goal and milestone reactions
    {
      trigger: 'goal_progress',
      condition: (data) => data.progressPercent >= 100,
      reactions: [
        {
          mood: "celebrating",
          message: `🎉 GOAL ACHIEVED! You saved £${data?.targetAmount}! You're unstoppable! This is how wealth is built!`,
          animation: "milestone",
          duration: 6000
        }
      ]
    },
    {
      trigger: 'goal_progress',
      condition: (data) => data.progressPercent >= 75,
      reactions: [
        {
          mood: "confident",
          message: `So close! You're 75% there with your ${data?.goalName}! The finish line is within reach! 🏁`,
          animation: "positive",
          duration: 4000
        }
      ]
    },
    {
      trigger: 'goal_progress',
      condition: (data) => data.progressPercent >= 50,
      reactions: [
        {
          mood: "happy",
          message: `Halfway there! Your ${data?.goalName} is 50% complete. Momentum is building! 📈`,
          animation: "positive",
          duration: 3500
        }
      ]
    },

    // Budget health reactions
    {
      trigger: 'budget_exceeded',
      condition: (data) => data.overspendAmount < 20,
      reactions: [
        {
          mood: "thinking",
          message: `You went £${data?.overspendAmount} over budget. Small overage - let's tighten up for the rest of the month! 📊`,
          animation: "thinking",
          duration: 4000
        }
      ]
    },
    {
      trigger: 'budget_exceeded',
      condition: (data) => data.overspendAmount >= 20,
      reactions: [
        {
          mood: "concerned",
          message: `Budget alert! £${data?.overspendAmount} over limit. Time for a spending pause and reassessment! 🚨`,
          animation: "warning",
          duration: 5000
        }
      ]
    },

    // Streak reactions
    {
      trigger: 'milestone_hit',
      condition: (data) => data.streakDays === 7,
      reactions: [
        {
          mood: "celebrating",
          message: `🔥 FIRST WEEK COMPLETE! 7 days of smart financial decisions! You're building incredible habits!`,
          animation: "milestone",
          duration: 5000
        }
      ]
    },
    {
      trigger: 'milestone_hit',
      condition: (data) => data.streakDays === 30,
      reactions: [
        {
          mood: "celebrating",
          message: `🏆 LEGENDARY! 30-day streak! You've officially transformed your financial mindset! Incredible work!`,
          animation: "milestone",
          duration: 6000
        }
      ]
    },
    {
      trigger: 'streak_broken',
      reactions: [
        {
          mood: "thinking",
          message: `Streak reset, but that's okay! Every expert was once a beginner. Let's start fresh and stronger! 💪`,
          animation: "thinking",
          duration: 4500
        }
      ]
    },

    // App interaction reactions
    {
      trigger: 'app_open',
      condition: () => userContext.financialScore >= 85,
      reactions: [
        {
          mood: "confident",
          message: `Welcome back, financial rockstar! Your ${userContext.financialScore} wellness score is impressive! 🌟`,
          animation: "greeting",
          duration: 3500
        }
      ]
    },
    {
      trigger: 'app_open',
      condition: () => userContext.streak >= 7,
      reactions: [
        {
          mood: "happy",
          message: `${userContext.streak} days strong! Ready to make today another smart money day? 🗓️`,
          animation: "greeting",
          duration: 3000
        }
      ]
    },
    {
      trigger: 'app_open',
      condition: () => userContext.budgetHealth === 'danger',
      reactions: [
        {
          mood: "concerned",
          message: `Let's check your budget together today. I'm here to help you get back on track! 📋`,
          animation: "thinking",
          duration: 4000
        }
      ]
    },

    // Idle motivational messages
    {
      trigger: 'idle',
      reactions: [
        {
          mood: "happy",
          message: "💡 Smart tip: The 24-hour rule prevents 80% of impulse purchases! Try it next time you want something!",
          animation: "thinking",
          duration: 4000
        },
        {
          mood: "confident",
          message: "🌱 Every small financial decision today shapes your future wealth. Choose wisely!",
          animation: "positive",
          duration: 4000
        },
        {
          mood: "thinking",
          message: "📊 Did you know? People who track expenses spend 15-20% less on average? You're already ahead!",
          animation: "thinking",
          duration: 4500
        },
        {
          mood: "happy",
          message: "🎯 Remember: You're not restricting yourself, you're redirecting yourself toward your goals!",
          animation: "positive",
          duration: 4000
        }
      ]
    }
  ];

  // Find matching reaction based on current event
  const findReaction = () => {
    const matchingRules = reactionRules.filter(rule => 
      rule.trigger === currentEvent.type &&
      (!rule.condition || rule.condition(currentEvent.data))
    );

    if (matchingRules.length === 0) return null;

    // Select first matching rule and random reaction from it
    const selectedRule = matchingRules[0];
    const randomReaction = selectedRule.reactions[
      Math.floor(Math.random() * selectedRule.reactions.length)
    ];

    return randomReaction;
  };

  // React to event changes
  useEffect(() => {
    if (currentEvent.type && currentEvent.type !== 'none') {
      const reaction = findReaction();
      if (reaction) {
        setCurrentReaction(reaction);
        setIsVisible(true);

        // Auto-hide after duration
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setCurrentReaction(null), 500);
        }, reaction.duration);

        return () => clearTimeout(timer);
      }
    }
  }, [currentEvent]);

  if (!currentReaction || !isVisible) return null;

  const positionClasses = position === 'fixed' 
    ? "fixed bottom-24 right-4 z-50 max-w-xs"
    : "relative max-w-full";

  return (
    <motion.div
      className={`${positionClasses} ${className}`}
      initial={{ opacity: 0, scale: 0.8, x: position === 'fixed' ? 100 : 0, y: position === 'fixed' ? 20 : 10 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: position === 'fixed' ? 100 : 0, y: position === 'fixed' ? -20 : -10 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      <div className="bg-white/90 backdrop-blur-lg border-2 border-purple-200/50 rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 flex-shrink-0">
            <ExactSmartieAvatar
              mood={currentReaction.mood}
              size="md"
              animated={true}
              animationType={currentReaction.animation}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {currentReaction.message}
            </p>
          </div>
        </div>
        
        {/* Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 w-5 h-5 bg-gray-200/80 hover:bg-gray-300/80 rounded-full flex items-center justify-center text-xs text-gray-600 transition-colors"
        >
          ×
        </button>

        {/* Special effects for celebrations */}
        {currentReaction.mood === 'celebrating' && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
                style={{
                  left: `${20 + (i % 4) * 20}%`,
                  top: `${15 + Math.floor(i / 4) * 25}%`,
                }}
                animate={{
                  y: [-5, -25, -5],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ContextualSmartieReactions;