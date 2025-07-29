import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Heart, Brain, Sparkles } from "lucide-react";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

interface SmartieMessage {
  id: string;
  text: string;
  mood: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  type: "advice" | "celebration" | "motivation" | "warning" | "affirmation";
  trigger?: string;
}

interface EnhancedSmartiePersonalityProps {
  userMood?: "happy" | "sad" | "anxious" | "neutral";
  recentSpending?: number;
  budgetHealth?: "good" | "warning" | "danger";
  streak?: number;
}

export default function EnhancedSmartiePersonality({ 
  userMood = "neutral",
  recentSpending = 0,
  budgetHealth = "good",
  streak = 0
}: EnhancedSmartiePersonalityProps) {
  const [currentMessage, setCurrentMessage] = useState<SmartieMessage | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messageHistory, setMessageHistory] = useState<SmartieMessage[]>([]);

  // Personality-driven messages based on user state
  const smartiePersonalityMessages: SmartieMessage[] = [
    // Motivational messages
    {
      id: "motivation-1",
      text: "Remember, you're not your bank balance - you're your smart choices! 💪",
      mood: "confident",
      type: "affirmation"
    },
    {
      id: "motivation-2", 
      text: "If you wait 24 hours and still want it, it might be worth it. Trust the process! ⏰",
      mood: "thinking",
      type: "advice"
    },
    {
      id: "impulse-warning",
      text: "Impulse = Expense + Regret. Let's not do that today, okay? 🤔",
      mood: "concerned",
      type: "warning"
    },
    // Celebration messages
    {
      id: "streak-celebration",
      text: "Look at you go! That's a solid saving streak. I'm doing a little brain dance! 🧠💃",
      mood: "celebrating",
      type: "celebration"
    },
    {
      id: "budget-success",
      text: "You're saving better than 84% of users this week! Future you is going to be so grateful! ✨",
      mood: "happy",
      type: "celebration"
    },
    // Mood-adaptive responses
    {
      id: "sad-support",
      text: "I know retail therapy feels tempting when you're down. Let's take a virtual walk instead? 🌸",
      mood: "thinking",
      type: "advice",
      trigger: "sad"
    },
    {
      id: "anxious-support", 
      text: "Feeling anxious? Deep breaths. Your worth isn't measured by your spending. You've got this! 🌟",
      mood: "confident",
      type: "affirmation",
      trigger: "anxious"
    },
    // Spending warnings
    {
      id: "overspend-warning",
      text: "This is your 3rd tech purchase this week. Still think it's worth it? 🤨",
      mood: "concerned",
      type: "warning"
    },
    {
      id: "gentle-reminder",
      text: "Nice save! 💰 That's £6.49 you didn't waste! Every small win counts.",
      mood: "happy",
      type: "celebration"
    }
  ];

  // Select appropriate message based on context
  const getContextualMessage = (): SmartieMessage => {
    // Mood-specific messages
    if (userMood === "sad") {
      const sadMessages = smartiePersonalityMessages.filter(m => m.trigger === "sad");
      if (sadMessages.length > 0) return sadMessages[0];
    }
    
    if (userMood === "anxious") {
      const anxiousMessages = smartiePersonalityMessages.filter(m => m.trigger === "anxious");
      if (anxiousMessages.length > 0) return anxiousMessages[0];
    }

    // Budget health based messages
    if (budgetHealth === "danger") {
      const warningMessages = smartiePersonalityMessages.filter(m => m.type === "warning");
      return warningMessages[Math.floor(Math.random() * warningMessages.length)];
    }

    // Celebration for good streaks
    if (streak >= 5) {
      const celebrationMessages = smartiePersonalityMessages.filter(m => m.type === "celebration");
      return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    }

    // Default motivational messages
    const motivationalMessages = smartiePersonalityMessages.filter(m => 
      m.type === "motivation" || m.type === "affirmation"
    );
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  // Auto-generate contextual messages
  useEffect(() => {
    const timer = setTimeout(() => {
      const newMessage = getContextualMessage();
      setCurrentMessage(newMessage);
      setMessageHistory(prev => [newMessage, ...prev.slice(0, 4)]); // Keep last 5 messages
    }, 2000);

    return () => clearTimeout(timer);
  }, [userMood, budgetHealth, streak, recentSpending]);

  const handleNewMessage = () => {
    const newMessage = getContextualMessage();
    setCurrentMessage(newMessage);
    setMessageHistory(prev => [newMessage, ...prev.slice(0, 4)]);
  };

  return (
    <div className="relative">
      {/* Floating Smartie Chat Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
        </Button>
        
        {/* Notification dot for new messages */}
        {currentMessage && !isExpanded && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Expanded Chat Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-40 right-4 w-80 max-w-[calc(100vw-2rem)] z-40"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-purple-200/50 bg-white/95 dark:bg-gray-900/95" style={{ backdropFilter: "blur(20px)" }}>
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b border-purple-100 dark:border-purple-800/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Smartie Chat</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Your AI Financial Buddy</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNewMessage}
                      className="ml-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 max-h-80 overflow-y-auto space-y-3">
                  {currentMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 flex-shrink-0">
                        <ExactSmartieAvatar mood={currentMessage.mood} size="sm" animated={true} animationType="greeting" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-3 border border-purple-100/50 dark:border-purple-800/30">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{currentMessage.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              {currentMessage.type}
                            </span>
                            {currentMessage.type === "celebration" && <Heart className="w-3 h-3 text-red-500" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Message History */}
                  {messageHistory.slice(1).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 flex-shrink-0 opacity-60">
                        <ExactSmartieAvatar mood={message.mood} size="sm" animated={false} />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-200/50 dark:border-gray-700/30">
                          <p className="text-xs text-gray-600 dark:text-gray-400">{message.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-purple-100 dark:border-purple-800/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNewMessage()}
                      className="flex-1 text-xs"
                    >
                      💡 Get Tip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage({
                        id: "affirmation",
                        text: "You're doing great! Every small step towards financial wellness counts. Keep it up! 🌟",
                        mood: "confident",
                        type: "affirmation"
                      })}
                      className="flex-1 text-xs"
                    >
                      🌟 Affirmation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}