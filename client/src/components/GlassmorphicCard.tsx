import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
  gradient?: 'purple' | 'blue' | 'green' | 'pink' | 'orange';
  glow?: boolean;
  hover?: boolean;
}

const GlassmorphicCard = forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ className, children, blur = 'md', gradient = 'purple', glow = false, hover = true }, ref) => {
    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md', 
      lg: 'backdrop-blur-lg'
    };

    const gradientClasses = {
      purple: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-600/10',
      blue: 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-600/10',
      green: 'bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-600/10',
      pink: 'bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-pink-600/10',
      orange: 'bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-600/10'
    };

    const glowClasses = {
      purple: 'shadow-purple-500/20',
      blue: 'shadow-blue-500/20',
      green: 'shadow-green-500/20',
      pink: 'shadow-pink-500/20',
      orange: 'shadow-orange-500/20'
    };

    return (
      <motion.div
        whileHover={hover ? { 
          scale: 1.02, 
          y: -4,
          transition: { duration: 0.2, type: "spring", stiffness: 300 }
        } : {}}
        whileTap={{ scale: 0.98 }}
        className="group"
      >
        <Card
          ref={ref}
          className={cn(
            "relative overflow-hidden border border-white/20 dark:border-white/10",
            blurClasses[blur],
            gradientClasses[gradient],
            glow && `shadow-2xl ${glowClasses[gradient]}`,
            "transition-all duration-300",
            className
          )}
        >
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
      </motion.div>
    );
  }
);

GlassmorphicCard.displayName = "GlassmorphicCard";

export default GlassmorphicCard;