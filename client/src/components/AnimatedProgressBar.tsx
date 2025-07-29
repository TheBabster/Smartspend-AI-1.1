import { useEffect } from "react";
import { motion } from "framer-motion";
import { useProgressAnimation } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  percentage: number;
  color?: 'green' | 'yellow' | 'red' | 'purple' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  animated?: boolean;
  className?: string;
}

export default function AnimatedProgressBar({
  percentage,
  color = 'purple',
  size = 'md',
  showGlow = true,
  animated = true,
  className
}: AnimatedProgressBarProps) {
  const { controls, animateProgress } = useProgressAnimation();

  useEffect(() => {
    if (animated) {
      animateProgress(percentage);
    }
  }, [percentage, animated, animateProgress]);

  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    blue: 'bg-blue-500'
  };

  const glowClasses = {
    green: 'shadow-green-500/50',
    yellow: 'shadow-yellow-500/50',
    red: 'shadow-red-500/50',
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", sizeClasses[size], className)}>
      <motion.div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          colorClasses[color],
          showGlow && `shadow-lg ${glowClasses[color]}`
        )}
        animate={animated ? controls : {}}
        initial={animated ? { width: 0 } : { width: `${percentage}%` }}
        style={!animated ? { width: `${percentage}%` } : {}}
      >
        {/* Shimmer effect */}
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
        />
      </motion.div>
    </div>
  );
}