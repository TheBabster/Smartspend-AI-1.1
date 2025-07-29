import React from "react";
import { motion } from "framer-motion";

// Enhanced Background Component with Rich Gradients
export const RichGradientBackground: React.FC<{
  category?: "bills" | "food" | "entertainment" | "transport" | "shopping" | "default";
  children: React.ReactNode;
  className?: string;
}> = ({ category = "default", children, className = "" }) => {
  const gradients = {
    bills: "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-800/20",
    food: "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-800/20",
    entertainment: "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-800/20",
    transport: "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-800/20",
    shopping: "bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-rose-800/20",
    default: "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-gray-800/20"
  };

  return (
    <div className={`${gradients[category]} ${className}`}>
      {children}
    </div>
  );
};

// Advanced Animation Wrapper
export const AdvancedAnimationWrapper: React.FC<{
  children: React.ReactNode;
  type?: "float" | "pulse" | "bounce" | "slide" | "scale";
  delay?: number;
}> = ({ children, type = "float", delay = 0 }) => {
  const animations = {
    float: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut",
        delay
      }
    },
    slide: {
      x: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    },
    scale: {
      scale: [1, 1.05, 1],
      rotate: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }
  };

  return (
    <motion.div animate={animations[type]}>
      {children}
    </motion.div>
  );
};

// Sparkle Effect Component
export const SparkleEffect: React.FC<{
  count?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
}> = ({ count = 6, size = "md", color = "text-yellow-400" }) => {
  const sparkleSize = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-lg"
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${color} ${sparkleSize[size]} pointer-events-none`}
          style={{
            left: `${10 + (i * 15)}%`,
            top: `${5 + (i % 3) * 30}%`,
            zIndex: 10
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
    </>
  );
};

// Glassmorphism Card Component
export const GlassmorphismCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "strong";
}> = ({ children, className = "", intensity = "medium" }) => {
  const intensities = {
    light: "bg-white/10 backdrop-blur-sm border border-white/20",
    medium: "bg-white/20 backdrop-blur-md border border-white/30", 
    strong: "bg-white/30 backdrop-blur-lg border border-white/40"
  };

  return (
    <div className={`${intensities[intensity]} rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

// Progress Bar with Smooth Animation
export const SmoothProgressBar: React.FC<{
  percentage: number;
  height?: string;
  gradient?: string;
  showPercentage?: boolean;
}> = ({ 
  percentage, 
  height = "h-3", 
  gradient = "from-purple-500 to-pink-500",
  showPercentage = false 
}) => {
  return (
    <div className="relative">
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} bg-gradient-to-r ${gradient} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
      {showPercentage && (
        <motion.span
          className="absolute top-0 right-0 -mt-6 text-xs font-medium text-medium-contrast"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
      )}
    </div>
  );
};

// Confetti Celebration Component
export const ConfettiCelebration: React.FC<{
  trigger: boolean;
  duration?: number;
}> = ({ trigger, duration = 3000 }) => {
  if (!trigger) return null;

  const confettiPieces = 20;
  const colors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-pink-500"];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(confettiPieces)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${colors[i % colors.length]} text-lg font-bold`}
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10%"
          }}
          initial={{ 
            y: 0, 
            rotate: 0, 
            opacity: 1 
          }}
          animate={{ 
            y: window.innerHeight + 100,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: 0
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
            delay: i * 0.1
          }}
        >
          {["🎉", "🎊", "✨", "🌟", "💫"][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );
};

// Button Hover Effects
export const EnhancedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning";
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white",
    warning: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        px-6 py-3 rounded-xl font-semibold shadow-lg
        transition-all duration-200 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: 1.02, 
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)" 
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
};

// Background Pattern Component
export const BackgroundPattern: React.FC<{
  pattern?: "dots" | "waves" | "grid" | "circles";
  opacity?: number;
}> = ({ pattern = "dots", opacity = 0.1 }) => {
  const patterns = {
    dots: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0">
        <circle cx="30" cy="30" r="2" fill="currentColor" />
      </svg>
    ),
    waves: (
      <svg width="100" height="20" viewBox="0 0 100 20" className="absolute inset-0">
        <path d="M0 10 Q25 0 50 10 Q75 20 100 10" stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    ),
    grid: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="absolute inset-0">
        <path d="M0 0H40V40H0V0Z" stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    ),
    circles: (
      <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
        <circle cx="40" cy="40" r="20" stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    )
  };

  return (
    <div 
      className="absolute inset-0 text-gray-500 dark:text-gray-400"
      style={{ 
        opacity,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(patterns[pattern].props.children)}")`,
        backgroundRepeat: "repeat"
      }}
    />
  );
};