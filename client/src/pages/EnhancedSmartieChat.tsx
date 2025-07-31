import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import SmartieAvatarSystem from "@/components/SmartieAvatarSystem";
import { useAuth } from "@/hooks/useAuth";
import { Send, Mic, VolumeX, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@shared/schema";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "smartie";
  timestamp: Date;
  typing?: boolean;
}

export default function EnhancedSmartieChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [smartCoins, setSmartCoins] = useState(25);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { user: firebaseUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch user data and initialize chat
  useEffect(() => {
    const fetchUserData = async () => {
      if (!firebaseUser?.email) return;
      
      try {
        const response = await fetch(`/api/user/${encodeURIComponent(firebaseUser.email)}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setSmartCoins(userData.smartCoins || 25);
          setDailyStreak(userData.dailyStreak || 0);
          
          // Auto-claim daily reward
          try {
            const rewardResponse = await fetch(`/api/user/${userData.id}/daily-reward`, {
              method: 'POST'
            });
            if (rewardResponse.ok) {
              const rewardData = await rewardResponse.json();
              setSmartCoins(rewardData.totalCoins);
              setDailyStreak(rewardData.streak);
            }
          } catch (error) {
            console.log("Daily reward already claimed or error:", error);
          }
          
          // Add welcome message based on user's onboarding status
          const welcomeMessage: ChatMessage = {
            id: "welcome",
            content: userData.onboardingCompleted 
              ? `Hi ${userData.name}! 👋 I'm Smartie, your AI financial coach. I've got your financial profile loaded and I'm ready to help you make smart money decisions. Each message costs 0.5 SmartCoins (you have ${userData.smartCoins || 25} coins). What would you like to chat about today?`
              : `Hi ${userData.name}! 👋 I'm Smartie, your AI financial coach. I notice you haven't completed your financial setup yet. Would you like me to help you get started, or do you have other questions about money management?`,
            sender: "smartie",
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [firebaseUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Send message to enhanced Smartie chat endpoint
      const response = await fetch("/api/smartie/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage.trim(),
          userId: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update remaining coins
        if (data.remainingCoins !== undefined) {
          setSmartCoins(data.remainingCoins);
        }
        
        // Simulate typing delay for more natural feel
        setTimeout(() => {
          const smartieMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: data.message,
            sender: "smartie",
            timestamp: new Date(data.timestamp)
          };

          setMessages(prev => [...prev, smartieMessage]);
          setIsTyping(false);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      } else if (response.status === 402) {
        // Insufficient coins
        const errorData = await response.json();
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `💰 ${errorData.message}\n\nEarn coins by:\n• Using the app daily (2-3 coins)\n• Sharing with friends (30 coins)\n• Maintaining a 7+ day streak for bonus coins!`,
          sender: "smartie",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      } else {
        throw new Error("Failed to get response from Smartie");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. But I'm still here to help! Try asking me something about budgeting, saving, or financial planning - I love talking about money management! 💰",
        sender: "smartie",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    "How can I save more money?",
    "Help me create a budget",
    "What's my spending pattern?",
    "Should I make this purchase?",
    "Investment advice for beginners",
    "How to build an emergency fund"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SmartieAvatarSystem mood="happy" size="lg" animate={false} />
                <div>
                  <CardTitle className="text-white">Chat with Smartie</CardTitle>
                  <p className="text-purple-100">Your AI Financial Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                  ⭐ {smartCoins} SmartCoins
                </Badge>
                {dailyStreak > 0 && (
                  <Badge variant="secondary" className="bg-orange-400 text-orange-900">
                    🔥 {dailyStreak} day streak
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "smartie" && (
                        <div className="flex-shrink-0">
                          <SmartieAvatarSystem mood="happy" size="sm" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.sender === "user" 
                            ? "text-purple-100" 
                            : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0">
                      <SmartieAvatarSystem mood="thinking" size="sm" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-xs h-8"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Smartie about your finances..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Smartie can help with budgeting, saving, investing, and all your financial questions!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}