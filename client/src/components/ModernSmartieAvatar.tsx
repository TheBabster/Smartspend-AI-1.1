import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModernSmartieAvatarProps {
  mood: "happy" | "thinking" | "celebrating" | "concerned" | "proud" | "warning" | "excited" | "relaxed";
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showMoneyBag?: boolean;
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
}

const ModernSmartieAvatar: React.FC<ModernSmartieAvatarProps> = ({
  mood = "happy",
  size = "md",
  animated = true,
  showMoneyBag = true,
  animationType = "idle"
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const sizeClasses = {
    sm: { container: "w-12 h-12", brain: "w-10 h-10", bag: "w-3 h-3", text: "text-xs" },
    md: { container: "w-16 h-16", brain: "w-14 h-14", bag: "w-4 h-4", text: "text-sm" },
    lg: { container: "w-24 h-24", brain: "w-20 h-20", bag: "w-6 h-6", text: "text-base" },
    xl: { container: "w-32 h-32", brain: "w-28 h-28", bag: "w-8 h-8", text: "text-lg" }
  };

  const config = sizeClasses[size];

  // Blinking animation
  useEffect(() => {
    if (!animated) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Animation frame counter
  useEffect(() => {
    if (!animated) return;
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 120);
    }, 100);
    return () => clearInterval(frameInterval);
  }, [animated]);

  // Sparkle effects for positive events
  useEffect(() => {
    if (animationType === "positive" || animationType === "milestone") {
      setShowSparkles(true);
      const timeout = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [animationType]);

  const getAnimationVariants = () => {
    const baseY = Math.sin(currentFrame * 0.05) * 2; // Gentle floating

    switch (animationType) {
      case "positive":
        return {
          y: [baseY, baseY - 8, baseY],
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        };
      case "thinking":
        return {
          y: baseY,
          rotate: [0, 2, -2, 0]
        };
      case "warning":
        return {
          y: baseY,
          x: [0, -2, 2, 0]
        };
      case "milestone":
        return {
          y: [baseY, baseY - 12, baseY],
          scale: [1, 1.15, 1],
          rotate: [0, 10, -10, 0]
        };
      case "greeting":
        return {
          y: baseY,
          rotate: [0, 10, -5, 10, 0]
        };
      default: // idle
        return {
          y: baseY
        };
    }
  };

  const getMoodStyles = () => {
    switch (mood) {
      case "celebrating":
        return { 
          eyeStyle: "⭐⭐", 
          mouthStyle: "︶", 
          headbandColor: "#FFD700",
          brainColor: "#FF9CA0"
        };
      case "thinking":
        return { 
          eyeStyle: isBlinking ? "--" : "◐◑", 
          mouthStyle: "○", 
          headbandColor: "#4ECDC4",
          brainColor: "#FFB3BA"
        };
      case "concerned":
        return { 
          eyeStyle: isBlinking ? "--" : "◉◉", 
          mouthStyle: "︵", 
          headbandColor: "#FF6B6B",
          brainColor: "#FFCCCB"
        };
      case "proud":
        return { 
          eyeStyle: isBlinking ? "--" : "◆◆", 
          mouthStyle: "︶", 
          headbandColor: "#9C27B0",
          brainColor: "#E1BEE7"
        };
      case "excited":
        return { 
          eyeStyle: isBlinking ? "--" : "✦✦", 
          mouthStyle: "︶", 
          headbandColor: "#FF4081",
          brainColor: "#FFB3C6"
        };
      default: // happy
        return { 
          eyeStyle: isBlinking ? "--" : "●●", 
          mouthStyle: "︶", 
          headbandColor: "#4CAF50",
          brainColor: "#FF9CA0"
        };
    }
  };

  const moodStyles = getMoodStyles();
  const animationVariants = getAnimationVariants();

  return (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Sparkle Effects */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-xs pointer-events-none z-20"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 2) * 60}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  y: [0, -15, -25]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Smartie Body */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={animated ? animationVariants : {}}
        transition={{
          duration: animationType === "positive" || animationType === "milestone" ? 0.8 : 3,
          repeat: animationType === "idle" ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Brain Body - Matching user's reference image */}
        <div
          className={`relative ${config.brain} flex flex-col items-center justify-center shadow-lg`}
          style={{
            background: moodStyles.brainColor,
            borderRadius: "50% 50% 45% 45% / 65% 65% 35% 35%", // Brain-like organic shape
            border: "3px solid #D63447",
            position: "relative"
          }}
        >
          {/* Headband - Green band like in reference */}
          <div
            className="absolute top-4 left-0 right-0 h-3 rounded-full"
            style={{
              background: moodStyles.headbandColor,
              border: "2px solid #2E7D32",
              transform: "translateY(-1px)"
            }}
          />

          {/* Brain Texture Lines */}
          <div className="absolute inset-2 opacity-20">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M8 15 Q20 10 32 15 M8 20 Q20 15 32 20 M8 25 Q20 20 32 25"
                stroke="currentColor"
                fill="none"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Glasses - Round black glasses like reference */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
            <svg viewBox="0 0 24 8" className="w-8 h-3">
              {/* Left lens */}
              <circle cx="6" cy="4" r="3" fill="none" stroke="#000" strokeWidth="2"/>
              {/* Right lens */}
              <circle cx="18" cy="4" r="3" fill="none" stroke="#000" strokeWidth="2"/>
              {/* Bridge */}
              <line x1="9" y1="4" x2="15" y2="4" stroke="#000" strokeWidth="2"/>
            </svg>
          </div>

          {/* Eyes */}
          <div className={`${config.text} font-black text-black mt-1 z-5`}>
            {moodStyles.eyeStyle}
          </div>

          {/* Mouth */}
          <div className={`${config.text} font-black text-black mt-1`}>
            {moodStyles.mouthStyle}
          </div>
        </div>

        {/* Arms - Simple lines extending from brain */}
        <div className="absolute top-1/2 -left-2 w-4 h-1 bg-current rounded-full opacity-60 transform -rotate-45" />
        <div className="absolute top-1/2 -right-2 w-4 h-1 bg-current rounded-full opacity-60 transform rotate-45" />

        {/* Legs - Blue legs like reference */}
        <div className="relative mt-1 flex gap-1">
          <div 
            className="w-2 h-6 rounded-full"
            style={{ background: "#5DADE2" }}
          />
          <div 
            className="w-2 h-6 rounded-full"
            style={{ background: "#5DADE2" }}
          />
        </div>

        {/* Money Bag - Golden bag like reference */}
        {showMoneyBag && (
          <motion.div
            className={`absolute -right-1 top-1/3 ${config.bag} rounded-full flex items-center justify-center text-xs`}
            style={{
              background: "#F1C232",
              border: "2px solid #B8860B"
            }}
            animate={animated && animationType === "positive" ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            💰
          </motion.div>
        )}
      </motion.div>

      {/* Greeting Speech Bubble */}
      <AnimatePresence>
        {animationType === "greeting" && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg text-xs whitespace-nowrap z-30"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-high-contrast">Hi there! 👋</span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSmartieAvatar;