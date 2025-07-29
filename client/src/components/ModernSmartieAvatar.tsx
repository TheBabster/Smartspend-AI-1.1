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
    const baseY = Math.sin(currentFrame * 0.03) * 1.5; // Gentle floating

    switch (animationType) {
      case "positive":
        return {
          y: [baseY, baseY - 6, baseY + 2, baseY],
          scale: [1, 1.08, 1.02, 1],
          rotate: [0, 3, -3, 0]
        };
      case "thinking":
        return {
          y: baseY,
          rotate: [0, 1, -1, 0],
          scale: [1, 1.01, 1]
        };
      case "warning":
        return {
          y: baseY,
          x: [0, -1, 1, 0],
          scale: [1, 0.98, 1]
        };
      case "milestone":
        return {
          y: [baseY, baseY - 10, baseY + 3, baseY],
          scale: [1, 1.12, 1.05, 1],
          rotate: [0, 8, -8, 0]
        };
      case "greeting":
        return {
          y: [baseY, baseY - 4, baseY + 2, baseY],
          rotate: [0, 6, -3, 6, 0],
          scale: [1, 1.05, 1]
        };
      default: // idle
        return {
          y: baseY,
          rotate: [0, 0.5, -0.5, 0]
        };
    }
  };

  const getMoodStyles = () => {
    switch (mood) {
      case "celebrating":
        return { 
          mouthColor: "#FF6B35", // Orange excited mouth
          headbandColor: "#FFD700",
          brainColor: "#FF9CA0"
        };
      case "thinking":
        return { 
          mouthColor: "#666", // Neutral thinking mouth
          headbandColor: "#4ECDC4",
          brainColor: "#FFB3BA"
        };
      case "concerned":
        return { 
          mouthColor: "#FF4444", // Red concerned mouth
          headbandColor: "#FF6B6B",
          brainColor: "#FFCCCB"
        };
      case "proud":
        return { 
          mouthColor: "#4CAF50", // Green proud mouth
          headbandColor: "#9C27B0",
          brainColor: "#E1BEE7"
        };
      case "excited":
        return { 
          mouthColor: "#FF4081", // Pink excited mouth
          headbandColor: "#FF4081",
          brainColor: "#FFB3C6"
        };
      default: // happy
        return { 
          mouthColor: "#333", // Dark happy mouth
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
        {/* Brain Body - Authentic brain shape with proper folds */}
        <div
          className={`relative ${config.brain} flex flex-col items-center justify-center shadow-lg`}
          style={{
            background: "#FF9CA0", // Consistent pink from reference
            border: "3px solid #D63447",
            borderRadius: "65% 65% 65% 65% / 70% 70% 50% 50%", // More brain-like rounded bumps
            position: "relative"
          }}
        >
          {/* Brain Folds/Texture - More realistic brain texture */}
          <div className="absolute inset-1 opacity-30 pointer-events-none">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              {/* Brain fold lines to look more brain-like */}
              <path
                d="M15 20 Q25 15 35 20 Q45 25 50 35"
                stroke="#D63447"
                fill="none"
                strokeWidth="1.5"
              />
              <path
                d="M10 30 Q20 25 30 30 Q40 35 45 40"
                stroke="#D63447"
                fill="none"
                strokeWidth="1.5"
              />
              <path
                d="M20 40 Q30 35 40 40"
                stroke="#D63447"
                fill="none"
                strokeWidth="1.5"
              />
              {/* Center line to separate brain hemispheres */}
              <path
                d="M30 15 Q30 25 30 45"
                stroke="#D63447"
                fill="none"
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Smaller Green Headband - Much thinner like reference */}
          <div
            className="absolute top-3 left-2 right-2 h-2 rounded-full z-5"
            style={{
              background: "#4CAF50",
              border: "1px solid #2E7D32"
            }}
          />

          {/* Round Glasses - More accurate to reference */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
            <svg viewBox="0 0 20 7" className="w-7 h-3">
              {/* Left lens */}
              <circle cx="5" cy="3.5" r="2.5" fill="none" stroke="#000" strokeWidth="1.5"/>
              {/* Right lens */}
              <circle cx="15" cy="3.5" r="2.5" fill="none" stroke="#000" strokeWidth="1.5"/>
              {/* Bridge */}
              <line x1="7.5" y1="3.5" x2="12.5" y2="3.5" stroke="#000" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Real Eyes with pupils - Inside glasses */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-8">
            <div className="flex gap-2">
              {/* Left Eye */}
              <div 
                className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
                style={{ marginLeft: "-8px" }}
              >
                <div 
                  className="w-2 h-2 rounded-full bg-black"
                  style={{
                    transform: isBlinking ? 'scaleY(0)' : 'scaleY(1)',
                    transition: 'transform 0.1s ease'
                  }}
                />
              </div>
              
              {/* Right Eye */}
              <div 
                className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
                style={{ marginRight: "-8px" }}
              >
                <div 
                  className="w-2 h-2 rounded-full bg-black"
                  style={{
                    transform: isBlinking ? 'scaleY(0)' : 'scaleY(1)',
                    transition: 'transform 0.1s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cute Small Mouth - Below glasses */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-8">
            <div 
              className="w-3 h-2 rounded-full"
              style={{
                background: moodStyles.mouthColor || "#000",
                transform: mood === "celebrating" ? "scaleX(1.5)" : "scaleX(1)"
              }}
            />
          </div>
        </div>

        {/* Animated Arms - Fun moving arms like reference */}
        <motion.div
          className="absolute left-0 top-1/2 w-3 h-8 rounded-full bg-blue-400 origin-top"
          style={{ 
            transformOrigin: "50% 0%",
            left: "-6px"
          }}
          animate={animated ? {
            rotate: animationType === "positive" ? [0, -25, 25, -15, 15, 0] : 
                   animationType === "milestone" ? [0, -30, 30, -20, 20, 0] :
                   animationType === "greeting" ? [0, -40, 40, -20, 20, 0] :
                   animationType === "thinking" ? [0, -15, 15, 0] : [0, -8, 8, 0],
            y: animationType === "positive" || animationType === "milestone" ? [0, -2, 2, 0] : [0]
          } : {}}
          transition={{
            duration: animationType === "positive" ? 1.8 : animationType === "milestone" ? 2.2 : animationType === "greeting" ? 2.5 : 1.5,
            repeat: animationType === "idle" ? Infinity : animationType === "positive" ? 2 : 1,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute right-0 top-1/2 w-3 h-8 rounded-full bg-blue-400 origin-top"
          style={{ 
            transformOrigin: "50% 0%",
            right: "-6px"
          }}
          animate={animated ? {
            rotate: animationType === "positive" ? [0, 25, -25, 15, -15, 0] : 
                   animationType === "milestone" ? [0, 30, -30, 20, -20, 0] :
                   animationType === "greeting" ? [0, 40, -40, 20, -20, 0] :
                   animationType === "thinking" ? [0, 15, -15, 0] : [0, 8, -8, 0],
            y: animationType === "positive" || animationType === "milestone" ? [0, -2, 2, 0] : [0]
          } : {}}
          transition={{
            duration: animationType === "positive" ? 1.8 : animationType === "milestone" ? 2.2 : animationType === "greeting" ? 2.5 : 1.5,
            repeat: animationType === "idle" ? Infinity : animationType === "positive" ? 2 : 1,
            ease: "easeInOut",
            delay: 0.1
          }}
        />

        {/* Legs - Blue legs like reference with fun bounce */}
        <motion.div 
          className="relative mt-2 flex gap-1 justify-center"
          animate={animated && animationType === "positive" ? {
            y: [0, -3, 0, -2, 0]
          } : animated && animationType === "greeting" ? {
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{
            duration: 1,
            repeat: animationType === "positive" ? 2 : 0
          }}
        >
          <motion.div 
            className="w-3 h-8 rounded-full"
            style={{ background: "#5DADE2", border: "2px solid #3498DB" }}
            animate={animated && animationType === "greeting" ? {
              scaleY: [1, 0.8, 1.1, 1]
            } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.div 
            className="w-3 h-8 rounded-full"
            style={{ background: "#5DADE2", border: "2px solid #3498DB" }}
            animate={animated && animationType === "greeting" ? {
              scaleY: [1, 1.1, 0.8, 1]
            } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        {/* Money Bag - Golden bag like reference with fun animations */}
        {showMoneyBag && (
          <motion.div
            className={`absolute -right-2 top-1/4 ${config.bag} rounded-full flex items-center justify-center text-xs`}
            style={{
              background: "#F1C232",
              border: "2px solid #B8860B",
              boxShadow: "0 2px 8px rgba(241, 194, 50, 0.3)"
            }}
            animate={animated ? (
              animationType === "positive" ? {
                scale: [1, 1.3, 1.1, 1],
                rotate: [0, 15, -15, 5, 0],
                y: [0, -3, 2, 0]
              } : animationType === "milestone" ? {
                scale: [1, 1.4, 1.2, 1],
                rotate: [0, 20, -20, 10, 0],
                y: [0, -5, 3, 0]
              } : animationType === "greeting" ? {
                scale: [1, 1.1, 1],
                rotate: [0, 8, -8, 0]
              } : {
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }
            ) : {}}
            transition={{ duration: animationType === "positive" || animationType === "milestone" ? 1.2 : 2, ease: "easeOut" }}
          >
            💰
          </motion.div>
        )}

        {/* Special Effects for Fun Animations */}
        <AnimatePresence>
          {animationType === "positive" && (
            <>
              {/* Bouncing coins effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`coin-${i}`}
                  className="absolute text-yellow-400 text-sm pointer-events-none"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${20 + i * 10}%`
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -20, -30],
                    rotate: [0, 180, 360]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                >
                  💰
                </motion.div>
              ))}
            </>
          )}
          
          {animationType === "milestone" && (
            <>
              {/* Celebration stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-yellow-300 text-lg pointer-events-none"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${5 + (i % 2) * 70}%`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
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