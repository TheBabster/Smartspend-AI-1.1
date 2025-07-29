import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Button bounce animation
export const BounceButton = motion.button;

export const bounceVariants: Variants = {
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

// Card hover lift animation
export const LiftCard = motion.div;

export const liftVariants: Variants = {
  initial: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { 
    y: -2, 
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  }
};

// Shimmer loading animation
interface ShimmerProps {
  children: ReactNode;
  className?: string;
}

export function Shimmer({ children, className = "" }: ShimmerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: [-100, 300] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

// Pulse glow animation for important elements
interface PulseGlowProps {
  children: ReactNode;
  color?: "purple" | "green" | "yellow" | "red" | "blue";
  intensity?: "low" | "medium" | "high";
}

export function PulseGlow({ children, color = "purple", intensity = "medium" }: PulseGlowProps) {
  const colorClasses = {
    purple: "shadow-purple-500/30",
    green: "shadow-green-500/30", 
    yellow: "shadow-yellow-500/30",
    red: "shadow-red-500/30",
    blue: "shadow-blue-500/30"
  };

  const intensityValues = {
    low: [0, 5, 0],
    medium: [0, 10, 0],
    high: [0, 20, 0]
  };

  return (
    <motion.div
      className={`${colorClasses[color]}`}
      animate={{
        boxShadow: intensityValues[intensity].map(val => 
          `0 0 ${val}px ${colorClasses[color].split('/')[0].replace('shadow-', 'rgb(')}`
        )
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Number counting animation
interface CountUpProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({ from, to, duration = 1, prefix = "", suffix = "", className = "" }: CountUpProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ textContent: from.toString() }}
        animate={{ textContent: to.toString() }}
        transition={{ 
          duration,
          ease: "easeOut",
          onUpdate: (latest) => {
            // This would need a custom implementation for actual counting
            // For now, we'll use a simpler approach
          }
        }}
      >
        {prefix}{to}{suffix}
      </motion.span>
    </motion.span>
  );
}

// Stagger animation for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Progress bar fill animation
interface AnimatedProgressFillProps {
  percentage: number;
  color?: string;
  height?: string;
  className?: string;
}

export function AnimatedProgressFill({ 
  percentage, 
  color = "bg-purple-500", 
  height = "h-2",
  className = ""
}: AnimatedProgressFillProps) {
  return (
    <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`${height} ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

// Floating elements animation
export const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Success checkmark animation
export function SuccessCheckmark({ size = 24, color = "text-green-500" }: { size?: number; color?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={color}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.2
      }}
    >
      <motion.path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
    </motion.svg>
  );
}