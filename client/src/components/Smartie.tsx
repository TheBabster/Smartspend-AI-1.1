import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmartieProps {
  message: string;
  showTyping?: boolean;
  className?: string;
  onTypingComplete?: () => void;
}

export default function Smartie({ 
  message, 
  showTyping = false, 
  className,
  onTypingComplete 
}: SmartieProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(showTyping);
  const [showCursor, setShowCursor] = useState(true);

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
      {/* Smartie Avatar */}
      <motion.div 
        className="smartie-gradient w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 relative smartie-glow"
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-2xl"
        >
          🤖
        </motion.div>
        
        {/* Status indicator */}
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
        </motion.div>
      </motion.div>
      
      <div className="flex-1">
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
            Smartie • AI Assistant
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-teal-500 rounded-full"
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
