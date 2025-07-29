import React from 'react';
import { motion } from 'framer-motion';

// Consistent design tokens for 10/10 brand identity
export const SmartSpendBrand = {
  // Typography scale with emotional warmth
  typography: {
    hero: "text-4xl md:text-5xl font-bold leading-tight tracking-tight",
    heading: "text-2xl md:text-3xl font-bold leading-tight",
    subheading: "text-xl font-semibold leading-relaxed",
    body: "text-base leading-relaxed",
    caption: "text-sm leading-relaxed",
    micro: "text-xs leading-relaxed"
  },

  // Color palette for emotional connection
  colors: {
    primary: {
      gradient: "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500",
      text: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    success: {
      gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    warning: {
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
      text: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200"
    },
    danger: {
      gradient: "bg-gradient-to-r from-red-500 to-pink-500",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    neutral: {
      gradient: "bg-gradient-to-r from-gray-400 to-gray-600",
      text: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200"
    }
  },

  // Spacing system for consistent rhythm
  spacing: {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12"
  },

  // Animation presets for brand personality
  animations: {
    gentle: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    bounce: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    float: {
      animate: { y: [0, -8, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    glow: {
      animate: { 
        boxShadow: [
          "0 0 20px rgba(147, 51, 234, 0.1)",
          "0 0 30px rgba(147, 51, 234, 0.3)",
          "0 0 20px rgba(147, 51, 234, 0.1)"
        ]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },

  // Component styling for consistency
  components: {
    card: "bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
    button: {
      primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
      secondary: "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
      ghost: "text-gray-600 hover:text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200"
    },
    input: "bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200",
    badge: {
      success: "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium",
      warning: "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium",
      danger: "bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium",
      info: "bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
    }
  }
};

// Branded layout wrapper
interface BrandedLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'card' | 'minimal';
  className?: string;
}

export const BrandedLayout: React.FC<BrandedLayoutProps> = ({
  children,
  variant = 'default',
  className = ""
}) => {
  const getLayoutStyles = () => {
    switch (variant) {
      case 'hero':
        return "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden";
      case 'card':
        return "bg-white/60 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl";
      case 'minimal':
        return "bg-gray-50/50";
      default:
        return "bg-gradient-to-br from-gray-50 to-white";
    }
  };

  return (
    <motion.div
      className={`${getLayoutStyles()} ${className}`}
      {...SmartSpendBrand.animations.gentle}
    >
      {variant === 'hero' && (
        <>
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}
      {children}
    </motion.div>
  );
};

// Branded text components
export const BrandedText = {
  Hero: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.h1 
      className={`${SmartSpendBrand.typography.hero} bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent ${className}`}
      {...SmartSpendBrand.animations.gentle}
    >
      {children}
    </motion.h1>
  ),
  
  Heading: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.h2 
      className={`${SmartSpendBrand.typography.heading} text-gray-800 ${className}`}
      {...SmartSpendBrand.animations.gentle}
    >
      {children}
    </motion.h2>
  ),
  
  Body: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.p 
      className={`${SmartSpendBrand.typography.body} text-gray-600 ${className}`}
      {...SmartSpendBrand.animations.gentle}
    >
      {children}
    </motion.p>
  ),
  
  Caption: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.span 
      className={`${SmartSpendBrand.typography.caption} text-gray-500 ${className}`}
      {...SmartSpendBrand.animations.gentle}
    >
      {children}
    </motion.span>
  )
};

// Branded button component
interface BrandedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const BrandedButton: React.FC<BrandedButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = "",
  disabled = false
}) => {
  return (
    <motion.button
      className={`${SmartSpendBrand.components.button[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      {...SmartSpendBrand.animations.bounce}
    >
      {children}
    </motion.button>
  );
};

// Progress indicator with brand styling
interface BrandedProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
}

export const BrandedProgress: React.FC<BrandedProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    primary: 'from-purple-500 to-pink-500',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-pink-500'
  };

  return (
    <motion.div className="w-full" {...SmartSpendBrand.animations.gentle}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={SmartSpendBrand.typography.caption}>{label}</span>
          <span className={`${SmartSpendBrand.typography.caption} font-semibold`}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r ${colorClasses[color]} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};