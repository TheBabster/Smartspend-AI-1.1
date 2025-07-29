import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartieAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
  animated?: boolean;
  showEffects?: boolean;
  mood?: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  accessory?: "none" | "glasses" | "backpack" | "pencil" | "clipboard" | "speech-bubble";
  pose?: "default" | "waving" | "thinking-chin" | "celebrating-arms-up" | "nervous";
}

const ExactSmartieAvatar: React.FC<SmartieAvatarProps> = ({
  size = "md",
  animationType = "idle",
  animated = true,
  showEffects = false,
  mood = "happy",
  accessory = "none",
  pose = "default"
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

  // Enhanced pose system for different character poses
  const getPoseConfiguration = () => {
    switch (pose) {
      case "waving":
        return {
          leftArmRotate: [0, -30, 15, -20, 0, 0],
          rightArmRotate: [0, 40, -15, 25, -5, 0],
          leftArmY: 38,
          rightArmY: 38,
          bodyY: 0,
          specialEffects: "wave"
        };
      case "thinking-chin":
        return {
          leftArmRotate: [0, -10, -5, -10],
          rightArmRotate: [0, 45, 50, 45], // Hand to chin
          leftArmY: 38,
          rightArmY: 32, // Raised for chin
          bodyY: 0,
          specialEffects: "thinking"
        };
      case "celebrating-arms-up":
        return {
          leftArmRotate: [0, -70, -65, -70],
          rightArmRotate: [0, 70, 65, 70],
          leftArmY: 30, // Raised up
          rightArmY: 30, // Raised up
          bodyY: [0, -2, 0],
          specialEffects: "celebration"
        };
      case "nervous":
        return {
          leftArmRotate: [0, -5, 5, -5],
          rightArmRotate: [0, 5, -5, 5],
          leftArmY: 38,
          rightArmY: 38,
          bodyY: [0, 0.5, 0, -0.5],
          specialEffects: "nervous"
        };
      default:
        return {
          leftArmRotate: [0, -1, 1, 0],
          rightArmRotate: [0, 1, -1, 0],
          leftArmY: 38,
          rightArmY: 38,
          bodyY: 0,
          specialEffects: "none"
        };
    }
  };

  const poseConfig = getPoseConfiguration();

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
          {/* Enhanced Snapback Cap with Glowing £ Badge */}
          <g>
            {/* Cap back/crown with snapback style and slight tilt */}
            <ellipse cx="40" cy="18" rx="22" ry="12" fill="#1976D2" stroke="#000000" strokeWidth="2" transform="rotate(-2 40 18)"/>
            
            {/* Cap front panel - more angular snapback style with 3D curve */}
            <path
              d="M18 18 Q18 6 40 6 Q62 6 62 18 Q62 24 59 24 L21 24 Q18 24 18 18 Z"
              fill="#2196F3"
              stroke="#000000"
              strokeWidth="2"
              transform="rotate(-2 40 18)"
            />
            
            {/* Snapback visor - longer and more curved with 3D effect */}
            <ellipse cx="40" cy="26" rx="22" ry="6" fill="#1565C0" stroke="#000000" strokeWidth="2" transform="rotate(-2 40 26)"/>
            <ellipse cx="40" cy="24" rx="20" ry="4" fill="#1976D2" opacity="0.6" transform="rotate(-2 40 24)"/>
            
            {/* Visor highlight */}
            <ellipse cx="40" cy="25" rx="18" ry="3" fill="#42A5F5" opacity="0.7" transform="rotate(-2 40 25)"/>
            
            {/* Glowing £ Badge on front of cap */}
            <g transform="rotate(-2 40 16)">
              <circle cx="40" cy="16" r="5" fill="#FFD700" opacity="0.3"/>
              <circle cx="40" cy="16" r="4" fill="#FFD700" stroke="#000000" strokeWidth="1.5"/>
              <motion.circle
                cx="40"
                cy="16"
                r="4.5"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1"
                opacity="0.8"
                animate={animated ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 0.4, 0.8]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <text x="40" y="18" textAnchor="middle" fontSize="4" fill="#000000" fontWeight="bold">£</text>
            </g>
            
            {/* Cap button on top */}
            <circle cx="40" cy="8" r="1.5" fill="#0D47A1" stroke="#000000" strokeWidth="1" transform="rotate(-2 40 8)"/>
            
            {/* Enhanced snapback panel lines */}
            <path d="M28 12 Q40 10 52 12" stroke="#000000" strokeWidth="1" fill="none" transform="rotate(-2 40 12)"/>
            <path d="M25 16 Q40 14 55 16" stroke="#000000" strokeWidth="1" fill="none" transform="rotate(-2 40 16)"/>
            <path d="M30 20 Q40 18 50 20" stroke="#000000" strokeWidth="0.8" fill="none" transform="rotate(-2 40 20)"/>
          </g>

          {/* Enhanced Brain Body with Comic-Style Texture AND ATTACHED LEGS */}
          <motion.g
            animate={animated && poseConfig.bodyY !== 0 ? {
              y: poseConfig.bodyY
            } : {}}
            transition={{
              duration: 1.5,
              repeat: pose === "nervous" ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Main brain outline with enhanced bumpy texture */}
            <path
              d="M22 32 Q18 25 25 22 Q30 20 35 22 Q40 18 45 22 Q50 18 55 22 Q60 20 65 22 Q72 25 68 32 Q74 37 70 42 Q74 47 68 52 Q65 58 55 56 Q50 60 45 56 Q40 60 35 56 Q30 58 25 56 Q18 47 20 42 Q16 37 22 32 Z"
              fill="#FF9BB5"
              stroke="#000000"
              strokeWidth="2"
            />
            
            {/* Enhanced comic-style brain texture - stylized loops and curves */}
            <path d="M27 28 Q32 26 37 28 Q39 31 37 34 Q35 36 33 34" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M43 28 Q48 26 53 28 Q55 31 53 34 Q51 36 49 34" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M29 38 Q35 36 42 38 Q44 41 42 44 Q40 46 38 44" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M48 38 Q54 36 60 38 Q62 41 60 44 Q58 46 56 44" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M32 48 Q38 46 45 48 Q47 51 45 54 Q43 56 41 54" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            <path d="M50 48 Q56 46 62 48 Q64 51 62 54 Q60 56 58 54" stroke="#E8427D" strokeWidth="1.5" fill="none"/>
            
            {/* Additional cute stylized loops */}
            <circle cx="31" cy="32" r="2" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.7"/>
            <circle cx="49" cy="32" r="2" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.7"/>
            <circle cx="34" cy="42" r="1.5" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.6"/>
            <circle cx="46" cy="42" r="1.5" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.6"/>
            <circle cx="37" cy="52" r="1" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.5"/>
            <circle cx="43" cy="52" r="1" fill="none" stroke="#E8427D" strokeWidth="1" opacity="0.5"/>
            
            {/* Center brain hemisphere division */}
            <path d="M40 25 Q40 35 40 45 Q40 55 40 58" stroke="#E8427D" strokeWidth="1.5" fill="none" opacity="0.7"/>
            
            {/* LEFT LEG - ATTACHED TO BRAIN BODY - MOVES WITH BRAIN */}
            <motion.rect 
              x="32" 
              y="56" 
              width="5" 
              height="16" 
              fill="#2196F3" 
              stroke="#000000" 
              strokeWidth="2" 
              rx="2.5"
              animate={animated ? (
                pose === "nervous" ? {
                  scaleY: [1, 0.95, 1.05, 1],
                  x: [32, 31.8, 32.2, 32],
                  rotate: [0, -1, 1, 0]
                } : (animationType === "positive" || animationType === "milestone") ? {
                  scaleY: [1, 0.9, 1.1, 1],
                  x: [32, 31.5, 32.5, 32]
                } : {}
              ) : {}}
              transition={{
                duration: pose === "nervous" ? 0.8 : 1.2,
                repeat: pose === "nervous" ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* RIGHT LEG - ATTACHED TO BRAIN BODY - MOVES WITH BRAIN */}
            <motion.rect 
              x="43" 
              y="56" 
              width="5" 
              height="16" 
              fill="#2196F3" 
              stroke="#000000" 
              strokeWidth="2" 
              rx="2.5"
              animate={animated ? (
                pose === "nervous" ? {
                  scaleY: [1, 0.95, 1.05, 1],
                  x: [43, 43.2, 42.8, 43],
                  rotate: [0, 1, -1, 0]
                } : (animationType === "positive" || animationType === "milestone") ? {
                  scaleY: [1, 0.9, 1.1, 1],
                  x: [43, 43.5, 42.5, 43]
                } : {}
              ) : {}}
              transition={{
                duration: pose === "nervous" ? 0.8 : 1.2,
                repeat: pose === "nervous" ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.1
              }}
            />

            {/* LEFT SHOE - ATTACHED TO BRAIN BODY - MOVES WITH BRAIN */}
            <g>
              <ellipse cx="34.5" cy="74" rx="5.5" ry="3" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
              <ellipse cx="34.5" cy="75.5" rx="6" ry="1.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
              <line x1="30" y1="73" x2="39" y2="73" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="29" y1="75" x2="40" y2="75" stroke="#FFFFFF" strokeWidth="1"/>
            </g>

            {/* RIGHT SHOE - ATTACHED TO BRAIN BODY - MOVES WITH BRAIN */}
            <g>
              <ellipse cx="45.5" cy="74" rx="5.5" ry="3" fill="#2196F3" stroke="#000000" strokeWidth="2"/>
              <ellipse cx="45.5" cy="75.5" rx="6" ry="1.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
              <line x1="41" y1="73" x2="50" y2="73" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="40" y1="75" x2="51" y2="75" stroke="#FFFFFF" strokeWidth="1"/>
            </g>
          </motion.g>

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

          {/* Left Arm - Enhanced with pose-specific positioning */}
          <motion.g
            animate={animated ? {
              rotate: poseConfig.leftArmRotate,
              scaleY: [1, 1.1, 0.9, 1.05, 1],
              y: poseConfig.leftArmY - 38
            } : {}}
            transition={{
              duration: pose === "thinking-chin" ? 3 : pose === "celebrating-arms-up" ? 2 : 1.8,
              repeat: (animationType === "idle" || pose === "nervous") ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "20px 38px" }}
          >
            <rect x="18" y={poseConfig.leftArmY} width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>
            {/* White cartoon glove */}
            <circle cx="19.5" cy={poseConfig.leftArmY + 18} r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5"/>
            <circle cx="19.5" cy={poseConfig.leftArmY + 18} r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
          </motion.g>

          {/* Right Arm - Enhanced with pose-specific positioning */}
          <motion.g
            animate={animated ? {
              rotate: poseConfig.rightArmRotate,
              scaleY: [1, 1.1, 0.9, 1.05, 1],
              y: poseConfig.rightArmY - 38
            } : {}}
            transition={{
              duration: pose === "thinking-chin" ? 3 : pose === "celebrating-arms-up" ? 2 : 1.8,
              repeat: (animationType === "idle" || pose === "nervous") ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.1
            }}
            style={{ transformOrigin: "60px 38px" }}
          >
            <rect x="59" y={poseConfig.rightArmY} width="3" height="16" fill="#2196F3" stroke="#000000" strokeWidth="1.5" rx="1.5"/>
            {/* White cartoon glove */}
            <circle cx="60.5" cy={poseConfig.rightArmY + 18} r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5"/>
            <circle cx="60.5" cy={poseConfig.rightArmY + 18} r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
          </motion.g>





          {/* Enhanced Accessories System */}
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
          
          {accessory === "clipboard" && (
            <g>
              <rect x="12" y="35" width="8" height="12" fill="#F5F5F5" stroke="#000000" strokeWidth="1.5" rx="1"/>
              <rect x="13" y="36" width="6" height="1" fill="#666" stroke="none"/>
              <rect x="13" y="38" width="6" height="1" fill="#666" stroke="none"/>
              <rect x="13" y="40" width="4" height="1" fill="#666" stroke="none"/>
              <circle cx="16" cy="33" r="1" fill="#C0C0C0" stroke="#000000" strokeWidth="0.5"/>
            </g>
          )}
          
          {accessory === "speech-bubble" && (
            <g>
              <ellipse cx="25" cy="20" rx="12" ry="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5"/>
              <path d="M28 26 L30 30 L32 26 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
              <circle cx="20" cy="18" r="6" fill="#42A5F5" stroke="#000000" strokeWidth="1"/>
              <path d="M18 16 L20 18 L22 16 M18 20 L20 18 L22 20" stroke="#FFFFFF" strokeWidth="1" fill="none"/>
            </g>
          )}

          {/* Special Effects Based on Pose */}
          {pose === "nervous" && poseConfig.specialEffects === "nervous" && (
            <g>
              {/* Sweat drop */}
              <motion.ellipse
                cx="52"
                cy="28"
                rx="1.5"
                ry="2"
                fill="#87CEEB"
                stroke="#000000"
                strokeWidth="0.5"
                animate={animated ? {
                  y: [0, 5, 10],
                  opacity: [1, 0.8, 0]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeIn"
                }}
              />
              {/* Nervous lines */}
              <motion.g
                animate={animated ? {
                  opacity: [0.3, 0.7, 0.3]
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: Infinity
                }}
              >
                <path d="M25 20 L27 18" stroke="#000000" strokeWidth="0.5" opacity="0.5"/>
                <path d="M55 20 L53 18" stroke="#000000" strokeWidth="0.5" opacity="0.5"/>
                <path d="M28 22 L30 20" stroke="#000000" strokeWidth="0.5" opacity="0.5"/>
              </motion.g>
            </g>
          )}
          
          {pose === "celebrating-arms-up" && poseConfig.specialEffects === "celebration" && (
            <g>
              {/* Celebration stars */}
              {[...Array(5)].map((_, i) => (
                <motion.g
                  key={i}
                  animate={animated ? {
                    scale: [0, 1.2, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  <text
                    x={20 + i * 10}
                    y={15 + (i % 2) * 5}
                    textAnchor="middle"
                    fontSize="6"
                    fill="#FFD700"
                  >
                    ⭐
                  </text>
                </motion.g>
              ))}
            </g>
          )}
          
          {pose === "thinking-chin" && poseConfig.specialEffects === "thinking" && (
            <g>
              {/* Thought bubble */}
              <motion.g
                animate={animated ? {
                  scale: [0.8, 1, 0.8],
                  opacity: [0.6, 1, 0.6]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                <circle cx="65" cy="15" r="1" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" opacity="0.8"/>
                <circle cx="68" cy="12" r="1.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" opacity="0.9"/>
                <ellipse cx="72" cy="8" rx="4" ry="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                <text x="72" y="10" textAnchor="middle" fontSize="3" fill="#000000">?</text>
              </motion.g>
            </g>
          )}
          
          {pose === "waving" && poseConfig.specialEffects === "wave" && (
            <g>
              {/* Wave motion lines */}
              <motion.g
                animate={animated ? {
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                <path d="M75 35 Q77 33 79 35" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.7"/>
                <path d="M77 32 Q79 30 81 32" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.6"/>
                <path d="M76 38 Q78 36 80 38" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.5"/>
              </motion.g>
            </g>
          )}

          {/* Shadow */}
          <ellipse cx="40" cy="79" rx="18" ry="3" fill="#000000" opacity="0.15"/>
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