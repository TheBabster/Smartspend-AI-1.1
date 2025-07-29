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
    const baseY = Math.sin(currentFrame * 0.008) * 0.2; // Very subtle breathing

    switch (animationType) {
      case "positive":
        return {
          y: [baseY, baseY - 2, baseY + 0.5, baseY],
          scale: [1, 1.02, 1.005, 1],
          rotate: [0, 0.5, -0.5, 0]
        };
      case "thinking":
        return {
          y: [baseY, baseY - 0.3, baseY],
          rotate: [0, 0.4, -0.4, 0],
          scale: [1, 1.002, 1]
        };
      case "warning":
        return {
          y: baseY,
          x: [0, -0.5, 0.5, 0],
          scale: [1, 0.995, 1],
          rotate: [0, -0.3, 0.3, 0]
        };
      case "milestone":
        return {
          y: [baseY, baseY - 3, baseY + 0.8, baseY - 1.5, baseY],
          scale: [1, 1.03, 1.01, 1.02, 1],
          rotate: [0, 1, -1, 0.5, 0]
        };
      case "greeting":
        return {
          y: [baseY, baseY - 1.5, baseY + 0.3, baseY - 0.8, baseY],
          rotate: [0, 0.5, -0.3, 0.5, 0],
          scale: [1, 1.01, 1.003, 1.008, 1]
        };
      default: // idle
        return {
          y: [baseY, baseY - 0.1, baseY],
          scale: [1, 1.001, 1],
          rotate: [0, 0.05, -0.05, 0]
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
        {/* Cap - Exact copy from reference */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <svg width="60" height="28" viewBox="0 0 60 28" className="overflow-visible">
            {/* Cap main dome */}
            <path
              d="M8 18 Q8 8 30 8 Q52 8 52 18 Q52 20 50 20 L10 20 Q8 20 8 18 Z"
              fill="#4CAF50"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Cap visor */}
            <ellipse
              cx="30"
              cy="22"
              rx="18"
              ry="4"
              fill="#FFD700"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Cap button */}
            <circle
              cx="30"
              cy="8"
              r="2"
              fill="#2E7D32"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Brain Body - Exact copy from reference */}
        <div className={`relative ${config.brain} flex flex-col items-center justify-center`}>
          <svg width="80" height="60" viewBox="0 0 80 60" className="overflow-visible">
            {/* Brain outline - exact bumpy shape */}
            <path
              d="M20 25 Q18 15 25 12 Q30 10 35 12 Q40 8 45 12 Q50 10 55 12 Q62 15 60 25 Q65 30 62 35 Q65 40 60 45 Q55 50 50 48 Q45 52 40 48 Q35 50 30 48 Q25 50 20 45 Q15 40 18 35 Q15 30 20 25 Z"
              fill="#FF9BB5"
              stroke="#000000"
              strokeWidth="3"
            />
            {/* Brain texture curves */}
            <path
              d="M25 20 Q30 18 35 22 Q38 25 35 28"
              stroke="#E8427D"
              fill="none"
              strokeWidth="1.5"
            />
            <path
              d="M45 20 Q50 18 55 22 Q58 25 55 28"
              stroke="#E8427D"
              fill="none"
              strokeWidth="1.5"
            />
            <path
              d="M28 30 Q33 28 38 32 Q40 35 38 38"
              stroke="#E8427D"
              fill="none"
              strokeWidth="1.5"
            />
            <path
              d="M42 30 Q47 28 52 32 Q54 35 52 38"
              stroke="#E8427D"
              fill="none"
              strokeWidth="1.5"
            />
            {/* Center division */}
            <path
              d="M40 15 Q40 25 40 35 Q40 45 40 50"
              stroke="#E8427D"
              fill="none"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </svg>

          {/* Big Round Eyes - Exactly like reference */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex gap-1">
              {/* Left Eye */}
              <div 
                className="rounded-full bg-white flex items-center justify-center"
                style={{ 
                  width: "16px", 
                  height: "16px",
                  border: "2px solid #000"
                }}
              >
                <div 
                  className="rounded-full bg-black"
                  style={{
                    width: "8px",
                    height: "8px",
                    transform: isBlinking ? 'scaleY(0)' : 'scaleY(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              </div>
              
              {/* Right Eye */}
              <div 
                className="rounded-full bg-white flex items-center justify-center"
                style={{ 
                  width: "16px", 
                  height: "16px",
                  border: "2px solid #000"
                }}
              >
                <div 
                  className="rounded-full bg-black"
                  style={{
                    width: "8px",
                    height: "8px",
                    transform: isBlinking ? 'scaleY(0)' : 'scaleY(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mouth - Exact copy from reference */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-8">
            <svg width="12" height="8" viewBox="0 0 12 8">
              <path
                d="M2 2 Q6 6 10 2"
                stroke="#000000"
                fill={moodStyles.mouthColor || "#FF0000"}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Arms - Exact copy from reference */}
        <motion.div
          className="absolute origin-top"
          style={{ 
            left: "-8px",
            top: "35px",
            transformOrigin: "center top"
          }}
          animate={animated ? (
            animationType === "positive" ? {
              rotate: [0, -20, 20, -10, 0]
            } : animationType === "milestone" ? {
              rotate: [0, -30, 30, -15, 0]
            } : animationType === "greeting" ? {
              rotate: [0, -40, 15, -25, 5, 0]
            } : animationType === "thinking" ? {
              rotate: [0, -15, -10, -15]
            } : {
              rotate: [0, -2, 2, 0]
            }
          ) : {}}
          transition={{
            duration: animationType === "greeting" ? 3 : 2,
            repeat: animationType === "idle" ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <svg width="20" height="40" viewBox="0 0 20 40" className="overflow-visible">
            {/* Left arm */}
            <rect x="8" y="0" width="4" height="32" fill="#2196F3" stroke="#000000" strokeWidth="2" rx="2"/>
            {/* Left hand */}
            <circle cx="10" cy="34" r="4" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute origin-top"
          style={{ 
            right: "-8px",
            top: "35px",
            transformOrigin: "center top"
          }}
          animate={animated ? (
            animationType === "positive" ? {
              rotate: [0, 20, -20, 10, 0]
            } : animationType === "milestone" ? {
              rotate: [0, 30, -30, 15, 0]
            } : animationType === "greeting" ? {
              rotate: [0, 40, -15, 25, -5, 0]
            } : animationType === "thinking" ? {
              rotate: [0, 15, 10, 15]
            } : {
              rotate: [0, 2, -2, 0]
            }
          ) : {}}
          transition={{
            duration: animationType === "greeting" ? 3 : 2,
            repeat: animationType === "idle" ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.1
          }}
        >
          <svg width="20" height="40" viewBox="0 0 20 40" className="overflow-visible">
            {/* Right arm */}
            <rect x="8" y="0" width="4" height="32" fill="#2196F3" stroke="#000000" strokeWidth="2" rx="2"/>
            {/* Right hand */}
            <circle cx="10" cy="34" r="4" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
          </svg>
        </motion.div>

        {/* Legs and Shoes - Exact copy from reference */}
        <motion.div 
          className="relative mt-2 flex gap-2 justify-center"
          animate={animated && (animationType === "positive" || animationType === "milestone") ? {
            y: [0, -1, 0]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: animationType === "positive" ? 1 : animationType === "milestone" ? 1 : 0
          }}
        >
          {/* Left leg and shoe */}
          <div className="flex flex-col items-center">
            <svg width="8" height="35" viewBox="0 0 8 35">
              {/* Left leg */}
              <rect x="2" y="0" width="4" height="25" fill="#2196F3" stroke="#000000" strokeWidth="2" rx="2"/>
              {/* Left shoe */}
              <ellipse cx="4" cy="30" rx="6" ry="4" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
              {/* Shoe sole */}
              <ellipse cx="4" cy="32" rx="7" ry="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
              {/* Shoe laces */}
              <line x1="2" y1="27" x2="6" y2="27" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="1" y1="29" x2="7" y2="29" stroke="#FFFFFF" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Right leg and shoe */}
          <div className="flex flex-col items-center">
            <svg width="8" height="35" viewBox="0 0 8 35">
              {/* Right leg */}
              <rect x="2" y="0" width="4" height="25" fill="#2196F3" stroke="#000000" strokeWidth="2" rx="2"/>
              {/* Right shoe */}
              <ellipse cx="4" cy="30" rx="6" ry="4" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
              {/* Shoe sole */}
              <ellipse cx="4" cy="32" rx="7" ry="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
              {/* Shoe laces */}
              <line x1="2" y1="27" x2="6" y2="27" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="1" y1="29" x2="7" y2="29" stroke="#FFFFFF" strokeWidth="1"/>
            </svg>
          </div>
        </motion.div>

        {/* Optional Coin - Only show for financial achievements */}
        {showMoneyBag && animationType === "milestone" && (
          <motion.div
            className="absolute -right-3 top-1/3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{
              background: "#FFD700",
              border: "2px solid #FFA500",
              boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)"
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            💰
          </motion.div>
        )}

        {/* Professional Visual Effects System */}
        <AnimatePresence>
          {/* Sparkle effect for positive events */}
          {animationType === "positive" && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-yellow-400 text-sm pointer-events-none"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${15 + i * 8}%`
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.3, 0],
                    y: [0, -15, -25],
                    rotate: [0, 90, 180]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    delay: i * 0.15,
                    ease: "easeOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
          
          {/* Confetti effect for milestones */}
          {animationType === "milestone" && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${5 + i * 12}%`,
                    top: `${-5 + (i % 3) * 15}%`,
                    color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF6B6B" : "#4ECDC4"
                  }}
                  initial={{ opacity: 0, scale: 0, y: -10 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.4, 0],
                    y: [-10, -30, -50],
                    rotate: [0, 360, 720],
                    x: [0, (i % 2 ? 10 : -10), (i % 2 ? 20 : -20)]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {i % 4 === 0 ? "⭐" : i % 4 === 1 ? "💫" : i % 4 === 2 ? "🎉" : "✨"}
                </motion.div>
              ))}
            </>
          )}

          {/* Thought bubble for thinking state */}
          {animationType === "thinking" && (
            <motion.div
              className="absolute -top-8 -right-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1],
                scale: [0, 1.1, 1]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div 
                className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg"
                style={{ border: "2px solid #E0E0E0" }}
              >
                💡
              </div>
              {/* Thought bubble tail */}
              <div 
                className="absolute top-4 left-2 w-2 h-2 bg-white rounded-full"
                style={{ border: "1px solid #E0E0E0" }}
              />
            </motion.div>
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