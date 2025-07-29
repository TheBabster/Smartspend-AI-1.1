import React from 'react';
import { motion } from 'framer-motion';

interface NewSmartSpendLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only' | 'text-only';
}

const NewSmartSpendLogo: React.FC<NewSmartSpendLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = "",
  variant = 'full'
}) => {
  // Size mappings for the logo
  const sizeMap = {
    xs: { width: 80, height: 80, textSize: 'text-lg' },
    sm: { width: 120, height: 120, textSize: 'text-xl' },
    md: { width: 160, height: 160, textSize: 'text-2xl' },
    lg: { width: 200, height: 200, textSize: 'text-3xl' },
    xl: { width: 240, height: 240, textSize: 'text-4xl' }
  };

  const { width, height, textSize } = sizeMap[size];

  // Animation variants for sparkle
  const sparkleAnimation = {
    initial: { opacity: 0.5, scale: 0.8 },
    animate: { 
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.2, 0.8],
      rotate: [0, 180, 360]
    },
    transition: { 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Animation for orbital ring
  const orbitalAnimation = {
    animate: { rotate: 360 },
    transition: { 
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  };

  const LogoIcon = () => (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Sparkle - top left */}
      <motion.g
        {...(animated ? sparkleAnimation : {})}
        transform="translate(45, 35)"
      >
        <path
          d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
          fill="url(#sparkleGradient)"
        />
      </motion.g>

      {/* Main head profile - pink */}
      <path
        d="M70 120 C70 110, 75 100, 85 95 L85 85 C85 75, 90 65, 100 60 C110 55, 125 55, 135 60 C145 65, 150 75, 150 85 L150 95 C160 100, 165 110, 165 120 L165 140 C165 150, 160 160, 150 165 L140 170 C135 175, 125 180, 115 180 C105 180, 95 175, 90 170 L80 165 C75 160, 70 150, 70 140 Z"
        fill="#FF6B9D"
        opacity="0.8"
      />

      {/* Brain inside head */}
      <g transform="translate(95, 75)">
        {/* Brain outline - pink gradient */}
        <ellipse cx="20" cy="15" rx="25" ry="20" fill="url(#brainGradient)" />
        
        {/* Brain texture lines */}
        <path
          d="M5 10 Q15 5, 25 10 M8 15 Q18 12, 28 15 M10 20 Q20 18, 30 20"
          stroke="#D946EF"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        
        {/* Brain division line */}
        <path
          d="M20 5 Q20 15, 20 25"
          stroke="#D946EF"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        
        {/* Pound sign in center of brain */}
        <g transform="translate(15, 10)">
          <rect x="6" y="4" width="2" height="12" fill="#F59E0B" />
          <rect x="2" y="7" width="10" height="2" fill="#F59E0B" />
          <rect x="2" y="11" width="10" height="2" fill="#F59E0B" />
        </g>
      </g>

      {/* Orbital ring around head */}
      <motion.ellipse
        cx="117"
        cy="120"
        rx="65"
        ry="45"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="6"
        strokeLinecap="round"
        transform="rotate(-15 117 120)"
        {...(animated ? orbitalAnimation : {})}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
    </motion.svg>
  );

  const LogoText = () => (
    <motion.div
      className="text-center"
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={`font-bold text-[#1E3A8A] ${textSize} leading-tight tracking-tight`}>
        SmartSpend
      </div>
      <div className={`font-medium text-[#1E3A8A] ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'} mt-1 tracking-wide`}>
        Think Smart. Spend Smarter.
      </div>
    </motion.div>
  );

  // Render based on variant
  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  if (variant === 'text-only') {
    return <LogoText />;
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  );
};

export default NewSmartSpendLogo;