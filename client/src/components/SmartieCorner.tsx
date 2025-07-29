import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import SmartieAnimated from "./SmartieAnimated";
import { Sparkles, TrendingUp, Target, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SmartieMessage {
  type: 'motivation' | 'tip' | 'insight' | 'celebration';
  title: string;
  message: string;
  mood: 'happy' | 'thinking' | 'celebrating' | 'proud';
  showCoin?: boolean;
}

export default function SmartieCorner() {
  const [currentMessage, setCurrentMessage] = useState<SmartieMessage>({
    type: 'motivation',
    title: "Welcome back!",
    message: "Ready to make some smart spending decisions today?",
    mood: 'happy'
  });
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  // Fetch user data to personalize messages
  const { data: user } = useQuery({ queryKey: ['/api/user'] });
  const { data: budgets } = useQuery({ queryKey: ['/api/budgets'] });
  const { data: streaks } = useQuery({ queryKey: ['/api/streaks'] });

  const currentStreak = Array.isArray(streaks) && streaks.length > 0 ? streaks[0].currentStreak : 7;
  const healthyBudgets = Array.isArray(budgets) ? budgets.filter(b => (parseFloat(b.spent) / parseFloat(b.monthlyLimit)) < 0.8).length : 3;

  const smartieMessages: SmartieMessage[] = [
    {
      type: 'motivation',
      title: "You're doing great!",
      message: "Every smart choice you make today builds a stronger financial future. I believe in you! 💪",
      mood: 'proud'
    },
    {
      type: 'tip',
      title: "Smart Tip",
      message: "Before buying something, try the 24-hour rule. Sleep on it - you might realize you don't really need it!",
      mood: 'thinking'
    },
    {
      type: 'insight',
      title: "Brain Power",
      message: "Your brain is wired to want instant gratification, but YOU have the power to choose long-term happiness over short-term pleasure!",
      mood: 'happy'
    },
    {
      type: 'celebration',
      title: "Streak Power!",
      message: `Amazing! You're on a ${currentStreak}-day streak! Every day you stay on track, you're rewiring your brain for success! 🎉`,
      mood: 'celebrating',
      showCoin: true
    },
    {
      type: 'tip',
      title: "Money Mindset",
      message: "Think of money as stored time and energy. Every purchase is trading your life energy - make it count!",
      mood: 'thinking'
    },
    {
      type: 'motivation',
      title: "Budget Champion",
      message: `You've got this! ${healthyBudgets} of your budgets are looking healthy. Keep it up!`,
      mood: 'proud'
    }
  ];

  // Typing animation effect
  useEffect(() => {
    if (!currentMessage.message) return;
    
    setIsTyping(true);
    setDisplayedText("");
    
    let index = 0;
    const typeInterval = setInterval(() => {
      setDisplayedText(currentMessage.message.slice(0, index + 1));
      index++;
      
      if (index >= currentMessage.message.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentMessage.message]);

  // Rotate messages every 10 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomMessage = smartieMessages[Math.floor(Math.random() * smartieMessages.length)];
      setCurrentMessage(randomMessage);
    }, 10000);

    return () => clearInterval(messageInterval);
  }, []);

  const getIcon = () => {
    switch (currentMessage.type) {
      case 'motivation': return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'tip': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'celebration': return <Target className="w-4 h-4 text-pink-500" />;
      default: return <Sparkles className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 p-4">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/30 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-start gap-4">
          {/* Animated Smartie */}
          <div className="flex-shrink-0">
            <SmartieAnimated 
              mood={currentMessage.mood}
              size="md"
              showCoin={currentMessage.showCoin}
              isIdle={!isTyping}
            />
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={currentMessage.title}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              {getIcon()}
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {currentMessage.title}
              </h3>
            </motion.div>

            <div className="relative">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[2.5rem]">
                {displayedText}
                <AnimatePresence>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-0.5 h-4 bg-purple-500 ml-1"
                    />
                  )}
                </AnimatePresence>
              </p>
            </div>

            {/* Interactive elements */}
            <div className="flex items-center gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const randomMessage = smartieMessages[Math.floor(Math.random() * smartieMessages.length)];
                  setCurrentMessage(randomMessage);
                }}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Tell me more
              </motion.button>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Smartie's Corner
              </span>
            </div>
          </div>
        </div>

        {/* Subtle animation particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-300 dark:bg-purple-500 rounded-full opacity-40"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}