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
    const baseY = Math.sin(currentFrame * 0.015) * 0.8; // Professional gentle breathing

    switch (animationType) {
      case "positive": // Celebration jump with fist pump
        return {
          y: [baseY, baseY - 8, baseY + 2, baseY],
          scale: [1, 1.08, 1.03, 1],
          rotate: [0, 3, -3, 0]
        };
      case "thinking": // Contemplative gentle sway
        return {
          y: [baseY, baseY - 1, baseY],
          rotate: [0, 1.5, -1.5, 0],
          scale: [1, 1.01, 1]
        };
      case "warning": // Concerned shake
        return {
          y: baseY,
          x: [0, -1.5, 1.5, 0],
          scale: [1, 0.98, 1],
          rotate: [0, -1, 1, 0]
        };
      case "milestone": // Big celebration with bounce
        return {
          y: [baseY, baseY - 12, baseY + 3, baseY - 6, baseY],
          scale: [1, 1.12, 1.05, 1.08, 1],
          rotate: [0, 5, -5, 3, 0]
        };
      case "greeting": // Friendly welcome bounce
        return {
          y: [baseY, baseY - 4, baseY + 1, baseY - 2, baseY],
          rotate: [0, 2, -1, 2, 0],
          scale: [1, 1.04, 1.01, 1.02, 1]
        };
      default: // idle - Professional breathing
        return {
          y: [baseY, baseY - 0.5, baseY],
          scale: [1, 1.005, 1],
          rotate: [0, 0.2, -0.2, 0]
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
        {/* Green Beanie/Cap - Exactly like latest reference */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div 
            className="relative"
            style={{
              width: "50px",
              height: "22px"
            }}
          >
            {/* Main beanie part */}
            <div
              className="absolute inset-0 rounded-t-full"
              style={{
                background: "#4CAF50",
                border: "2px solid #2E7D32",
                borderBottomLeftRadius: "45%",
                borderBottomRightRadius: "45%"
              }}
            />
            {/* Yellow visor/brim */}
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              style={{
                width: "28px",
                height: "6px",
                background: "#FFD54F",
                border: "1px solid #FFC107",
                borderRadius: "0 0 40% 40%"
              }}
            />
            {/* Small beanie fold line */}
            <div
              className="absolute top-2 left-1 right-1 h-0.5 rounded-full"
              style={{
                background: "#2E7D32",
                opacity: "0.6"
              }}
            />
          </div>
        </div>

        {/* Brain Body - Authentic brain shape exactly like reference */}
        <div
          className={`relative ${config.brain} flex flex-col items-center justify-center`}
          style={{
            background: "#FF9BB5", // Pink brain color from reference
            border: "3px solid #E8427D",
            borderRadius: "45% 45% 50% 50%", // Brain-like bumpy shape
            position: "relative",
            width: "64px",
            height: "48px"
          }}
        >
          {/* Brain Texture - Curved lines like reference */}
          <div className="absolute inset-1 opacity-40 pointer-events-none">
            <svg viewBox="0 0 60 45" className="w-full h-full">
              {/* Brain fold curves exactly like reference */}
              <path
                d="M12 15 Q20 10 28 15 Q35 20 42 15"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M8 25 Q18 20 28 25 Q38 30 48 25"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M15 35 Q25 30 35 35 Q45 38 50 32"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              {/* Additional brain texture */}
              <path
                d="M10 18 Q15 15 22 18 Q28 22 35 18"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

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

          {/* Mouth - Small curved mouth like reference */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-8">
            <div 
              style={{
                width: "12px",
                height: "6px",
                borderBottom: "2px solid #000",
                borderRadius: "0 0 12px 12px",
                background: moodStyles.mouthColor || "transparent"
              }}
            />
          </div>
        </div>

        {/* Blue Arms with White Gloves - Professional pose system */}
        <motion.div
          className="absolute left-0 top-1/2 origin-top"
          style={{ 
            transformOrigin: "50% 0%",
            left: "-14px",
            top: "14px"
          }}
        >
          {/* Left Arm */}
          <motion.div
            className="relative"
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, -45, 45, -20, 0] // Celebration fist pump
              } : animationType === "milestone" ? {
                rotate: [0, -60, 60, -30, 0] // Big celebration
              } : animationType === "greeting" ? {
                rotate: [0, -70, 30, -40, 10, 0] // Friendly wave
              } : animationType === "thinking" ? {
                rotate: [0, -30, -25, -30] // Hand to chin
              } : animationType === "warning" ? {
                rotate: [0, -45, -40, -45] // Facepalm
              } : {
                rotate: [0, -8, 8, 0] // Gentle idle
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 3.5 : animationType === "positive" ? 2.2 : animationType === "thinking" ? 1.8 : 2,
              repeat: animationType === "idle" ? Infinity : animationType === "positive" || animationType === "milestone" ? 2 : 1,
              ease: "easeInOut"
            }}
          >
            <div
              className="w-1.5 h-9 rounded-full"
              style={{ background: "#2196F3" }}
            />
            {/* Left White Glove */}
            <div
              className="absolute -bottom-1 -left-1.5 w-4 h-4 rounded-full border-2"
              style={{ 
                background: "#FFFFFF",
                borderColor: "#E0E0E0"
              }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="absolute right-0 top-1/2 origin-top"
          style={{ 
            transformOrigin: "50% 0%",
            right: "-14px",
            top: "14px"
          }}
        >
          {/* Right Arm */}
          <motion.div
            className="relative"
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, 45, -45, 20, 0] // Celebration fist pump
              } : animationType === "milestone" ? {
                rotate: [0, 60, -60, 30, 0] // Big celebration
              } : animationType === "greeting" ? {
                rotate: [0, 70, -30, 40, -10, 0] // Friendly wave
              } : animationType === "thinking" ? {
                rotate: [0, 30, 25, 30] // Pointing up thoughtfully
              } : animationType === "warning" ? {
                rotate: [0, 20, 15, 20] // Gentle gesture
              } : {
                rotate: [0, 8, -8, 0] // Gentle idle
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 3.5 : animationType === "positive" ? 2.2 : animationType === "thinking" ? 1.8 : 2,
              repeat: animationType === "idle" ? Infinity : animationType === "positive" || animationType === "milestone" ? 2 : 1,
              ease: "easeInOut",
              delay: 0.15
            }}
          >
            <div
              className="w-1.5 h-9 rounded-full"
              style={{ background: "#2196F3" }}
            />
            {/* Right White Glove */}
            <div
              className="absolute -bottom-1 -right-1.5 w-4 h-4 rounded-full border-2"
              style={{ 
                background: "#FFFFFF",
                borderColor: "#E0E0E0"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Blue Stick Legs - Exactly like reference */}
        <motion.div 
          className="relative mt-4 flex gap-2 justify-center"
          animate={animated && (animationType === "positive" || animationType === "milestone") ? {
            y: [0, -4, 0, -2, 0]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: animationType === "positive" ? 2 : animationType === "milestone" ? 3 : 0
          }}
        >
          {/* Left Leg */}
          <div className="flex flex-col items-center">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ background: "#2E86AB" }}
            />
            {/* Left Blue Sneaker - Updated to match reference */}
            <motion.div
              className="relative mt-1"
              animate={animated ? (
                animationType === "greeting" ? {
                  rotate: [0, -8, 8, 0]
                } : animationType === "positive" || animationType === "milestone" ? {
                  y: [0, -2, 0]
                } : {}
              ) : {}}
              transition={{ duration: 1.2, delay: 0.1 }}
            >
              <div
                className="w-5 h-4 rounded-lg"
                style={{ 
                  background: "#2196F3",
                  border: "2px solid #1976D2"
                }}
              />
              {/* Shoe details */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-0.5 bg-white rounded-full opacity-90" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-b-lg opacity-80" />
            </motion.div>
          </div>
          
          {/* Right Leg */}
          <div className="flex flex-col items-center">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ background: "#2E86AB" }}
            />
            {/* Right Blue Sneaker - Updated to match reference */}
            <motion.div
              className="relative mt-1"
              animate={animated ? (
                animationType === "greeting" ? {
                  rotate: [0, 8, -8, 0]
                } : animationType === "positive" || animationType === "milestone" ? {
                  y: [0, -2, 0]
                } : {}
              ) : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <div
                className="w-5 h-4 rounded-lg"
                style={{ 
                  background: "#2196F3",
                  border: "2px solid #1976D2"
                }}
              />
              {/* Shoe details */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-0.5 bg-white rounded-full opacity-90" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-b-lg opacity-80" />
            </motion.div>
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