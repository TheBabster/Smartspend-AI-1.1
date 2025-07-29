import React from "react";
import { motion } from "framer-motion";

interface BrandNewSmartSpendLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showText?: boolean;
  variant?: "default" | "coin-brain" | "lightbulb" | "tree";
}

const BrandNewSmartSpendLogo: React.FC<BrandNewSmartSpendLogoProps> = ({
  size = "md",
  animated = true,
  showText = true,
  variant = "coin-brain"
}) => {
  const sizeConfig = {
    sm: { 
      container: "w-8 h-8", 
      text: "text-xs", 
      icon: "w-6 h-6" 
    },
    md: { 
      container: "w-12 h-12", 
      text: "text-sm", 
      icon: "w-10 h-10" 
    },
    lg: { 
      container: "w-16 h-16", 
      text: "text-lg", 
      icon: "w-14 h-14" 
    },
    xl: { 
      container: "w-24 h-24", 
      text: "text-2xl", 
      icon: "w-20 h-20" 
    }
  };

  const config = sizeConfig[size];

  const CoinBrainLogo = () => (
    <motion.div
      className={`relative ${config.container} flex items-center justify-center`}
      animate={animated ? {
        rotate: [0, 2, -2, 0],
        scale: [1, 1.02, 1]
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Outer Coin Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 shadow-lg"
        style={{
          background: "conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #fbbf24)",
        }}
        animate={animated ? {
          rotate: [0, 360]
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner Coin Base */}
      <div 
        className="absolute inset-1 rounded-full shadow-inner"
        style={{
          background: "radial-gradient(circle at 30% 30%, #fde047, #facc15, #eab308)"
        }}
      />
      
      {/* Brain Design */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-orange-800"
        animate={animated ? {
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Brain Top */}
        <div className="relative">
          <motion.div
            className="text-lg font-black leading-none"
            style={{ 
              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
              fontSize: size === "sm" ? "0.6rem" : size === "md" ? "0.8rem" : size === "lg" ? "1rem" : "1.2rem"
            }}
            animate={animated ? {
              textShadow: [
                "0 1px 1px rgba(0,0,0,0.3)",
                "0 2px 2px rgba(0,0,0,0.4)",
                "0 1px 1px rgba(0,0,0,0.3)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.div>
          
          {/* Sparkle Effects */}
          {animated && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-300"
                style={{ fontSize: size === "sm" ? "0.4rem" : "0.5rem" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 text-green-400"
                style={{ fontSize: size === "sm" ? "0.3rem" : "0.4rem" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
              >
                💰
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
      
      {/* Coin Edge Highlights */}
      <div className="absolute inset-0 rounded-full">
        <div 
          className="absolute top-1 left-1/4 w-2 h-1 bg-yellow-200 rounded-full opacity-60"
          style={{ 
            width: size === "sm" ? "4px" : size === "md" ? "6px" : "8px",
            height: size === "sm" ? "2px" : size === "md" ? "3px" : "4px"
          }}
        />
        <div 
          className="absolute bottom-1 right-1/4 w-1 h-2 bg-yellow-200 rounded-full opacity-40"
          style={{ 
            width: size === "sm" ? "2px" : size === "md" ? "3px" : "4px",
            height: size === "sm" ? "4px" : size === "md" ? "6px" : "8px"
          }}
        />
      </div>
    </motion.div>
  );

  const LightbulbLogo = () => (
    <motion.div
      className={`relative ${config.container} flex items-center justify-center`}
      animate={animated ? {
        scale: [1, 1.05, 1]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Lightbulb Body */}
      <div 
        className="absolute inset-0 rounded-t-full"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fde047, #facc15)",
          borderBottom: "2px solid #d97706"
        }}
      />
      
      {/* Dollar Sign */}
      <motion.div
        className="relative z-10 font-black text-green-700"
        style={{ 
          fontSize: size === "sm" ? "0.8rem" : size === "md" ? "1.2rem" : size === "lg" ? "1.6rem" : "2rem"
        }}
        animate={animated ? {
          color: ["#15803d", "#059669", "#047857", "#15803d"]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        $
      </motion.div>
      
      {/* Light Rays */}
      {animated && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-yellow-400 rounded-full"
              style={{
                height: size === "sm" ? "8px" : size === "md" ? "12px" : "16px",
                top: "10%",
                left: "50%",
                transformOrigin: `0 ${size === "sm" ? "16px" : size === "md" ? "24px" : "32px"}`,
                transform: `rotate(${i * 60}deg)`
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );

  const TreeLogo = () => (
    <motion.div
      className={`relative ${config.container} flex items-center justify-center`}
      animate={animated ? {
        y: [0, -2, 0]
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Tree Crown */}
      <div 
        className="absolute top-0 w-full h-3/4 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #22c55e, #16a34a, #15803d)"
        }}
      />
      
      {/* Tree Trunk */}
      <div 
        className="absolute bottom-0 w-1/4 h-1/3 mx-auto"
        style={{
          background: "linear-gradient(to bottom, #92400e, #78350f)",
          left: "37.5%"
        }}
      />
      
      {/* Coins as Fruits */}
      {animated && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 font-bold"
              style={{
                fontSize: size === "sm" ? "0.4rem" : "0.6rem",
                top: `${30 + i * 15}%`,
                left: `${25 + i * 20}%`
              }}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              🪙
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );

  const renderLogo = () => {
    switch (variant) {
      case "coin-brain":
        return <CoinBrainLogo />;
      case "lightbulb":
        return <LightbulbLogo />;
      case "tree":
        return <TreeLogo />;
      default:
        return <CoinBrainLogo />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {renderLogo()}
      
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span 
            className={`font-black text-high-contrast leading-tight ${config.text}`}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            SmartSpend
          </span>
          {size !== "sm" && (
            <span 
              className="text-xs text-medium-contrast font-medium leading-none"
              style={{ marginTop: "-2px" }}
            >
              Think Smart. Spend Smarter.
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BrandNewSmartSpendLogo;