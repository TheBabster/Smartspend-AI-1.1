import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernSmartieAvatar from './ModernSmartieAvatar';

interface SmartieLifeAnimationsProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'concerned' | 'proud' | 'sleepy';
  size?: 'sm' | 'md' | 'lg';
  enableIdleAnimations?: boolean;
  floatingEffect?: boolean;
  blinkingEffect?: boolean;
  className?: string;
}

export default function SmartieLifeAnimations({ 
  mood = 'happy', 
  size = 'md',
  enableIdleAnimations = true,
  floatingEffect = true,
  blinkingEffect = true,
  className = '' 
}: SmartieLifeAnimationsProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showThought, setShowThought] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState('breathing');

  // Blinking animation
  useEffect(() => {
    if (!blinkingEffect) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 3000); // Random blink every 3-6 seconds

    return () => clearInterval(blinkInterval);
  }, [blinkingEffect]);

  // Idle animations
  useEffect(() => {
    if (!enableIdleAnimations) return;
    
    const animationInterval = setInterval(() => {
      const animations = ['breathing', 'bounce', 'nod', 'think'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
      setIdleAnimation(randomAnimation);
      
      if (randomAnimation === 'think') {
        setShowThought(true);
        setTimeout(() => setShowThought(false), 2000);
      }
    }, 8000 + Math.random() * 7000); // Random animation every 8-15 seconds

    return () => clearInterval(animationInterval);
  }, [enableIdleAnimations]);

  const getAnimationVariants = () => {
    const variants = {
      breathing: {
        scale: [1, 1.02, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      },
      bounce: {
        y: [0, -5, 0],
        transition: { duration: 0.5, repeat: 3 }
      },
      nod: {
        rotateZ: [0, 2, -2, 0],
        transition: { duration: 1, repeat: 2 }
      },
      think: {
        rotateZ: [0, -5, 5, 0],
        scale: [1, 0.98, 1.02, 1],
        transition: { duration: 2 }
      },
      floating: {
        y: [0, -8, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    };
    return variants;
  };

  const variants = getAnimationVariants();

  return (
    <div className={`relative ${className}`}>
      {/* Main Smartie with animations */}
      <motion.div
        animate={{
          ...enableIdleAnimations ? variants[idleAnimation as keyof typeof variants] : {},
          ...floatingEffect ? variants.floating : {}
        }}
        className="relative"
      >
        {/* Smartie Avatar */}
        <motion.div
          animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: 'center' }}
        >
          <ModernSmartieAvatar mood={mood} size={size} />
        </motion.div>

        {/* Thought bubble when thinking */}
        <AnimatePresence>
          {showThought && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: -30 }}
              exit={{ opacity: 0, scale: 0, y: -20 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-1 h-1 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-1 h-1 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-1 h-1 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
              {/* Bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle effects for celebrating mood */}
        <AnimatePresence>
          {mood === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400 text-xs"
                  style={{
                    left: `${20 + (i % 4) * 20}%`,
                    top: `${20 + Math.floor(i / 4) * 40}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pulse effect for thinking mood */}
        <AnimatePresence>
          {mood === 'thinking' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Glow effect for proud mood */}
        <AnimatePresence>
          {mood === 'proud' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-200 dark:bg-yellow-600 opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Interactive hover effects */}
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
}

// Enhanced version with contextual reactions
interface SmartieContextualAnimationsProps extends SmartieLifeAnimationsProps {
  context?: 'spending' | 'saving' | 'goal_reached' | 'budget_warning' | 'streak_celebration';
  trigger?: boolean;
}

export function SmartieContextualAnimations({ 
  context, 
  trigger = false, 
  ...props 
}: SmartieContextualAnimationsProps) {
  const [showContextEffect, setShowContextEffect] = useState(false);

  useEffect(() => {
    if (trigger && context) {
      setShowContextEffect(true);
      setTimeout(() => setShowContextEffect(false), 3000);
    }
  }, [trigger, context]);

  const getContextMood = () => {
    switch (context) {
      case 'spending': return 'thinking';
      case 'saving': return 'happy';
      case 'goal_reached': return 'celebrating';
      case 'budget_warning': return 'concerned';
      case 'streak_celebration': return 'celebrating';
      default: return props.mood || 'happy';
    }
  };

  const getContextEffect = () => {
    if (!showContextEffect) return null;

    switch (context) {
      case 'goal_reached':
      case 'streak_celebration':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  y: [-20, -60],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1
                }}
              >
                🎉
              </motion.div>
            ))}
          </motion.div>
        );
      
      case 'budget_warning':
        return (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1, repeat: 3 }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <SmartieLifeAnimations {...props} mood={getContextMood()} />
      <AnimatePresence>{getContextEffect()}</AnimatePresence>
    </div>
  );
}