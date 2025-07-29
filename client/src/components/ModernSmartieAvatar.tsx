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
    const baseY = Math.sin(currentFrame * 0.01) * 0.3; // Very gentle, natural breathing

    switch (animationType) {
      case "positive": // Gentle celebration
        return {
          y: [baseY, baseY - 3, baseY + 1, baseY],
          scale: [1, 1.03, 1.01, 1],
          rotate: [0, 1, -1, 0]
        };
      case "thinking": // Subtle contemplative movement
        return {
          y: [baseY, baseY - 0.5, baseY],
          rotate: [0, 0.8, -0.8, 0],
          scale: [1, 1.005, 1]
        };
      case "warning": // Gentle concerned movement
        return {
          y: baseY,
          x: [0, -0.8, 0.8, 0],
          scale: [1, 0.99, 1],
          rotate: [0, -0.5, 0.5, 0]
        };
      case "milestone": // Moderate celebration
        return {
          y: [baseY, baseY - 4, baseY + 1, baseY - 2, baseY],
          scale: [1, 1.05, 1.02, 1.03, 1],
          rotate: [0, 2, -2, 1, 0]
        };
      case "greeting": // Friendly gentle movement
        return {
          y: [baseY, baseY - 2, baseY + 0.5, baseY - 1, baseY],
          rotate: [0, 1, -0.5, 1, 0],
          scale: [1, 1.02, 1.005, 1.01, 1]
        };
      default: // idle - Very subtle breathing
        return {
          y: [baseY, baseY - 0.2, baseY],
          scale: [1, 1.002, 1],
          rotate: [0, 0.1, -0.1, 0]
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

        {/* Authentic Brain Shape - Exactly like reference with irregular bumpy outline */}
        <div
          className={`relative ${config.brain} flex flex-col items-center justify-center smartie-professional-shadow`}
          style={{
            background: "linear-gradient(135deg, #FF9BB5 0%, #FF8A9B 100%)", // 3D gradient effect
            position: "relative",
            width: "68px",
            height: "52px",
            clipPath: "polygon(15% 5%, 25% 0%, 35% 2%, 45% 0%, 55% 3%, 65% 1%, 75% 5%, 85% 8%, 92% 15%, 95% 25%, 98% 35%, 95% 45%, 92% 55%, 88% 65%, 82% 72%, 75% 78%, 65% 82%, 55% 85%, 45% 83%, 35% 85%, 25% 82%, 18% 78%, 12% 72%, 8% 65%, 5% 55%, 2% 45%, 0% 35%, 2% 25%, 5% 15%, 8% 8%)" // Authentic brain outline
          }}
        >
          {/* 3D Brain Border Effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 0%, rgba(232, 66, 125, 0.3) 100%)",
              clipPath: "polygon(15% 5%, 25% 0%, 35% 2%, 45% 0%, 55% 3%, 65% 1%, 75% 5%, 85% 8%, 92% 15%, 95% 25%, 98% 35%, 95% 45%, 92% 55%, 88% 65%, 82% 72%, 75% 78%, 65% 82%, 55% 85%, 45% 83%, 35% 85%, 25% 82%, 18% 78%, 12% 72%, 8% 65%, 5% 55%, 2% 45%, 0% 35%, 2% 25%, 5% 15%, 8% 8%)",
              border: "2px solid #E8427D"
            }}
          />

          {/* Authentic Brain Texture Lines - Like reference */}
          <div className="absolute inset-2 opacity-50 pointer-events-none">
            <svg viewBox="0 0 64 48" className="w-full h-full">
              {/* Brain hemisphere division */}
              <path
                d="M32 8 Q32 18 32 28 Q32 38 32 44"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Left hemisphere curves */}
              <path
                d="M15 15 Q20 12 25 15 Q28 18 25 22"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M12 25 Q18 22 24 25 Q28 28 24 32"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M18 35 Q22 32 26 35 Q28 38 26 40"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              {/* Right hemisphere curves */}
              <path
                d="M49 15 Q44 12 39 15 Q36 18 39 22"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M52 25 Q46 22 40 25 Q36 28 40 32"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              <path
                d="M46 35 Q42 32 38 35 Q36 38 38 40"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1.2"
              />
              {/* Additional brain folds */}
              <path
                d="M20 20 Q24 18 28 20"
                stroke="#E8427D"
                fill="none"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M36 20 Q40 18 44 20"
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

        {/* Connected Blue Arms - Attached to brain body exactly like reference */}
        <motion.div
          className="absolute origin-bottom"
          style={{ 
            left: "8px",
            top: "22px",
            transformOrigin: "center bottom"
          }}
        >
          {/* Left Arm - Connected to brain */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, -25, 25, -12, 0] // Gentler celebration
              } : animationType === "milestone" ? {
                rotate: [0, -35, 35, -18, 0] // Moderate celebration
              } : animationType === "greeting" ? {
                rotate: [0, -45, 20, -25, 8, 0] // Friendly wave
              } : animationType === "thinking" ? {
                rotate: [0, -20, -15, -20] // Hand to chin
              } : animationType === "warning" ? {
                rotate: [0, -25, -20, -25] // Gentle concern
              } : {
                rotate: [0, -3, 3, 0] // Subtle idle
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 4 : animationType === "positive" ? 3 : 2.5,
              repeat: animationType === "idle" ? Infinity : animationType === "positive" || animationType === "milestone" ? 1 : 1,
              ease: "easeInOut"
            }}
          >
            {/* Arm connected to body */}
            <div
              className="w-2 h-10 rounded-full"
              style={{ 
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                border: "1px solid #1565C0"
              }}
            />
            {/* Hand/Glove */}
            <div
              className="w-5 h-5 rounded-full border-2 mt-0.5"
              style={{ 
                background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                borderColor: "#BDBDBD",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="absolute origin-bottom"
          style={{ 
            right: "8px",
            top: "22px",
            transformOrigin: "center bottom"
          }}
        >
          {/* Right Arm - Connected to brain */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, 25, -25, 12, 0] // Gentler celebration
              } : animationType === "milestone" ? {
                rotate: [0, 35, -35, 18, 0] // Moderate celebration
              } : animationType === "greeting" ? {
                rotate: [0, 45, -20, 25, -8, 0] // Friendly wave
              } : animationType === "thinking" ? {
                rotate: [0, 20, 15, 20] // Pointing thoughtfully
              } : animationType === "warning" ? {
                rotate: [0, 15, 10, 15] // Gentle gesture
              } : {
                rotate: [0, 3, -3, 0] // Subtle idle
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 4 : animationType === "positive" ? 3 : 2.5,
              repeat: animationType === "idle" ? Infinity : animationType === "positive" || animationType === "milestone" ? 1 : 1,
              ease: "easeInOut",
              delay: 0.1
            }}
          >
            {/* Arm connected to body */}
            <div
              className="w-2 h-10 rounded-full"
              style={{ 
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                border: "1px solid #1565C0"
              }}
            />
            {/* Hand/Glove */}
            <div
              className="w-5 h-5 rounded-full border-2 mt-0.5"
              style={{ 
                background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                borderColor: "#BDBDBD",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Connected Blue Legs - Attached to brain body like reference */}
        <motion.div 
          className="relative mt-1 flex gap-3 justify-center"
          animate={animated && (animationType === "positive" || animationType === "milestone") ? {
            y: [0, -2, 0] // Much gentler bounce
          } : {}}
          transition={{
            duration: 2,
            repeat: animationType === "positive" ? 1 : animationType === "milestone" ? 1 : 0
          }}
        >
          {/* Left Leg - Connected to brain */}
          <div className="flex flex-col items-center">
            <div 
              className="w-2 h-10 rounded-full"
              style={{ 
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                border: "1px solid #1565C0"
              }}
            />
            {/* Left Sneaker - High quality 3D appearance */}
            <motion.div
              className="relative mt-0.5"
              animate={animated ? (
                animationType === "greeting" ? {
                  rotate: [0, -4, 4, 0] // Gentler movement
                } : {}
              ) : {}}
              transition={{ duration: 2, delay: 0.1 }}
            >
              <div
                className="w-6 h-5 rounded-lg relative"
                style={{ 
                  background: "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #1565C0 100%)",
                  border: "2px solid #0D47A1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)"
                }}
              >
                {/* Shoe laces */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-0.5 bg-white rounded-full opacity-90" />
                </div>
                {/* Shoe sole */}
                <div 
                  className="absolute -bottom-0.5 left-0 right-0 h-1.5 rounded-b-lg"
                  style={{ 
                    background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                    border: "1px solid #E0E0E0"
                  }}
                />
                {/* Shoe highlight */}
                <div 
                  className="absolute top-0.5 left-1 w-2 h-1 rounded-full opacity-40"
                  style={{ background: "#FFFFFF" }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Right Leg - Connected to brain */}
          <div className="flex flex-col items-center">
            <div 
              className="w-2 h-10 rounded-full"
              style={{ 
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                border: "1px solid #1565C0"
              }}
            />
            {/* Right Sneaker - High quality 3D appearance */}
            <motion.div
              className="relative mt-0.5"
              animate={animated ? (
                animationType === "greeting" ? {
                  rotate: [0, 4, -4, 0] // Gentler movement
                } : {}
              ) : {}}
              transition={{ duration: 2, delay: 0.2 }}
            >
              <div
                className="w-6 h-5 rounded-lg relative"
                style={{ 
                  background: "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #1565C0 100%)",
                  border: "2px solid #0D47A1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)"
                }}
              >
                {/* Shoe laces */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-0.5 bg-white rounded-full opacity-90" />
                </div>
                {/* Shoe sole */}
                <div 
                  className="absolute -bottom-0.5 left-0 right-0 h-1.5 rounded-b-lg"
                  style={{ 
                    background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                    border: "1px solid #E0E0E0"
                  }}
                />
                {/* Shoe highlight */}
                <div 
                  className="absolute top-0.5 left-1 w-2 h-1 rounded-full opacity-40"
                  style={{ background: "#FFFFFF" }}
                />
              </div>
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