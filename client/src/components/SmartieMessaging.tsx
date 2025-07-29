import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedSmartieReactions from './EnhancedSmartieReactions';
import { type SmartieResponse } from '@/lib/smartie';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  smartieResponse?: SmartieResponse;
}

interface SmartieMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  userSpendingData?: {
    totalSpent: number;
    budgetUsed: number;
    streak: number;
  };
}

export default function SmartieMessaging({ 
  isOpen, 
  onClose, 
  userSpendingData = { totalSpent: 0, budgetUsed: 0, streak: 0 }
}: SmartieMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm Smartie, your AI financial companion. Ask me anything about your spending, budgets, or financial goals!",
      isUser: false,
      timestamp: new Date(),
      smartieResponse: {
        message: "Ready to chat about your finances!",
        emotion: 'happy',
        confidence: 1.0
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSmartieReply = (userMessage: string): SmartieResponse => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Budget-related questions
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      if (userSpendingData.budgetUsed > 80) {
        return {
          message: `You've used ${userSpendingData.budgetUsed.toFixed(0)}% of your budget this month. Maybe it's time to slow down a bit? I believe in your self-control!`,
          emotion: 'concerned',
          confidence: 0.9
        };
      } else {
        return {
          message: `You're doing great! Only ${userSpendingData.budgetUsed.toFixed(0)}% of your budget used. Keep up the smart spending!`,
          emotion: 'thoughtful',
          confidence: 0.8
        };
      }
    }

    // Streak questions
    if (lowerMessage.includes('streak') || lowerMessage.includes('progress')) {
      if (userSpendingData.streak > 5) {
        return {
          message: `Amazing ${userSpendingData.streak}-day streak! You're building incredible financial discipline. I'm so proud of you!`,
          emotion: 'excited',
          confidence: 1.0
        };
      } else {
        return {
          message: `Every day counts! Your ${userSpendingData.streak}-day streak is a great start. Let's keep building those good habits together!`,
          emotion: 'thoughtful',
          confidence: 0.8
        };
      }
    }

    // Motivation/encouragement
    if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('what should')) {
      return {
        message: "Here's my advice: Before any purchase, ask yourself 'Will this help my future self?' If the answer isn't a clear yes, maybe wait 24 hours!",
        emotion: 'thoughtful',
        confidence: 0.9
      };
    }

    // Goals questions
    if (lowerMessage.includes('goal') || lowerMessage.includes('save')) {
      return {
        message: "Goals are dreams with deadlines! Set a specific amount and target date. I'll help you track progress and stay motivated every step of the way!",
        emotion: 'excited',
        confidence: 0.8
      };
    }

    // Emotional support
    if (lowerMessage.includes('stressed') || lowerMessage.includes('worried') || lowerMessage.includes('anxious')) {
      return {
        message: "Money stress is real, but you're taking control by using SmartSpend! Remember, small consistent steps lead to big financial wins. You've got this!",
        emotion: 'concerned',
        confidence: 0.9
      };
    }

    // Default encouraging response
    const defaultResponses = [
      {
        message: "That's a great question! Smart spending is all about making intentional choices. What specific area would you like help with?",
        emotion: 'thoughtful' as const,
        confidence: 0.7
      },
      {
        message: "I love your curiosity about finances! Every question you ask makes you a smarter spender. Keep them coming!",
        emotion: 'excited' as const,
        confidence: 0.8
      },
      {
        message: "Financial wisdom starts with asking the right questions! I'm here to help you make confident money decisions.",
        emotion: 'thoughtful' as const,
        confidence: 0.7
      }
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const smartieResponse = generateSmartieReply(inputValue);
      const smartieMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: smartieResponse.message,
        isUser: false,
        timestamp: new Date(),
        smartieResponse
      };

      setMessages(prev => [...prev, smartieMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
        style={{ height: '70vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <EnhancedSmartieReactions 
              mood="thinking" 
              size="sm" 
              animated={true}
            />
            <div>
              <h3 className="font-semibold text-high-contrast">Chat with Smartie</h3>
              <p className="text-xs text-muted-contrast">Your AI financial companion</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(70vh - 120px)' }}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="flex gap-2 max-w-[80%]">
                    <EnhancedSmartieReactions 
                      mood={message.smartieResponse?.emotion === 'concerned' ? 'confused' :
                            message.smartieResponse?.emotion === 'excited' ? 'celebrating' :
                            message.smartieResponse?.emotion === 'thoughtful' ? 'thinking' : 'thinking'} 
                      size="sm" 
                      animated={false}
                    />
                    <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                      <CardContent className="p-3">
                        <p className="text-sm text-high-contrast">{message.text}</p>
                        <span className="text-xs text-muted-contrast">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {message.isUser && (
                  <Card className="bg-blue-500 max-w-[80%]">
                    <CardContent className="p-3">
                      <p className="text-sm text-white">{message.text}</p>
                      <span className="text-xs text-blue-100">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <EnhancedSmartieReactions 
                mood="thinking" 
                size="sm" 
                animated={true}
              />
              <Card className="bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Smartie about your finances..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}