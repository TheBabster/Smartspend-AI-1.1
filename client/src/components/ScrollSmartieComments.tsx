import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface SmartieComment {
  id: string;
  message: string;
  mood: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  triggerAmount?: number;
  category?: string;
  emoji?: string;
}

interface ScrollSmartieCommentsProps {
  purchases: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    utilityScore: number;
  }>;
}

const ScrollSmartieComments: React.FC<ScrollSmartieCommentsProps> = ({ purchases }) => {
  const [currentComment, setCurrentComment] = useState<SmartieComment | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastTriggerAmount, setLastTriggerAmount] = useState(0);

  const generateSmartieComments = (): SmartieComment[] => {
    const comments: SmartieComment[] = [];
    
    // Analyze purchases for interesting patterns
    purchases.forEach((purchase, index) => {
      // High-value purchases
      if (purchase.amount > 100) {
        comments.push({
          id: `high-${purchase.id}`,
          message: `Whoa! £${purchase.amount} on ${purchase.name}? That's a big one! 💸`,
          mood: "concerned",
          triggerAmount: purchase.amount,
          category: purchase.category,
          emoji: "😰"
        });
      }
      
      // Low utility purchases
      if (purchase.utilityScore < 4) {
        comments.push({
          id: `regret-${purchase.id}`,
          message: `Hmm, that ${purchase.name} scored only ${purchase.utilityScore}/10. Live and learn! 🤔`,
          mood: "thinking",
          triggerAmount: purchase.amount,
          category: purchase.category,
          emoji: "🤭"
        });
      }
      
      // Food spending patterns
      if (purchase.category === "Food & Dining" && purchase.amount > 30) {
        comments.push({
          id: `food-${purchase.id}`,
          message: `£${purchase.amount} for food? Hope it was delicious! 🍽️`,
          mood: "happy",
          triggerAmount: purchase.amount,
          category: purchase.category,
          emoji: "🍕"
        });
      }
      
      // Shopping category insights
      if (purchase.category === "Shopping" && purchase.utilityScore < 6) {
        comments.push({
          id: `shop-${purchase.id}`,
          message: `Another shopping trip? Let's think twice next time! 🛍️`,
          mood: "concerned",
          triggerAmount: purchase.amount,
          category: purchase.category,
          emoji: "🛒"
        });
      }
    });

    // Pattern-based comments
    const multipleAmazon = purchases.filter(p => p.name.toLowerCase().includes("amazon")).length;
    if (multipleAmazon >= 3) {
      comments.push({
        id: "amazon-pattern",
        message: `${multipleAmazon} Amazon orders recently? Easy there, Jeff Bezos! 📦`,
        mood: "concerned",
        emoji: "📦"
      });
    }

    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
    if (totalSpent > 500) {
      comments.push({
        id: "total-high",
        message: `£${totalSpent.toFixed(0)} total? That's some serious spending power! 💪`,
        mood: "thinking",
        emoji: "💰"
      });
    }

    return comments;
  };

  const smartieComments = generateSmartieComments();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Trigger comments based on scroll position
      const scrollPercent = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      // Show comments at different scroll milestones
      if (scrollPercent > 25 && scrollPercent < 30 && lastTriggerAmount !== 25) {
        const comment = smartieComments[0];
        if (comment) {
          setCurrentComment(comment);
          setLastTriggerAmount(25);
          setTimeout(() => setCurrentComment(null), 4000);
        }
      } else if (scrollPercent > 50 && scrollPercent < 55 && lastTriggerAmount !== 50) {
        const comment = smartieComments[1];
        if (comment) {
          setCurrentComment(comment);
          setLastTriggerAmount(50);
          setTimeout(() => setCurrentComment(null), 4000);
        }
      } else if (scrollPercent > 75 && scrollPercent < 80 && lastTriggerAmount !== 75) {
        const comment = smartieComments[2];
        if (comment) {
          setCurrentComment(comment);
          setLastTriggerAmount(75);
          setTimeout(() => setCurrentComment(null), 4000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [smartieComments, lastTriggerAmount]);

  return (
    <AnimatePresence>
      {currentComment && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-24 right-4 z-50 max-w-xs"
        >
          <Card className="shadow-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ExactSmartieAvatar
                  mood={currentComment.mood}
                  size="sm"
                  animated={true}
                  animationType="greeting"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-lg">{currentComment.emoji}</span>
                    <span className="text-xs text-purple-600 font-semibold">Smartie says:</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium leading-tight">
                    {currentComment.message}
                  </p>
                </div>
              </div>
              
              {/* Dismiss button */}
              <button
                onClick={() => setCurrentComment(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 transition-colors"
              >
                ×
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollSmartieComments;