import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, Sparkles } from "lucide-react";
import SmartieAvatarSystem from "./SmartieAvatarSystem";

interface Message {
  id: string;
  text: string;
  sender: "user" | "smartie";
  timestamp: Date;
  mood?: "happy" | "thinking" | "celebrating" | "concerned" | "proud" | "warning" | "excited" | "relaxed";
}

interface SmartieIntelligentChatProps {
  userSpendingData?: {
    totalSpent: number;
    budgetUsed: number;
    streak: number;
    recentCategory?: string;
  };
  onClose?: () => void;
  isOpen?: boolean;
}

const SmartieIntelligentChat: React.FC<SmartieIntelligentChatProps> = ({
  userSpendingData,
  onClose,
  isOpen = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [smartieMood, setSmartieMood] = useState<"happy" | "thinking" | "celebrating" | "concerned" | "proud" | "warning" | "excited" | "relaxed">("happy");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens
      const welcomeMessage: Message = {
        id: "welcome",
        text: getWelcomeMessage(),
        sender: "smartie",
        timestamp: new Date(),
        mood: "excited"
      };
      setMessages([welcomeMessage]);
      setSmartieMood("excited");
    }
  }, [isOpen]);

  const getWelcomeMessage = () => {
    const { budgetUsed = 0, streak = 0 } = userSpendingData || {};
    
    if (streak > 5) {
      return "🎉 Amazing streak! You've been smart with money for " + streak + " days! What financial wisdom can I help you with today?";
    } else if (budgetUsed > 80) {
      return "Hey there! I noticed you're close to your budget limit. Let's chat about smart spending strategies! 💡";
    } else if (budgetUsed < 50) {
      return "You're doing fantastic with your budget! 🌟 I'm here to help you make even smarter financial decisions. What's on your mind?";
    } else {
      return "Hi! I'm Smartie, your AI financial companion! 🧠💰 Ask me anything about budgeting, saving, or making smart purchase decisions!";
    }
  };

  const generateSmartieResponse = (userMessage: string): { text: string; mood: typeof smartieMood } => {
    const lowerMessage = userMessage.toLowerCase();
    const { totalSpent = 0, budgetUsed = 0, streak = 0, recentCategory = "" } = userSpendingData || {};

    // Budget-related questions
    if (lowerMessage.includes("budget") || lowerMessage.includes("spending")) {
      if (budgetUsed > 90) {
        return {
          text: "🚨 You're at " + budgetUsed.toFixed(0) + "% of your budget! Here's my advice: pause on non-essentials, look for cheaper alternatives, and remember - every small saving counts! Want me to suggest some specific strategies?",
          mood: "warning"
        };
      } else if (budgetUsed > 70) {
        return {
          text: "⚠️ You're at " + budgetUsed.toFixed(0) + "% of your budget. Good time to be extra mindful! Consider the 24-hour rule before any purchase above £20. You're doing well though! 💪",
          mood: "concerned"
        };
      } else {
        return {
          text: "✨ Great job! You're only at " + budgetUsed.toFixed(0) + "% of your budget. You have room for some fun purchases, but remember to prioritize your goals! What's your next savings target?",
          mood: "proud"
        };
      }
    }

    // Saving advice
    if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      return {
        text: "💡 Smart saving tips: 1) Try the 50/30/20 rule (needs/wants/savings), 2) Set up automatic transfers to savings, 3) Use the envelope method for discretionary spending. Your current streak of " + streak + " days shows you're already building good habits! 🌟",
        mood: "thinking"
      };
    }

    // Purchase decisions
    if (lowerMessage.includes("buy") || lowerMessage.includes("purchase") || lowerMessage.includes("should i")) {
      return {
        text: "🤔 Before buying, ask yourself: 1) Do I need it or want it? 2) Will I use it regularly? 3) Can I wait 24 hours to decide? 4) Does it align with my goals? Use the purchase decision tool for detailed analysis! What are you thinking of buying?",
        mood: "thinking"
      };
    }

    // Goals and motivation
    if (lowerMessage.includes("goal") || lowerMessage.includes("motivation") || lowerMessage.includes("help")) {
      return {
        text: "🎯 Goals are dreams with deadlines! Break big goals into smaller milestones, celebrate small wins, and remember why you started. Your " + streak + "-day streak proves you can do this! What goal are you working toward?",
        mood: "excited"
      };
    }

    // Stress or emotional spending
    if (lowerMessage.includes("stress") || lowerMessage.includes("emotional") || lowerMessage.includes("feeling")) {
      return {
        text: "💙 I understand - emotions and money are deeply connected. Try this: pause, take 3 deep breaths, ask 'what am I really feeling?' Often a walk, call to a friend, or free activity can help more than spending. You've got this! 🤗",
        mood: "relaxed"
      };
    }

    // Compliments or positive messages
    if (lowerMessage.includes("thank") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
      return {
        text: "🌟 You're so welcome! It makes me happy to help you build better money habits. Remember, every smart decision is a step toward your dreams. Keep up the amazing work! 🎉",
        mood: "celebrating"
      };
    }

    // Default encouraging response
    const encouragingResponses = [
      "That's a great question! 🧠 Financial wisdom grows with every smart decision you make. Your " + streak + "-day streak shows you're on the right track!",
      "💰 Remember, being smart with money isn't about restriction - it's about making your money work toward your dreams! What matters most to you right now?",
      "🌟 Every financial decision is a chance to choose your future self! I believe in your ability to make smart choices. What's your biggest financial priority?",
      "💡 Smart spending is like a muscle - the more you practice, the stronger it gets! Your progress so far has been impressive. What else can I help with?"
    ];

    return {
      text: encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)],
      mood: "happy"
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setSmartieMood("thinking");

    // Simulate thinking delay
    setTimeout(() => {
      const response = generateSmartieResponse(inputText);
      const smartieMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "smartie",
        timestamp: new Date(),
        mood: response.mood
      };

      setMessages(prev => [...prev, smartieMessage]);
      setSmartieMood(response.mood);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={chatRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3">
            <SmartieAvatarSystem 
              mood={smartieMood} 
              size="md" 
              animated={true} 
            />
            <div>
              <h3 className="font-bold text-high-contrast flex items-center gap-2">
                Chat with Smartie <Sparkles className="w-4 h-4 text-purple-500" />
              </h3>
              <p className="text-xs text-medium-contrast">Your AI Financial Companion</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-medium-contrast hover:text-high-contrast"
          >
            ✕
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  {message.sender === "smartie" && (
                    <div className="flex items-center gap-2 mb-1">
                      <SmartieAvatarSystem 
                        mood={message.mood || "happy"} 
                        size="sm" 
                        animated={true} 
                      />
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        Smartie
                      </span>
                    </div>
                  )}
                  <Card className={`${
                    message.sender === "user" 
                      ? "bg-purple-500 text-white border-purple-500" 
                      : "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700"
                  }`}>
                    <CardContent className="p-3">
                      <p className={`text-sm leading-relaxed ${
                        message.sender === "user" 
                          ? "text-white" 
                          : "text-high-contrast"
                      }`}>
                        {message.text}
                      </p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-2">
                  <SmartieAvatarSystem 
                    mood="thinking" 
                    size="sm" 
                    animated={true} 
                  />
                  <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-200 dark:border-purple-700">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Smartie about budgeting, saving, or spending decisions..."
              className="flex-1 border-purple-200 dark:border-purple-700 focus:border-purple-500"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-medium-contrast mt-2 text-center">
            Press Enter to send • Smartie learns from your spending patterns
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartieIntelligentChat;