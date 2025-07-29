import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedBudgetRingProps {
  percentage: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showConfetti?: boolean;
}

export default function EnhancedBudgetRing({ 
  percentage, 
  className, 
  size = "md",
  showConfetti = false 
}: EnhancedBudgetRingProps) {
  // Cap percentage at 100 and ensure it's positive
  const cappedPercentage = Math.max(0, Math.min(100, percentage));
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = `${(cappedPercentage / 100) * circumference} ${circumference}`;
  
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20", 
    lg: "w-24 h-24"
  };

  const getColor = () => {
    if (cappedPercentage >= 70) return "#10b981"; // green
    if (cappedPercentage >= 30) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getEmoji = () => {
    if (cappedPercentage >= 80) return "😌";
    if (cappedPercentage >= 60) return "🙂";
    if (cappedPercentage >= 40) return "😐";
    if (cappedPercentage >= 20) return "😟";
    return "😰";
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90 w-full h-full"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor()}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
          initial={{ strokeDasharray: "0 283" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            filter: cappedPercentage >= 70 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' : 
                   cappedPercentage >= 30 ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))' :
                   'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            scale: showConfetti ? [1, 1.2, 1] : [1, 1.05, 1],
          }}
          transition={{ 
            duration: showConfetti ? 0.6 : 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-lg"
        >
          {getEmoji()}
        </motion.div>
        <motion.div 
          className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {cappedPercentage.toFixed(0)}%
        </motion.div>
      </div>
      
      {/* Confetti effect for achievements */}
      {showConfetti && cappedPercentage >= 80 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                opacity: [1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}