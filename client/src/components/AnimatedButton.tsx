import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { useButtonAnimation } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  glowOnHover?: boolean;
  scaleOnPress?: boolean;
  shimmer?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, glowOnHover = true, scaleOnPress = true, shimmer = false, ...props }, ref) => {
    const { controls, animatePress, animateHover, animateLeave } = useButtonAnimation();

    return (
      <motion.div
        animate={controls}
        onHoverStart={animateHover}
        onHoverEnd={animateLeave}
        onTapStart={scaleOnPress ? animatePress : undefined}
        className="relative inline-block"
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            glowOnHover && "hover:shadow-lg hover:shadow-purple-500/25",
            shimmer && "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100",
            className
          )}
          {...props}
        >
          {shimmer && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;