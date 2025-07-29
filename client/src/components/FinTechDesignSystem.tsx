import React from 'react';
import { motion } from 'framer-motion';

// 10/10 FinTech Design System - Professional Grade
export const FinTechDesign = {
  // Clean, professional color palette
  colors: {
    background: {
      primary: "bg-slate-50", // Soft, professional base
      secondary: "bg-white",
      card: "bg-white/80 backdrop-blur-sm",
      gradient: "bg-gradient-to-br from-slate-50 to-blue-50/30"
    },
    text: {
      primary: "text-slate-900", // High contrast for readability
      secondary: "text-slate-600",
      muted: "text-slate-500",
      accent: "text-blue-600"
    },
    borders: {
      light: "border-slate-200/60",
      medium: "border-slate-300/40",
      accent: "border-blue-200/60"
    },
    status: {
      success: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        accent: "bg-emerald-500"
      },
      warning: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        accent: "bg-amber-500"
      },
      danger: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        accent: "bg-rose-500"
      },
      info: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        accent: "bg-blue-500"
      }
    }
  },

  // Professional typography scale
  typography: {
    display: "text-4xl font-bold tracking-tight text-slate-900", // 36px
    h1: "text-3xl font-bold tracking-tight text-slate-900", // 30px
    h2: "text-2xl font-semibold tracking-tight text-slate-900", // 24px
    h3: "text-xl font-semibold text-slate-900", // 20px
    h4: "text-lg font-semibold text-slate-900", // 18px
    body: "text-base text-slate-600 leading-relaxed", // 16px
    bodySmall: "text-sm text-slate-600 leading-relaxed", // 14px
    caption: "text-xs text-slate-500 leading-relaxed", // 12px
    label: "text-sm font-medium text-slate-700",
    number: "text-base font-semibold tabular-nums text-slate-900"
  },

  // Consistent spacing system (8px base)
  spacing: {
    xs: "space-y-2", // 8px
    sm: "space-y-3", // 12px
    md: "space-y-4", // 16px
    lg: "space-y-6", // 24px
    xl: "space-y-8", // 32px
    xxl: "space-y-12" // 48px
  },

  // Professional card patterns
  cards: {
    primary: "bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    elevated: "bg-white border border-slate-200/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
    interactive: "bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
    status: {
      success: "bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-xl shadow-sm",
      warning: "bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-xl shadow-sm",
      danger: "bg-rose-50/80 backdrop-blur-sm border border-rose-200/60 rounded-xl shadow-sm",
      info: "bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-sm"
    }
  },

  // Professional button system
  buttons: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium py-2 px-4 rounded-lg transition-all duration-200",
    danger: "bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
  },

  // Micro-interaction animations
  animations: {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, ease: "easeOut" }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    bounce: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    pulseSuccess: {
      animate: { 
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(34, 197, 94, 0)",
          "0 0 0 10px rgba(34, 197, 94, 0.1)",
          "0 0 0 20px rgba(34, 197, 94, 0)"
        ]
      },
      transition: { duration: 1, ease: "easeOut" }
    }
  },

  // Professional input styling
  inputs: {
    base: "bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200",
    error: "bg-white border border-rose-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
  },

  // Status badges
  badges: {
    success: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800",
    warning: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800",
    danger: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800",
    info: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
    neutral: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
  }
};

// Professional layout wrapper
interface FinTechLayoutProps {
  children: React.ReactNode;
  variant?: 'page' | 'card' | 'section';
  className?: string;
}

export const FinTechLayout: React.FC<FinTechLayoutProps> = ({
  children,
  variant = 'page',
  className = ""
}) => {
  const getLayoutStyles = () => {
    switch (variant) {
      case 'page':
        return `min-h-screen ${FinTechDesign.colors.background.gradient}`;
      case 'card':
        return FinTechDesign.cards.primary;
      case 'section':
        return "space-y-6";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`${getLayoutStyles()} ${className}`}
      {...FinTechDesign.animations.fadeInUp}
    >
      {children}
    </motion.div>
  );
};

// Professional text components
export const FinTechText = {
  Display: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h1 className={`${FinTechDesign.typography.display} ${className}`}>
      {children}
    </h1>
  ),
  
  H1: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h1 className={`${FinTechDesign.typography.h1} ${className}`}>
      {children}
    </h1>
  ),
  
  H2: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`${FinTechDesign.typography.h2} ${className}`}>
      {children}
    </h2>
  ),
  
  H3: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`${FinTechDesign.typography.h3} ${className}`}>
      {children}
    </h3>
  ),
  
  Body: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <p className={`${FinTechDesign.typography.body} ${className}`}>
      {children}
    </p>
  ),
  
  BodySmall: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <p className={`${FinTechDesign.typography.bodySmall} ${className}`}>
      {children}
    </p>
  ),
  
  Caption: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <span className={`${FinTechDesign.typography.caption} ${className}`}>
      {children}
    </span>
  ),
  
  Number: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <span className={`${FinTechDesign.typography.number} ${className}`}>
      {children}
    </span>
  )
};

// Professional button component
interface FinTechButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const FinTechButton: React.FC<FinTechButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = "",
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <motion.button
      className={`${FinTechDesign.buttons[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      {...FinTechDesign.animations.bounce}
    >
      {children}
    </motion.button>
  );
};

// Professional progress component
interface FinTechProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const FinTechProgress: React.FC<FinTechProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500'
  };

  return (
    <motion.div className="w-full" {...FinTechDesign.animations.fadeInUp}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={FinTechDesign.typography.label}>{label}</span>
          <span className={FinTechDesign.typography.number}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <motion.div
          className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

// Professional badge component
interface FinTechBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const FinTechBadge: React.FC<FinTechBadgeProps> = ({
  children,
  variant = 'neutral',
  className = ""
}) => {
  return (
    <span className={`${FinTechDesign.badges[variant]} ${className}`}>
      {children}
    </span>
  );
};