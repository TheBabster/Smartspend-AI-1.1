import React from 'react';
import { motion, Variants } from 'framer-motion';

// Slide-in animation variants for different directions
export const slideVariants: Variants = {
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  },
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 }
  },
  slideInTop: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  },
  slideInBottom: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 }
  },
  fadeSlideUp: {
    initial: { y: 30, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 30, opacity: 0, scale: 0.95 }
  },
  staggerFadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  }
};

// Container variants for staggered animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Enhanced button animation variants
export const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05, 
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  loading: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Sparkle animation for celebrations
export const sparkleVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: 0 },
  visible: {
    scale: [0, 1.2, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: { 
      duration: 2,
      ease: "easeOut"
    }
  }
};

// Progress bar animation
export const progressVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { 
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

// Floating animation for idle elements
export const floatingVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Typing animation for text
export const typingVariants: Variants = {
  hidden: { width: 0 },
  visible: {
    width: "auto",
    transition: {
      duration: 2,
      ease: "linear"
    }
  }
};

// Bounce animation for notifications
export const bounceVariants: Variants = {
  bounce: {
    y: [0, -20, 0, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Pulse animation for attention-grabbing elements
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shake animation for errors
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5
    }
  }
};

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

// Card hover animations
export const cardVariants: Variants = {
  idle: { 
    scale: 1, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
  },
  hover: { 
    scale: 1.02, 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Slide Animation Components
interface SlideAnimationProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideAnimation({ 
  children, 
  direction = 'bottom', 
  delay = 0, 
  duration = 0.5,
  className = '' 
}: SlideAnimationProps) {
  const getVariant = () => {
    switch (direction) {
      case 'left': return 'slideInLeft';
      case 'right': return 'slideInRight';
      case 'top': return 'slideInTop';
      case 'bottom': return 'slideInBottom';
      case 'fade': return 'fadeSlideUp';
      default: return 'slideInBottom';
    }
  };

  return (
    <motion.div
      className={className}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={getVariant()}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// Enhanced button with multiple animation states
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  className = '' 
}: AnimatedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white';
      default:
        return 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white';
    }
  };

  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${getVariantClasses()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      animate={loading ? "loading" : "idle"}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}

// Floating element animation
interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: 'gentle' | 'medium' | 'strong';
  className?: string;
}

export function FloatingElement({ 
  children, 
  intensity = 'gentle', 
  className = '' 
}: FloatingElementProps) {
  const getIntensity = () => {
    switch (intensity) {
      case 'gentle': return [-5, 5];
      case 'medium': return [-10, 10];
      case 'strong': return [-15, 15];
      default: return [-5, 5];
    }
  };

  return (
    <motion.div
      className={className}
      animate={{
        y: getIntensity(),
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Sparkle effect for celebrations
interface SparkleEffectProps {
  active: boolean;
  count?: number;
  className?: string;
}

export function SparkleEffect({ active, count = 8, className = '' }: SparkleEffectProps) {
  if (!active) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400 text-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: i * 0.1 }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}