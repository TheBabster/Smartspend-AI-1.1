import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartieAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
  animated?: boolean;
  showEffects?: boolean;
  mood?: "happy" | "thinking" | "concerned" | "celebrating" | "proud" | "sleepy";
}

const ExactSmartieAvatar: React.FC<SmartieAvatarProps> = ({
  size = "md",
  animationType = "idle",
  animated = true,
  showEffects = false,
  mood = "happy"
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-16 h-20";
      case "md": return "w-20 h-24";
      case "lg": return "w-24 h-28";
      case "xl": return "w-32 h-36";
      default: return "w-20 h-24";
    }
  };

  return (
    <div className={`relative ${getSizeClasses()} flex items-center justify-center`}>
      {/* Pixel Perfect Smartie - Exact copy from reference images */}
      <motion.div
        className="relative"
        animate={animated ? (
          animationType === "positive" ? {
            y: [0, -2, 0],
            scale: [1, 1.02, 1],
            rotate: [0, 0.5, 0]
          } : animationType === "milestone" ? {
            y: [0, -3, 0, -1, 0],
            scale: [1, 1.03, 1.01, 1.02, 1],
            rotate: [0, 1, -1, 0.5, 0]
          } : animationType === "greeting" ? {
            y: [0, -1, 0],
            rotate: [0, 0.3, 0]
          } : {
            y: [0, -0.1, 0],
            scale: [1, 1.001, 1]
          }
        ) : {}}
        transition={{
          duration: animationType === "idle" ? 3 : 2,
          repeat: animationType === "idle" ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <svg width="80" height="100" viewBox="0 0 80 100" className="overflow-visible">
          {/* Blue Baseball Cap */}
          <g>
            {/* Cap back/crown */}
            <ellipse cx="40" cy="18" rx="22" ry="12" fill="#1976D2" stroke="#000000" strokeWidth="2"/>
            
            {/* Cap front panel */}
            <path
              d="M18 18 Q18 8 40 8 Q62 8 62 18 Q62 22 60 22 L20 22 Q18 22 18 18 Z"
              fill="#2196F3"
              stroke="#000000"
              strokeWidth="2"
            />
            
            {/* Cap visor */}
            <ellipse cx="40" cy="25" rx="20" ry="5" fill="#1565C0" stroke="#000000" strokeWidth="2"/>
            
            {/* Cap visor highlight */}
            <ellipse cx="40" cy="24" rx="16" ry="2.5" fill="#42A5F5" opacity="0.6"/>
            
            {/* Cap button on top */}
            <circle cx="40" cy="10" r="1.5" fill="#0D47A1" stroke="#000000" strokeWidth="1"/>
            
            {/* Cap panel seams */}
            <path d="M30 14 Q40 12 50 14" stroke="#000000" strokeWidth="1" fill="none"/>
          </g>

          {/* Brain Body - Authentic bumpy brain shape */}
          <g>
            {/* Main brain outline with bumpy texture exactly like reference */}
            <path
              d="M22 32 Q18 25 25 22 Q30 20 35 22 Q40 18 45 22 Q50 18 55 22 Q60 20 65 22 Q72 25 68 32 Q74 37 70 42 Q74 47 68 52 Q65 58 55 56 Q50 60 45 56 Q40 60 35 56 Q30 58 25 56 Q18 47 20 42 Q16 37 22 32 Z"
              fill="#FF9BB5"
              stroke="#000000"
              strokeWidth="2"
            />
            
            {/* Brain texture lines - exactly like reference brain folds */}
            <path d="M27 28 Q32 26 37 28 Q39 31 37 34" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M43 28 Q48 26 53 28 Q55 31 53 34" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M29 38 Q35 36 42 38 Q44 41 42 44" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M48 38 Q54 36 60 38 Q62 41 60 44" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M32 48 Q38 46 45 48 Q47 51 45 54" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M50 48 Q56 46 62 48 Q64 51 62 54" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            
            {/* Center brain hemisphere division */}
            <path d="M40 25 Q40 35 40 45 Q40 55 40 58" stroke="#E8427D" strokeWidth="1.5" fill="none" opacity="0.7"/>
          </g>

          {/* Eyes - Large white circles with black pupils exactly like reference */}
          <g>
            {/* Left eye */}
            <circle cx="33" cy="35" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
            <motion.circle 
              cx="33" 
              cy="35" 
              r="3.5" 
              fill="#000000"
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Right eye */}
            <circle cx="47" cy="35" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
            <motion.circle 
              cx="47" 
              cy="35" 
              r="3.5" 
              fill="#000000"
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.1 }}
            />
          </g>

          {/* Mouth - Simple curved smile exactly like reference */}
          <g>
            <path
              d="M35 46 Q40 50 45 46"
              stroke="#000000"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Left Arm - Blue stick arm attached to brain */}
          <motion.g
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, -15, 15, -8, 0]
              } : animationType === "milestone" ? {
                rotate: [0, -25, 25, -12, 0]
              } : animationType === "greeting" ? {
                rotate: [0, -30, 10, -20, 0, 0]
              } : animationType === "thinking" ? {
                rotate: [0, -10, -5, -10]
              } : {
                rotate: [0, -1, 1, 0]
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 2.5 : 1.8,
              repeat: animationType === "idle" ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "20px 38px" }}
          >
            <rect x="18" y="38" width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>
            <circle cx="19.5" cy="56" r="3" fill="#2196F3" stroke="#000000" strokeWidth="1.5"/>
          </motion.g>

          {/* Right Arm - Blue stick arm attached to brain */}
          <motion.g
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, 15, -15, 8, 0]
              } : animationType === "milestone" ? {
                rotate: [0, 25, -25, 12, 0]
              } : animationType === "greeting" ? {
                rotate: [0, 30, -10, 20, 0, 0]
              } : animationType === "thinking" ? {
                rotate: [0, 10, 5, 10]
              } : {
                rotate: [0, 1, -1, 0]
              }
            ) : {}}
            transition={{
              duration: animationType === "greeting" ? 2.5 : 1.8,
              repeat: animationType === "idle" ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.1
            }}
            style={{ transformOrigin: "60px 38px" }}
          >
            <rect x="59" y="38" width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>
            <circle cx="60.5" cy="56" r="3" fill="#2196F3" stroke="#000000" strokeWidth="1.5"/>
          </motion.g>

          {/* Left Leg - Blue stick leg */}
          <rect x="35" y="58" width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>
          
          {/* Right Leg - Blue stick leg */}
          <rect x="42" y="58" width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>

          {/* Left Shoe - Blue sneaker with white sole exactly like reference */}
          <g>
            <ellipse cx="36.5" cy="78" rx="6" ry="3.5" fill="#2196F3" stroke="#000000" strokeWidth="1.5"/>
            <ellipse cx="36.5" cy="80" rx="7" ry="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <line x1="32" y1="76" x2="41" y2="76" stroke="#FFFFFF" strokeWidth="0.8"/>
            <line x1="31" y1="78" x2="42" y2="78" stroke="#FFFFFF" strokeWidth="0.8"/>
          </g>

          {/* Right Shoe - Blue sneaker with white sole exactly like reference */}
          <g>
            <ellipse cx="43.5" cy="78" rx="6" ry="3.5" fill="#2196F3" stroke="#000000" strokeWidth="1.5"/>
            <ellipse cx="43.5" cy="80" rx="7" ry="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <line x1="39" y1="76" x2="48" y2="76" stroke="#FFFFFF" strokeWidth="0.8"/>
            <line x1="38" y1="78" x2="49" y2="78" stroke="#FFFFFF" strokeWidth="0.8"/>
          </g>

          {/* Shadow */}
          <ellipse cx="40" cy="86" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        </svg>
      </motion.div>

      {/* Special Effects */}
      <AnimatePresence>
        {showEffects && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-xs pointer-events-none z-20"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${15 + (i % 2) * 50}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -10, -20]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.15
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExactSmartieAvatar;