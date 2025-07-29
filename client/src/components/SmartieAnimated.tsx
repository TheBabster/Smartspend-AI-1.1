import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SmartieAnimatedProps {
  mood: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'proud' | 'sleepy';
  size?: 'sm' | 'md' | 'lg';
  isIdle?: boolean;
  showCoin?: boolean;
  className?: string;
}

export default function SmartieAnimated({ 
  mood = 'happy', 
  size = 'md', 
  isIdle = true,
  showCoin = false,
  className = "" 
}: SmartieAnimatedProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(false);

  // Auto-blink every 3-5 seconds
  useEffect(() => {
    if (!isIdle) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(blinkInterval);
  }, [isIdle]);

  // Random bounce when idle
  useEffect(() => {
    if (!isIdle) return;
    
    const bounceInterval = setInterval(() => {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 600);
    }, Math.random() * 5000 + 7000);

    return () => clearInterval(bounceInterval);
  }, [isIdle]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const getEyeExpression = () => {
    if (isBlinking) return 'closed';
    
    switch (mood) {
      case 'happy': return 'happy';
      case 'thinking': return 'focused';
      case 'concerned': return 'worried';
      case 'celebrating': return 'excited';
      case 'proud': return 'confident';
      case 'sleepy': return 'sleepy';
      default: return 'happy';
    }
  };

  const getMouthExpression = () => {
    switch (mood) {
      case 'happy': return 'smile';
      case 'thinking': return 'neutral';
      case 'concerned': return 'frown';
      case 'celebrating': return 'bigSmile';
      case 'proud': return 'smile';
      case 'sleepy': return 'yawn';
      default: return 'smile';
    }
  };

  const eyeVariants = {
    happy: { scaleY: 1, y: 0 },
    focused: { scaleY: 0.8, y: 1 },
    worried: { scaleY: 0.9, y: 2 },
    excited: { scaleY: 1.1, y: -1 },
    confident: { scaleY: 1, y: 0 },
    sleepy: { scaleY: 0.6, y: 3 },
    closed: { scaleY: 0.1, y: 3 }
  };

  const mouthVariants = {
    smile: { d: "M 30 45 Q 40 50 50 45", fill: "#8B4513" },
    neutral: { d: "M 35 47 L 45 47", fill: "#8B4513" },
    frown: { d: "M 30 50 Q 40 45 50 50", fill: "#8B4513" },
    bigSmile: { d: "M 25 45 Q 40 55 55 45", fill: "#8B4513" },
    yawn: { d: "M 35 45 Q 40 52 45 45", fill: "#2D1810" }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.div
        animate={shouldBounce ? {
          y: [-2, -8, -2],
          transition: { duration: 0.6, ease: "easeInOut" }
        } : {}}
        className="w-full h-full"
      >
        <motion.svg
          viewBox="0 0 80 80"
          className="w-full h-full drop-shadow-lg"
          animate={mood === 'celebrating' ? {
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.05, 1],
            transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 }
          } : {}}
        >
          {/* Brain Body */}
          <motion.g
            animate={mood === 'thinking' ? {
              rotate: [0, 2, -2, 0],
              transition: { duration: 2, repeat: Infinity }
            } : {}}
          >
            {/* Main brain shape */}
            <path
              d="M 25 20 Q 15 15 15 25 Q 10 30 15 35 Q 12 40 18 45 Q 15 50 25 55 Q 35 60 45 55 Q 55 58 60 50 Q 68 45 62 40 Q 70 35 65 30 Q 72 25 65 20 Q 60 12 50 15 Q 40 10 30 15 Q 25 12 25 20 Z"
              fill="#FF9FB2"
              stroke="#E85A7A"
              strokeWidth="2"
            />
            
            {/* Brain texture lines */}
            <path d="M 20 25 Q 25 22 30 25" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 35 18 Q 40 20 45 18" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 50 22 Q 55 25 58 22" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 22 35 Q 28 33 32 35" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 45 33 Q 50 35 55 33" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 25 45 Q 30 43 35 45" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 45 45 Q 50 43 55 45" fill="none" stroke="#E85A7A" strokeWidth="1.5" opacity="0.6"/>

            {/* Eyes */}
            <motion.ellipse
              cx="32"
              cy="32"
              rx="4"
              ry="5"
              fill="white"
              stroke="#333"
              strokeWidth="1.5"
              animate={eyeVariants[getEyeExpression()]}
            />
            <motion.ellipse
              cx="48"
              cy="32"
              rx="4"
              ry="5"
              fill="white"
              stroke="#333"
              strokeWidth="1.5"
              animate={eyeVariants[getEyeExpression()]}
            />
            
            {/* Pupils */}
            <AnimatePresence>
              {!isBlinking && (
                <>
                  <motion.circle
                    cx="32"
                    cy="33"
                    r="2"
                    fill="#333"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                  <motion.circle
                    cx="48"
                    cy="33"
                    r="2"
                    fill="#333"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                  {/* Eye sparkles */}
                  <circle cx="33" cy="31" r="0.8" fill="white" opacity="0.8"/>
                  <circle cx="49" cy="31" r="0.8" fill="white" opacity="0.8"/>
                </>
              )}
            </AnimatePresence>

            {/* Mouth */}
            <motion.path
              animate={mouthVariants[getMouthExpression()]}
              strokeWidth="2"
              fill="none"
              stroke="#8B4513"
              strokeLinecap="round"
            />

            {/* Headband */}
            <ellipse cx="40" cy="22" rx="20" ry="4" fill="#4A90E2" opacity="0.9"/>
            <ellipse cx="40" cy="20" rx="20" ry="3" fill="#5BA0F2"/>
          </motion.g>

          {/* Arms */}
          <motion.g
            animate={mood === 'celebrating' ? {
              rotate: [0, 10, -10, 0],
              transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1 }
            } : {}}
          >
            {/* Left arm */}
            <ellipse cx="22" cy="42" rx="3" ry="8" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5" transform="rotate(-20 22 42)"/>
            {/* Right arm - holding coin */}
            <ellipse cx="58" cy="42" rx="3" ry="8" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5" transform="rotate(20 58 42)"/>
            
            {/* Hands */}
            <circle cx="18" cy="48" r="4" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5"/>
            <circle cx="62" cy="48" r="4" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5"/>
          </motion.g>

          {/* Legs */}
          <ellipse cx="32" cy="62" rx="3" ry="8" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5"/>
          <ellipse cx="48" cy="62" rx="3" ry="8" fill="#FF9FB2" stroke="#E85A7A" strokeWidth="1.5"/>

          {/* Sneakers */}
          <ellipse cx="32" cy="72" rx="6" ry="4" fill="#4A90E2" stroke="#2E5C8A" strokeWidth="1.5"/>
          <ellipse cx="48" cy="72" rx="6" ry="4" fill="#4A90E2" stroke="#2E5C8A" strokeWidth="1.5"/>
          {/* Shoe details */}
          <ellipse cx="32" cy="71" rx="4" ry="2" fill="#5BA0F2"/>
          <ellipse cx="48" cy="71" rx="4" ry="2" fill="#5BA0F2"/>
          {/* Laces */}
          <line x1="30" y1="69" x2="34" y2="69" stroke="white" strokeWidth="1"/>
          <line x1="46" y1="69" x2="50" y2="69" stroke="white" strokeWidth="1"/>

          {/* Dollar coin (when showing) */}
          <AnimatePresence>
            {showCoin && (
              <motion.g
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 360,
                  y: [0, -2, 0],
                  transition: { 
                    scale: { duration: 0.3 },
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    y: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }
                }}
                exit={{ scale: 0, rotate: 180 }}
                style={{ transformOrigin: "66px 40px" }}
              >
                <circle cx="66" cy="40" r="6" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x="66" y="44" textAnchor="middle" fontSize="8" fill="#B8860B" fontWeight="bold">$</text>
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>
      </motion.div>

      {/* Celebration particles */}
      <AnimatePresence>
        {mood === 'celebrating' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 30}%`,
                  top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 30}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preset mood configurations for easy use
export const SmartieHappy = (props: Omit<SmartieAnimatedProps, 'mood'>) => 
  <SmartieAnimated mood="happy" {...props} />;

export const SmartieThinking = (props: Omit<SmartieAnimatedProps, 'mood'>) => 
  <SmartieAnimated mood="thinking" {...props} />;

export const SmartieCelebrating = (props: Omit<SmartieAnimatedProps, 'mood'>) => 
  <SmartieAnimated mood="celebrating" {...props} />;

export const SmartieConcerned = (props: Omit<SmartieAnimatedProps, 'mood'>) => 
  <SmartieAnimated mood="concerned" {...props} />;

export const SmartieProud = (props: Omit<SmartieAnimatedProps, 'mood'>) => 
  <SmartieAnimated mood="proud" {...props} />;