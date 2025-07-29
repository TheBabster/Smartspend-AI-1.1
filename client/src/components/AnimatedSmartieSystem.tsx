import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExactSmartieAvatar from './ExactSmartieAvatar';

// Smartie dialogue map with randomized variants
const dialogueMap = {
  streakAchieved: [
    "Legendary saver! 🌟",
    "You're on fire! 🔥", 
    "Streak master! 💪",
    "Amazing progress! ✨"
  ],
  overspent: [
    "Oof! Time to cut back... 😅",
    "Let's slow down spending! 🛑",
    "Budget alert! 🚨",
    "Rein it in, champ! 💡"
  ],
  goodSpending: [
    "Nice control! 👏",
    "Smart choices! 🎯",
    "You're crushing it! 💎",
    "Perfect balance! ⚖️"
  ],
  expenseEntry: [
    "Got it logged! 📝",
    "Tracking that! 👀",
    "Added to your books! 📊",
    "Noted! 📋"
  ],
  purchaseDecision: [
    "Smart thinking! 🧠",
    "Wise choice! 💭",
    "Good decision! ✅",
    "You've got this! 💪"
  ],
  encouragement: [
    "Keep going! 🚀",
    "You're doing great! ⭐",
    "Stay strong! 💪",
    "Almost there! 🎯"
  ]
};

interface SmartieReaction {
  type: 'celebration' | 'concern' | 'encouragement' | 'coaching';
  message: string;
  pose: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'nervous';
  duration?: number;
}

interface AnimatedSmartieSystemProps {
  trigger?: string;
  spendingData?: {
    category: string;
    percentage: number;
    status: 'overspent' | 'at-risk' | 'on-track';
  }[];
  streakCount?: number;
  className?: string;
}

export const AnimatedSmartieSystem: React.FC<AnimatedSmartieSystemProps> = ({
  trigger,
  spendingData = [],
  streakCount = 0,
  className = ""
}) => {
  const [currentReaction, setCurrentReaction] = useState<SmartieReaction | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Get random dialogue variant
  const getRandomDialogue = (category: keyof typeof dialogueMap): string => {
    const options = dialogueMap[category];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Generate contextual reactions based on spending data
  const generateContextualReaction = useCallback((): SmartieReaction | null => {
    if (!spendingData.length) return null;

    const overspentCategories = spendingData.filter(item => item.status === 'overspent');
    const atRiskCategories = spendingData.filter(item => item.status === 'at-risk');
    const onTrackCategories = spendingData.filter(item => item.status === 'on-track');

    // Streak celebration
    if (streakCount >= 21) {
      return {
        type: 'celebration',
        message: getRandomDialogue('streakAchieved'),
        pose: 'celebrating',
        duration: 4000
      };
    }

    // Overspending concern
    if (overspentCategories.length >= 2) {
      return {
        type: 'concern',
        message: `${getRandomDialogue('overspent')} You're over budget in ${overspentCategories.length} categories!`,
        pose: 'concerned',
        duration: 5000
      };
    }

    // Good spending praise
    if (onTrackCategories.length >= 3 && overspentCategories.length === 0) {
      return {
        type: 'encouragement',
        message: `${getRandomDialogue('goodSpending')} ${onTrackCategories.length} categories on track!`,
        pose: 'happy',
        duration: 3000
      };
    }

    // At-risk warning
    if (atRiskCategories.length >= 2) {
      return {
        type: 'coaching',
        message: `Watch out! ${atRiskCategories.length} categories approaching limits 📊`,
        pose: 'thinking',
        duration: 4000
      };
    }

    return null;
  }, [spendingData, streakCount]);

  // React to triggers
  useEffect(() => {
    if (!trigger) return;

    let reaction: SmartieReaction | null = null;

    switch (trigger) {
      case 'expense-entry':
        reaction = {
          type: 'encouragement',
          message: getRandomDialogue('expenseEntry'),
          pose: 'happy',
          duration: 2000
        };
        break;
      case 'purchase-decision':
        reaction = {
          type: 'encouragement',
          message: getRandomDialogue('purchaseDecision'),
          pose: 'thinking',
          duration: 3000
        };
        break;
      case 'streak-update':
        reaction = {
          type: 'celebration',
          message: getRandomDialogue('streakAchieved'),
          pose: 'celebrating',
          duration: 4000
        };
        break;
      default:
        reaction = generateContextualReaction();
        break;
    }

    if (reaction) {
      setCurrentReaction(reaction);
      setShowSpeechBubble(true);
      
      // Auto-hide speech bubble
      setTimeout(() => {
        setShowSpeechBubble(false);
      }, reaction.duration || 3000);

      // Reset reaction
      setTimeout(() => {
        setCurrentReaction(null);
      }, (reaction.duration || 3000) + 500);
    }
  }, [trigger, generateContextualReaction]);

  // Auto-generate periodic reactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentReaction && Math.random() < 0.3) { // 30% chance every interval
        const reaction = generateContextualReaction();
        if (reaction) {
          setCurrentReaction(reaction);
          setShowSpeechBubble(true);
          
          setTimeout(() => {
            setShowSpeechBubble(false);
          }, reaction.duration || 3000);

          setTimeout(() => {
            setCurrentReaction(null);
          }, (reaction.duration || 3000) + 500);
        }
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [currentReaction, generateContextualReaction]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      {/* Smartie Character */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative"
      >
        <ExactSmartieAvatar
          pose={currentReaction?.pose || 'happy'}
          animated={true}
          animationType={
            currentReaction?.type === 'celebration' ? 'milestone' :
            currentReaction?.type === 'concern' ? 'negative' : 'positive'
          }
          size={80}
          className="hover:scale-110 transition-transform cursor-pointer"
        />

        {/* Speech Bubble */}
        <AnimatePresence>
          {showSpeechBubble && currentReaction && (
            <motion.div
              initial={{ scale: 0, opacity: 0, x: -20, y: 10 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0, opacity: 0, x: -20, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-full left-full ml-2 mb-2 max-w-xs"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg border-2 border-gray-200 dark:border-gray-600 relative">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {currentReaction.message}
                </div>
                
                {/* Speech bubble tail */}
                <div className="absolute bottom-0 left-0 transform translate-y-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
                  <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-600"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reaction Type Indicator */}
        {currentReaction && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentReaction.type === 'celebration' ? 'bg-green-500 text-white' :
              currentReaction.type === 'concern' ? 'bg-red-500 text-white' :
              currentReaction.type === 'coaching' ? 'bg-blue-500 text-white' :
              'bg-yellow-500 text-white'
            }`}
          >
            {currentReaction.type === 'celebration' ? '🎉' :
             currentReaction.type === 'concern' ? '⚠️' :
             currentReaction.type === 'coaching' ? '💡' : '👍'}
          </motion.div>
        )}
      </motion.div>

      {/* Hide/Show Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -top-2 -right-8 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
      >
        ×
      </motion.button>
    </div>
  );
};

// Event system for Smartie reactions
export const useSmartieReactions = () => {
  const [trigger, setTrigger] = useState<string>('');

  const triggerReaction = useCallback((reactionType: string) => {
    setTrigger(reactionType);
    // Reset trigger after a short delay
    setTimeout(() => setTrigger(''), 100);
  }, []);

  return {
    trigger,
    triggerReaction
  };
};