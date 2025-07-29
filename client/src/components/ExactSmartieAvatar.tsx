import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartieAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
  animated?: boolean;
  showEffects?: boolean;
  mood?: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  accessory?: "none" | "glasses" | "backpack" | "pencil";
}

const ExactSmartieAvatar: React.FC<SmartieAvatarProps> = ({
  size = "md",
  animationType = "idle",
  animated = true,
  showEffects = false,
  mood = "happy",
  accessory = "none"
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

  // Enhanced facial expressions based on mood
  const getFacialExpression = () => {
    switch (mood) {
      case "celebrating":
        return {
          eyeStyle: "stars", // Stars in eyes
          mouthPath: "M32 46 Q40 52 48 46", // Big smile
          blushOpacity: 0.8,
          eyebrowY: 28
        };
      case "thinking":
        return {
          eyeStyle: "focused", // Focused stare
          mouthPath: "M36 48 Q40 46 44 48", // Slight concerned mouth
          blushOpacity: 0.3,
          eyebrowY: 26
        };
      case "worried":
        return {
          eyeStyle: "concerned", // Wide worried eyes
          mouthPath: "M36 50 Q40 48 44 50", // Downturned mouth
          blushOpacity: 0.2,
          eyebrowY: 24
        };
      case "confident":
        return {
          eyeStyle: "cool", // Cool confident look
          mouthPath: "M34 46 Q40 50 46 46", // Confident smile
          blushOpacity: 0.6,
          eyebrowY: 29
        };
      default: // happy
        return {
          eyeStyle: "normal",
          mouthPath: "M35 46 Q40 50 45 46", // Normal smile
          blushOpacity: 0.5,
          eyebrowY: 27
        };
    }
  };

  const expression = getFacialExpression();

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
          {/* Enhanced Snapback Cap with £ Coin Badge */}
          <g>
            {/* Cap back/crown with snapback style */}
            <ellipse cx="40" cy="18" rx="22" ry="12" fill="#1976D2" stroke="#000000" strokeWidth="2"/>
            
            {/* Cap front panel - more angular snapback style */}
            <path
              d="M18 18 Q18 6 40 6 Q62 6 62 18 Q62 24 59 24 L21 24 Q18 24 18 18 Z"
              fill="#2196F3"
              stroke="#000000"
              strokeWidth="2"
            />
            
            {/* Snapback visor - longer and more curved */}
            <ellipse cx="40" cy="26" rx="22" ry="6" fill="#1565C0" stroke="#000000" strokeWidth="2"/>
            
            {/* Visor highlight */}
            <ellipse cx="40" cy="25" rx="18" ry="3" fill="#42A5F5" opacity="0.7"/>
            
            {/* £ Coin Badge on front of cap */}
            <circle cx="40" cy="16" r="4" fill="#FFD700" stroke="#000000" strokeWidth="1.5"/>
            <text x="40" y="18" textAnchor="middle" fontSize="4" fill="#000000" fontWeight="bold">£</text>
            
            {/* Cap button on top */}
            <circle cx="40" cy="8" r="1.5" fill="#0D47A1" stroke="#000000" strokeWidth="1"/>
            
            {/* Snapback panel lines */}
            <path d="M28 12 Q40 10 52 12" stroke="#000000" strokeWidth="1" fill="none"/>
            <path d="M25 16 Q40 14 55 16" stroke="#000000" strokeWidth="1" fill="none"/>
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

          {/* Enhanced Eyes with Expression Support */}
          <g>
            {/* Eyebrows that move with mood */}
            <path 
              d={`M28 ${expression.eyebrowY} Q33 ${expression.eyebrowY - 1} 38 ${expression.eyebrowY}`} 
              stroke="#000000" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d={`M42 ${expression.eyebrowY} Q47 ${expression.eyebrowY - 1} 52 ${expression.eyebrowY}`} 
              stroke="#000000" 
              strokeWidth="2" 
              fill="none"
            />
            
            {/* Left eye */}
            <circle cx="33" cy="35" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
            {expression.eyeStyle === "stars" ? (
              <g>
                <text x="33" y="37" textAnchor="middle" fontSize="8" fill="#FFD700">★</text>
              </g>
            ) : expression.eyeStyle === "cool" ? (
              <motion.circle 
                cx="33" 
                cy="35" 
                r="3.5" 
                fill="#000000"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            ) : (
              <motion.circle 
                cx="33" 
                cy="35" 
                r={expression.eyeStyle === "concerned" ? 4 : 3.5} 
                fill="#000000"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
            
            {/* Right eye */}
            <circle cx="47" cy="35" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
            {expression.eyeStyle === "stars" ? (
              <g>
                <text x="47" y="37" textAnchor="middle" fontSize="8" fill="#FFD700">★</text>
              </g>
            ) : expression.eyeStyle === "cool" ? (
              <motion.circle 
                cx="47" 
                cy="35" 
                r="3.5" 
                fill="#000000"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            ) : (
              <motion.circle 
                cx="47" 
                cy="35" 
                r={expression.eyeStyle === "concerned" ? 4 : 3.5} 
                fill="#000000"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </g>

          {/* Blush */}
          <g opacity={expression.blushOpacity}>
            <ellipse cx="26" cy="38" rx="3" ry="2" fill="#FF69B4"/>
            <ellipse cx="54" cy="38" rx="3" ry="2" fill="#FF69B4"/>
          </g>

          {/* Enhanced Mouth with Expression Support */}
          <g>
            <path
              d={expression.mouthPath}
              stroke="#000000"
              strokeWidth="2"
              fill="none"
            />
            {/* Simple teeth for big smiles */}
            {(mood === "celebrating" || mood === "confident") && (
              <g>
                <rect x="37" y="48" width="1.5" height="2" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5"/>
                <rect x="39" y="48" width="1.5" height="2" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5"/>
                <rect x="41" y="48" width="1.5" height="2" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5"/>
              </g>
            )}
          </g>

          {/* Left Arm - Enhanced with white gloves and rubbery animation */}
          <motion.g
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, -15, 15, -8, 0],
                scaleY: [1, 1.1, 0.9, 1.05, 1]
              } : animationType === "milestone" ? {
                rotate: [0, -25, 25, -12, 0],
                scaleY: [1, 1.2, 0.8, 1.1, 1]
              } : animationType === "greeting" ? {
                rotate: [0, -30, 10, -20, 0, 0],
                scaleY: [1, 1.15, 0.85, 1.1, 1, 1]
              } : animationType === "thinking" ? {
                rotate: [0, -10, -5, -10],
                scaleY: [1, 1.05, 1.05, 1.05]
              } : {
                rotate: [0, -1, 1, 0],
                scaleY: [1, 1.02, 0.98, 1]
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
            {/* White cartoon glove */}
            <circle cx="19.5" cy="56" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5"/>
            <circle cx="19.5" cy="56" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
          </motion.g>

          {/* Right Arm - Enhanced with white gloves and rubbery animation */}
          <motion.g
            animate={animated ? (
              animationType === "positive" ? {
                rotate: [0, 15, -15, 8, 0],
                scaleY: [1, 1.1, 0.9, 1.05, 1]
              } : animationType === "milestone" ? {
                rotate: [0, 25, -25, 12, 0],
                scaleY: [1, 1.2, 0.8, 1.1, 1]
              } : animationType === "greeting" ? {
                rotate: [0, 30, -10, 20, 0, 0],
                scaleY: [1, 1.15, 0.85, 1.1, 1, 1]
              } : animationType === "thinking" ? {
                rotate: [0, 10, 5, 10],
                scaleY: [1, 1.05, 1.05, 1.05]
              } : {
                rotate: [0, 1, -1, 0],
                scaleY: [1, 1.02, 0.98, 1]
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
            {/* White cartoon glove */}
            <circle cx="60.5" cy="56" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5"/>
            <circle cx="60.5" cy="56" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
          </motion.g>

          {/* Left Leg - Enhanced with jelly movement */}
          <motion.rect 
            x="35" 
            y="58" 
            width="3" 
            height="16" 
            fill="#2196F3" 
            stroke="#000000" 
            strokeWidth="1.5" 
            rx="1.5"
            animate={animated && (animationType === "positive" || animationType === "milestone") ? {
              scaleY: [1, 0.9, 1.1, 1],
              x: [35, 34.5, 35.5, 35]
            } : {}}
            transition={{
              duration: 1.2,
              repeat: 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Right Leg - Enhanced with jelly movement */}
          <motion.rect 
            x="42" 
            y="58" 
            width="3" 
            height="16" 
            fill="#2196F3" 
            stroke="#000000" 
            strokeWidth="1.5" 
            rx="1.5"
            animate={animated && (animationType === "positive" || animationType === "milestone") ? {
              scaleY: [1, 0.9, 1.1, 1],
              x: [42, 42.5, 41.5, 42]
            } : {}}
            transition={{
              duration: 1.2,
              repeat: 0,
              ease: "easeInOut",
              delay: 0.1
            }}
          />

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

          {/* Accessories */}
          {accessory === "glasses" && (
            <g>
              <circle cx="33" cy="35" r="8" fill="none" stroke="#000000" strokeWidth="2"/>
              <circle cx="47" cy="35" r="8" fill="none" stroke="#000000" strokeWidth="2"/>
              <line x1="41" y1="35" x2="39" y2="35" stroke="#000000" strokeWidth="2"/>
            </g>
          )}
          
          {accessory === "pencil" && (
            <g>
              <rect x="52" y="28" width="1.5" height="12" fill="#FFD700" stroke="#000000" strokeWidth="1" rx="0.7" transform="rotate(15 52 28)"/>
              <rect x="52" y="26" width="1.5" height="3" fill="#FF69B4" stroke="#000000" strokeWidth="1" transform="rotate(15 52 28)"/>
            </g>
          )}
          
          {accessory === "backpack" && (
            <g>
              <ellipse cx="40" cy="50" rx="8" ry="6" fill="#4CAF50" stroke="#000000" strokeWidth="1.5" opacity="0.8"/>
              <rect x="36" y="46" width="8" height="8" fill="#388E3C" stroke="#000000" strokeWidth="1" rx="1"/>
              <circle cx="40" cy="50" r="1" fill="#FFD700" stroke="#000000" strokeWidth="0.5"/>
            </g>
          )}

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