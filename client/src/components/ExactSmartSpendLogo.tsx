import React from 'react';
import { motion } from 'framer-motion';

interface ExactSmartSpendLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const ExactSmartSpendLogo: React.FC<ExactSmartSpendLogoProps> = ({
  size = 'md',
  animated = true,
  showText = false,
  className = ""
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12', 
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Pixel Perfect Match to Reference */}
      <div className={`relative ${sizeClasses[size]}`}>
        <motion.svg
          viewBox="0 0 300 200"
          className="w-full h-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <defs>
            {/* Exact gradient colors from reference image */}
            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA726" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
            <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9FAF" />
              <stop offset="100%" stopColor="#FF6B85" />
            </linearGradient>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879C7" />
              <stop offset="50%" stopColor="#D946C4" />
              <stop offset="100%" stopColor="#B83E99" />
            </linearGradient>
          </defs>

          {/* 4-point sparkle star - exact position and shape */}
          <motion.g
            transform="translate(50, 40)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: animated ? [0, 1, 0.7, 1] : 1, 
              scale: animated ? [0.8, 1.2, 1, 1.1] : 1 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 1 
            }}
          >
            <path
              d="M0 -12 L4 -3 L12 0 L4 3 L0 12 L-4 3 L-12 0 L-4 -3 Z"
              fill="url(#sparkleGradient)"
            />
          </motion.g>

          {/* Head profile silhouette - exact pink color and shape */}
          <motion.path
            d="M75 115
               C 75 100, 85 85, 100 75
               C 105 72, 110 68, 115 65
               C 120 62, 125 60, 130 58
               C 140 55, 150 55, 160 58
               C 170 60, 180 65, 185 72
               C 190 78, 192 85, 194 92
               C 196 100, 195 108, 194 115
               C 193 122, 191 128, 188 134
               C 185 140, 180 145, 174 148
               C 168 151, 160 152, 152 150
               C 144 148, 136 145, 130 142
               C 124 139, 118 135, 114 130
               C 110 125, 108 120, 107 115
               C 106 112, 105 110, 104 108
               L 102 110
               C 100 112, 98 114, 96 115
               C 90 118, 82 118, 75 115 Z"
            fill="url(#headGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Brain inside head - exact purple/pink pattern */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main brain outline */}
            <path
              d="M105 85
                 C 110 80, 120 78, 130 80
                 C 140 78, 150 80, 155 85
                 C 160 88, 162 93, 160 98
                 C 162 103, 160 108, 155 112
                 C 150 115, 140 115, 130 113
                 C 120 115, 110 112, 105 108
                 C 100 103, 102 98, 105 93
                 C 100 88, 102 83, 105 85 Z"
              fill="url(#brainGradient)"
            />
            
            {/* Brain fold pattern - squiggly lines exactly as shown */}
            <path
              d="M108 88 Q115 85, 122 88 Q129 85, 136 88 Q143 85, 150 88"
              stroke="#B83E99"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M108 92 Q115 89, 122 92 Q129 89, 136 92 Q143 89, 150 92"
              stroke="#B83E99"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M108 96 Q115 93, 122 96 Q129 93, 136 96 Q143 93, 150 96"
              stroke="#B83E99"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M108 100 Q115 97, 122 100 Q129 97, 136 100 Q143 97, 150 100"
              stroke="#B83E99"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M110 104 Q117 101, 124 104 Q131 101, 138 104 Q145 101, 150 104"
              stroke="#B83E99"
              strokeWidth="1.2"
              fill="none"
            />
          </motion.g>

          {/* £ symbol - exact position and color */}
          <motion.text
            x="130"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold"
            fill="#FFA726"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            £
          </motion.text>

          {/* Orbital ring - exact dark blue color and elliptical shape */}
          <motion.ellipse
            cx="130"
            cy="95"
            rx="50"
            ry="28"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform="rotate(-15 130 95)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              rotate: animated ? [-15, 345] : -15
            }}
            transition={{ 
              pathLength: { duration: 1.5, delay: 0.5 },
              opacity: { duration: 0.5, delay: 0.5 },
              rotate: { duration: 12, repeat: Infinity, ease: "linear" }
            }}
          />
        </motion.svg>
      </div>

      {/* Text Logo - Exact Typography and Colors */}
      {showText && (
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className={`font-bold leading-tight ${textSizeClasses[size]}`}
              style={{ color: '#1E3A8A' }}>
            SmartSpend
          </h1>
          {size !== 'xs' && size !== 'sm' && (
            <p className="font-medium leading-tight"
               style={{ 
                 color: '#1E3A8A', 
                 fontSize: size === 'xl' ? '1.125rem' : size === 'lg' ? '0.875rem' : '0.75rem'
               }}>
              Think Smart. Spend Smarter.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ExactSmartSpendLogo;