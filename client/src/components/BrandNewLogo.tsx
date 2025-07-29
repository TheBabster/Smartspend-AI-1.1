import { motion } from "framer-motion";

interface BrandNewLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showText?: boolean;
}

export default function BrandNewLogo({ size = "md", animated = true, showText = true }: BrandNewLogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-sm" },
    md: { container: "w-12 h-12", text: "text-base" },
    lg: { container: "w-16 h-16", text: "text-lg" },
    xl: { container: "w-20 h-20", text: "text-xl" }
  };

  const currentSize = sizes[size];

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        delay: 0.1
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const coinVariants = {
    initial: { y: -10, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.3, duration: 0.5 }
    },
    float: {
      y: [-2, 2, -2],
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  const brainVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.4 }
    },
    think: {
      scale: [1, 1.05, 1],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className={`flex items-center gap-3 ${showText ? '' : 'justify-center'}`}>
      {/* Logo Icon */}
      <motion.div
        className={`relative ${currentSize.container} flex items-center justify-center`}
        variants={logoVariants}
        initial={animated ? "initial" : "animate"}
        animate={animated ? "animate" : "animate"}
        whileHover={animated ? "hover" : undefined}
      >
        {/* Circular Background with Gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-20 blur-sm" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-90" />
        
        {/* Brain Icon */}
        <motion.div
          className="relative z-10"
          variants={brainVariants}
          initial={animated ? "initial" : "animate"}
          animate={animated ? ["animate", "think"] : "animate"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/5 h-3/5 text-white"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Simplified brain shape */}
            <path d="M9.5 2C7.5 2 6 3.5 6 5.5c0 .8.3 1.5.7 2.1C5.8 8.2 5 9.5 5 11c0 1.9 1.3 3.5 3 3.9v1.6c0 2.2 1.8 4 4 4s4-1.8 4-4v-1.6c1.7-.4 3-2 3-3.9 0-1.5-.8-2.8-1.7-3.4.4-.6.7-1.3.7-2.1 0-2-1.5-3.5-3.5-3.5-1 0-1.9.4-2.5 1-.6-.6-1.5-1-2.5-1z"/>
            {/* Brain pattern lines */}
            <path d="M8 7.5c.5-.5 1.2-.8 2-.8"/>
            <path d="M14 6.7c.8 0 1.5.3 2 .8"/>
            <path d="M9 10.5h2"/>
            <path d="M13 10.5h2"/>
          </svg>
        </motion.div>

        {/* Floating Coin */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border border-yellow-600 shadow-sm"
          variants={coinVariants}
          initial={animated ? "initial" : "animate"}
          animate={animated ? ["animate", "float"] : "animate"}
        >
          {/* Coin symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-yellow-800 text-xs font-bold">£</span>
          </div>
        </motion.div>

        {/* Sparkle Effects */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-2 left-1 w-1 h-1 bg-yellow-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </>
        )}
      </motion.div>

      {/* Brand Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={animated ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <span className={`font-bold ${currentSize.text} bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            SmartSpend
          </span>
          {size === "lg" || size === "xl" ? (
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Smart Decisions, Bright Future
            </span>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}