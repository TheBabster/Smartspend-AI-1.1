import React from 'react';
import { motion } from 'framer-motion';

interface ExactSmartSpendLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const ExactSmartSpendLogo: React.FC<ExactSmartSpendLogoProps> = ({
  size = 'md',
  animated = false,
  showText = true,
  className = ""
}) => {
  const sizeMap = {
    sm: { width: 120, height: 120 },
    md: { width: 160, height: 160 },
    lg: { width: 200, height: 200 },
    xl: { width: 240, height: 240 }
  };

  const dimensions = sizeMap[size];

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Exact copy of your logo */}
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Orange sparkle/star in top-left - more defined */}
        <motion.g
          transform="translate(90, 70)"
          initial={animated ? { opacity: 0, scale: 0.5 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <path
            d="M0 -20 L6 -6 L20 0 L6 6 L0 20 L-6 6 L-20 0 L-6 -6 Z"
            fill="url(#sparkleGradient)"
          />
          <circle cx="0" cy="0" r="4" fill="#FFF3CD" opacity="0.8" />
        </motion.g>

        {/* Pink head profile - clean and crisp */}
        <motion.path
          d="M140 240 
             C140 220, 150 200, 170 190 
             L170 170 
             C170 150, 180 130, 200 120 
             C220 110, 250 110, 270 120 
             C290 130, 300 150, 300 170 
             L300 190 
             C320 200, 330 220, 330 240 
             L330 280 
             C330 300, 320 320, 300 330 
             L280 340 
             C270 350, 250 360, 230 360 
             C210 360, 190 350, 180 340 
             L160 330 
             C150 320, 140 300, 140 280 
             Z"
          fill="url(#headGradient)"
          stroke="#E75895"
          strokeWidth="2"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.8 }}
        />

        {/* Brain inside the head - exact pink brain with folds */}
        <motion.g
          transform="translate(190, 150)"
          initial={animated ? { scale: 0.3, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Main brain shape with enhanced gradient */}
          <ellipse cx="40" cy="30" rx="50" ry="40" fill="url(#brainGradient)" stroke="#C967A3" strokeWidth="1.5" />
          
          {/* Brain hemisphere division */}
          <path
            d="M40 -10 Q40 10, 40 30 Q40 50, 40 70"
            stroke="#C967A3"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Brain fold lines - left hemisphere */}
          <path
            d="M10 20 Q20 10, 30 20 Q35 25, 35 30"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M15 35 Q25 25, 35 35 Q38 40, 38 45"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M20 50 Q30 40, 35 50 Q38 55, 38 60"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          
          {/* Brain fold lines - right hemisphere */}
          <path
            d="M70 20 Q60 10, 50 20 Q45 25, 45 30"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M65 35 Q55 25, 45 35 Q42 40, 42 45"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M60 50 Q50 40, 45 50 Q42 55, 42 60"
            stroke="#C967A3"
            strokeWidth="2.5"
            fill="none"
          />
          
          {/* Yellow pound sterling symbol in center */}
          <motion.text
            x="40"
            y="35"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            fontWeight="bold"
            fill="#F4B942"
            fontFamily="Arial, sans-serif"
            initial={animated ? { opacity: 0, scale: 0 } : {}}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            £
          </motion.text>
        </motion.g>

        {/* Dark blue orbital ring - enhanced with gradient */}
        <motion.ellipse
          cx="235"
          cy="240"
          rx="130"
          ry="90"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          transform="rotate(-15 235 240)"
          filter="url(#ringGlow)"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 1.5 }}
        />
        {/* Enhanced gradient and filter definitions */}
        <defs>
          <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA726" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>
          
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8FAB" />
            <stop offset="50%" stopColor="#FF7BA6" />
            <stop offset="100%" stopColor="#E75895" />
          </linearGradient>
          
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F48FB1" />
            <stop offset="50%" stopColor="#E879B7" />
            <stop offset="100%" stopColor="#C967A3" />
          </linearGradient>
          
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          
          <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </motion.svg>

      {/* Text - exact font and styling */}
      {showText && (
        <motion.div
          className="text-center"
          initial={animated ? { opacity: 0, y: 20 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div 
            className="font-bold text-[#1E3A8A] leading-tight tracking-tight mb-2"
            style={{ 
              fontSize: size === 'sm' ? '24px' : size === 'md' ? '32px' : size === 'lg' ? '40px' : '48px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            SmartSpend
          </div>
          <div 
            className="font-medium text-[#1E3A8A] leading-tight tracking-wide"
            style={{ 
              fontSize: size === 'sm' ? '14px' : size === 'md' ? '18px' : size === 'lg' ? '22px' : '26px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Think Smart. Spend Smarter.
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExactSmartSpendLogo;