import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartieAvatarSystemProps {
  mood: "happy" | "thinking" | "celebrating" | "concerned" | "proud" | "warning" | "excited" | "relaxed";
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showAccessories?: boolean;
  accessories?: string[];
}

const SmartieAvatarSystem: React.FC<SmartieAvatarSystemProps> = ({
  mood = "happy",
  size = "md",
  animated = true,
  showAccessories = false,
  accessories = []
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking animation
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Floating animation
  useEffect(() => {
    if (!animated) return;
    
    const floatInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 60);
    }, 100);

    return () => clearInterval(floatInterval);
  }, [animated]);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const getSmartieFace = () => {
    const eyeState = isBlinking ? "closed" : "open";
    
    switch (mood) {
      case "happy":
        return {
          eyes: eyeState === "open" ? "●●" : "--",
          mouth: "︶",
          color: "#FF6B9D",
          glow: "#FFE0E9"
        };
      case "thinking":
        return {
          eyes: eyeState === "open" ? "◐◑" : "--", 
          mouth: "○",
          color: "#4ECDC4",
          glow: "#E0F7FA"
        };
      case "celebrating":
        return {
          eyes: eyeState === "open" ? "★★" : "--",
          mouth: "︶",
          color: "#FFD93D",
          glow: "#FFF9C4"
        };
      case "concerned":
        return {
          eyes: eyeState === "open" ? "◉◉" : "--",
          mouth: "︵",
          color: "#FF8A65",
          glow: "#FFE0DD"
        };
      case "proud":
        return {
          eyes: eyeState === "open" ? "◆◆" : "--",
          mouth: "︶",
          color: "#9C27B0",
          glow: "#F3E5F5"
        };
      case "warning":
        return {
          eyes: eyeState === "open" ? "⚠⚠" : "--",
          mouth: "—",
          color: "#FF5722",
          glow: "#FFEBEE"
        };
      case "excited":
        return {
          eyes: eyeState === "open" ? "✦✦" : "--",
          mouth: "︶",
          color: "#FF4081",
          glow: "#FCE4EC"
        };
      case "relaxed":
        return {
          eyes: eyeState === "open" ? "◕◕" : "--",
          mouth: "︶", 
          color: "#66BB6A",
          glow: "#E8F5E8"
        };
      default:
        return {
          eyes: eyeState === "open" ? "●●" : "--",
          mouth: "︶",
          color: "#FF6B9D",
          glow: "#FFE0E9"
        };
    }
  };

  const face = getSmartieFace();
  const floatY = animated ? Math.sin(currentFrame * 0.1) * 2 : 0;

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      style={{
        transform: `translateY(${floatY}px)`
      }}
      whileHover={animated ? { scale: 1.1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full blur-lg opacity-30"
        style={{ backgroundColor: face.glow }}
      />
      
      {/* Brain Body */}
      <motion.div
        className="relative w-full h-full rounded-full flex flex-col items-center justify-center font-bold text-lg shadow-lg border-2"
        style={{ 
          backgroundColor: face.color,
          borderColor: face.color,
          filter: "brightness(1.1)"
        }}
        animate={animated ? {
          scale: [1, 1.02, 1],
          rotate: [0, 1, -1, 0]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Brain Texture */}
        <div className="absolute inset-1 rounded-full opacity-20">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.59-.24.87-.38.25-.13.49-.27.72-.42.23-.15.45-.31.66-.48.21-.17.41-.35.6-.54.19-.19.37-.39.54-.6.17-.21.33-.43.48-.66.15-.23.29-.47.42-.72.14-.28.27-.57.38-.87.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </div>
        
        {/* Eyes */}
        <div className="text-sm font-black text-white drop-shadow-sm mb-1">
          {face.eyes}
        </div>
        
        {/* Mouth */}
        <div className="text-sm font-black text-white drop-shadow-sm">
          {face.mouth}
        </div>
        
        {/* Accessories */}
        {showAccessories && accessories.map((accessory, index) => (
          <motion.div
            key={accessory}
            className="absolute text-lg"
            style={{
              top: accessory.includes("hat") ? "-8px" : "auto",
              right: accessory.includes("glasses") ? "2px" : "auto",
              bottom: accessory.includes("shoes") ? "-8px" : "auto"
            }}
            animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          >
            {accessory}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Sparkles for celebration */}
      <AnimatePresence>
        {mood === "celebrating" && animated && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-xs font-bold"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${10 + (i % 2) * 60}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SmartieAvatarSystem;