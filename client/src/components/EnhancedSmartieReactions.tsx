import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface EnhancedSmartieReactionsProps {
  mood: "shocked" | "clapping" | "thinking" | "celebrating" | "confused" | "flying" | "lifting_weights" | "sad_umbrella";
  size?: "sm" | "md" | "lg" | "xl";
  financialScore?: number;
  message?: string;
  animated?: boolean;
}

export default function EnhancedSmartieReactions({ 
  mood, 
  size = "md", 
  financialScore, 
  message,
  animated = true 
}: EnhancedSmartieReactionsProps) {
  const [showMessage, setShowMessage] = useState(false);

  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };

  const smartieVariants = {
    shocked: {
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.6, repeat: 2 }
    },
    clapping: {
      y: [0, -10, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: 3 }
    },
    thinking: {
      rotate: [0, -10, 10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    celebrating: {
      y: [0, -15, 0],
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: { duration: 1, repeat: 2 }
    },
    confused: {
      rotate: [-10, 10, -10],
      transition: { duration: 0.5, repeat: 3 }
    },
    flying: {
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    lifting_weights: {
      y: [0, -5, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
    },
    sad_umbrella: {
      y: [0, 2, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getSmartieForScore = (score?: number) => {
    if (!score) return mood;
    if (score <= 30) return "sad_umbrella";
    if (score <= 70) return "lifting_weights";
    return "flying";
  };

  const actualMood = financialScore !== undefined ? getSmartieForScore(financialScore) : mood;

  const renderSmartie = () => {
    const baseClasses = `${sizes[size]} rounded-full flex items-center justify-center relative overflow-hidden`;
    
    return (
      <motion.div
        className={`${baseClasses} bg-gradient-to-br from-purple-400 to-pink-500`}
        variants={animated ? smartieVariants : undefined}
        animate={animated ? actualMood : undefined}
        whileHover={animated ? { scale: 1.1 } : undefined}
      >
        {/* Smartie Face Base */}
        <div className="absolute inset-2 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full" />
        
        {/* Eyes and Expression based on mood */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          {actualMood === "shocked" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="w-1 h-3 bg-white rounded-full" />
            </>
          )}
          
          {actualMood === "clapping" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-2 bg-white rounded-full rotate-12" />
                <div className="w-1 h-2 bg-white rounded-full -rotate-12" />
              </div>
              <div className="w-3 h-1 bg-white rounded-full" />
              <motion.div 
                className="absolute -left-1 top-1/2 text-xs"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                👏
              </motion.div>
            </>
          )}
          
          {actualMood === "thinking" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="w-2 h-1 bg-white rounded-full" />
              <motion.div 
                className="absolute -top-1 -right-1 text-xs"
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💭
              </motion.div>
            </>
          )}
          
          {actualMood === "celebrating" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-2 bg-white rounded-full rotate-12" />
                <div className="w-1 h-2 bg-white rounded-full -rotate-12" />
              </div>
              <div className="w-3 h-2 bg-white rounded-full" />
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{
                      left: `${20 + (i % 3) * 20}%`,
                      top: `${20 + Math.floor(i / 3) * 20}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            </>
          )}
          
          {actualMood === "confused" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="absolute -top-1 text-xs">❓</div>
            </>
          )}
          
          {actualMood === "flying" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-2 bg-white rounded-full rotate-12" />
                <div className="w-1 h-2 bg-white rounded-full -rotate-12" />
              </div>
              <div className="w-3 h-2 bg-white rounded-full" />
              <motion.div 
                className="absolute -bottom-2 text-xs"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ☁️
              </motion.div>
            </>
          )}
          
          {actualMood === "lifting_weights" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="w-2 h-1 bg-white rounded-full" />
              <motion.div 
                className="absolute -top-1 text-xs"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🏋️
              </motion.div>
            </>
          )}
          
          {actualMood === "sad_umbrella" && (
            <>
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="w-2 h-1 bg-white rounded-full rotate-180" />
              <div className="absolute -top-2 text-xs">☂️</div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative inline-block">
      {renderSmartie()}
      
      {/* Message Bubble */}
      {showMessage && message && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-lg border max-w-48 z-20"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <p className="text-xs text-gray-800 dark:text-gray-200 text-center font-medium">
            {message}
          </p>
          {/* Speech bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
        </motion.div>
      )}
    </div>
  );
}