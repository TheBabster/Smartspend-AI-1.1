import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SmartieEmotion = 'happy' | 'excited' | 'concerned' | 'proud' | 'thinking' | 'celebrating';

interface SmartieProps {
  message: string;
  showTyping?: boolean;
  className?: string;
  onTypingComplete?: () => void;
  emotion?: SmartieEmotion;
}

// Smartie's emotional expressions and animations
const getSmartieAvatar = (emotion: SmartieEmotion) => {
  const expressions = {
    happy: { emoji: '😊', color: 'from-teal-400 to-blue-500' },
    excited: { emoji: '🤩', color: 'from-yellow-400 to-orange-500' },
    concerned: { emoji: '😟', color: 'from-orange-400 to-red-500' },
    proud: { emoji: '😌', color: 'from-green-400 to-teal-500' },
    thinking: { emoji: '🤔', color: 'from-purple-400 to-indigo-500' },
    celebrating: { emoji: '🎉', color: 'from-pink-400 to-purple-500' }
  };
  return expressions[emotion] || expressions.happy;
};

const getAnimationForEmotion = (emotion: SmartieEmotion) => {
  const animations = {
    happy: { 
      scale: [1, 1.05, 1], 
      rotate: [0, 2, -2, 0], 
      duration: 3 
    },
    excited: { 
      scale: [1, 1.1, 0.95, 1.05, 1], 
      rotate: [0, 5, -5, 3, 0], 
      duration: 1.5 
    },
    concerned: { 
      scale: [1, 0.98, 1], 
      rotate: [0, -1, 1, 0], 
      duration: 4 
    },
    proud: { 
      scale: [1, 1.08, 1], 
      rotate: [0, 0], 
      duration: 2.5 
    },
    thinking: { 
      scale: [1, 1.02, 1], 
      rotate: [0, -3, 3, -1, 1, 0], 
      duration: 5 
    },
    celebrating: { 
      scale: [1, 1.15, 0.9, 1.1, 1], 
      rotate: [0, 10, -15, 5, 0], 
      duration: 2 
    }
  };
  return animations[emotion] || animations.happy;
};

export default function Smartie({ 
  message, 
  showTyping = false, 
  className,
  onTypingComplete,
  emotion = 'happy'
}: SmartieProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(showTyping);
  const [showCursor, setShowCursor] = useState(true);
  
  const smartieAvatar = getSmartieAvatar(emotion);
  const animationConfig = getAnimationForEmotion(emotion);

  useEffect(() => {
    if (showTyping) {
      setDisplayedMessage("");
      setIsTyping(true);
      
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedMessage(message.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          onTypingComplete?.();
        }
      }, 50);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedMessage(message);
      setIsTyping(false);
    }
  }, [message, showTyping, onTypingComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {/* Enhanced Smartie Avatar with Emotions */}
      <motion.div 
        className={`bg-gradient-to-br ${smartieAvatar.color} w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-lg`}
        animate={{ 
          scale: animationConfig.scale,
          rotate: animationConfig.rotate,
        }}
        transition={{ 
          duration: animationConfig.duration, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        style={{
          boxShadow: `0 0 20px ${emotion === 'celebrating' ? '#ec4899' : 
                      emotion === 'excited' ? '#f59e0b' : 
                      emotion === 'concerned' ? '#ef4444' : '#14b8a6'}40`
        }}
      >
        <motion.div
          animate={emotion === 'thinking' ? { 
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-2xl"
        >
          {smartieAvatar.emoji}
        </motion.div>
        
        {/* Special effects for celebrating */}
        {emotion === 'celebrating' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              background: 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ec4899)'
            }}
          />
        )}
        
        {/* Dynamic status indicator based on emotion */}
        <motion.div 
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
            emotion === 'excited' ? 'bg-yellow-400' :
            emotion === 'concerned' ? 'bg-red-400' :
            emotion === 'celebrating' ? 'bg-pink-400' :
            emotion === 'thinking' ? 'bg-purple-400' :
            'bg-green-400'
          }`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: emotion === 'excited' ? 0.8 : 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className={`w-full h-full rounded-full animate-ping ${
            emotion === 'excited' ? 'bg-yellow-400' :
            emotion === 'concerned' ? 'bg-red-400' :
            emotion === 'celebrating' ? 'bg-pink-400' :
            emotion === 'thinking' ? 'bg-purple-400' :
            'bg-green-400'
          }`}></div>
        </motion.div>
      </motion.div>
      
      <div className="flex-1">
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
            emotion === 'excited' ? 'text-yellow-600 dark:text-yellow-400' :
            emotion === 'concerned' ? 'text-red-600 dark:text-red-400' :
            emotion === 'celebrating' ? 'text-pink-600 dark:text-pink-400' :
            emotion === 'thinking' ? 'text-purple-600 dark:text-purple-400' :
            'text-teal-600 dark:text-teal-400'
          }`}>
            Smartie • {emotion === 'thinking' ? 'Analyzing...' : 
                      emotion === 'celebrating' ? 'Celebrating!' :
                      emotion === 'concerned' ? 'Concerned' :
                      emotion === 'excited' ? 'Super Excited!' :
                      'AI Assistant'}
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: emotion === 'excited' ? 0.5 : 1, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                emotion === 'excited' ? 'bg-yellow-500' :
                emotion === 'concerned' ? 'bg-red-500' :
                emotion === 'celebrating' ? 'bg-pink-500' :
                emotion === 'thinking' ? 'bg-purple-500' :
                'bg-teal-500'
              }`}
            />
          </div>
          
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {displayedMessage}
            {isTyping && showCursor && (
              <span className="ml-1 text-teal-500 animate-pulse">|</span>
            )}
          </div>
        </motion.div>
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div 
            className="flex items-center gap-1 mt-3 text-teal-600 dark:text-teal-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-2 h-2 bg-teal-500 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 bg-teal-500 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div 
              className="w-2 h-2 bg-teal-500 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <span className="text-xs ml-2">Smartie is thinking...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
