import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Heart,
  Star,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

// Toast notification system with Smartie
interface SmartieToastProps {
  message: string;
  type: 'success' | 'warning' | 'info' | 'celebration';
  onClose: () => void;
  duration?: number;
}

export function SmartieToast({ message, type, onClose, duration = 4000 }: SmartieToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          mood: 'celebrating' as const,
          icon: CheckCircle,
          bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          textColor: 'text-green-800 dark:text-green-200',
          iconColor: 'text-green-600'
        };
      case 'warning':
        return {
          mood: 'concerned' as const,
          icon: AlertCircle,
          bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'celebration':
        return {
          mood: 'celebrating' as const,
          icon: Star,
          bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          borderColor: 'border-purple-200 dark:border-purple-700',
          textColor: 'text-purple-800 dark:text-purple-200',
          iconColor: 'text-purple-600'
        };
      default:
        return {
          mood: 'happy' as const,
          icon: Info,
          bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-600'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-24 right-4 z-50 max-w-sm"
    >
      <Card className={`bg-gradient-to-r ${config.bgColor} border ${config.borderColor} shadow-xl`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: type === 'celebration' ? 3 : 0 }}
            >
              <ModernSmartieAvatar mood={config.mood} size="sm" />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                <span className={`text-sm font-semibold ${config.textColor}`}>
                  Smartie says
                </span>
              </div>
              <p className={`text-sm ${config.textColor}`}>
                {message}
              </p>
            </div>
            
            <motion.button
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-white/50 transition-colors ${config.textColor}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Progress bar */}
          <motion.div
            className={`mt-3 h-1 bg-white/30 rounded-full overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className={`h-full ${config.iconColor.replace('text-', 'bg-')}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </motion.div>
          
          {/* Celebration sparkles */}
          {type === 'celebration' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400 text-xs"
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${20 + Math.floor(i / 3) * 40}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: 1
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// Pulse notification for important updates
interface PulseNotificationProps {
  children: React.ReactNode;
  active: boolean;
  intensity?: 'gentle' | 'medium' | 'strong';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function PulseNotification({ 
  children, 
  active, 
  intensity = 'medium',
  color = 'blue' 
}: PulseNotificationProps) {
  const getIntensity = () => {
    switch (intensity) {
      case 'gentle': return { scale: [1, 1.02, 1], duration: 2 };
      case 'medium': return { scale: [1, 1.05, 1], duration: 1.5 };
      case 'strong': return { scale: [1, 1.1, 1], duration: 1 };
      default: return { scale: [1, 1.05, 1], duration: 1.5 };
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'green': return 'shadow-green-200 dark:shadow-green-800';
      case 'yellow': return 'shadow-yellow-200 dark:shadow-yellow-800';
      case 'red': return 'shadow-red-200 dark:shadow-red-800';
      case 'purple': return 'shadow-purple-200 dark:shadow-purple-800';
      default: return 'shadow-blue-200 dark:shadow-blue-800';
    }
  };

  const animation = getIntensity();

  return (
    <motion.div
      animate={active ? {
        scale: animation.scale,
        boxShadow: [
          '0 0 0 0 currentColor',
          '0 0 0 10px transparent',
          '0 0 0 0 currentColor'
        ]
      } : {}}
      transition={active ? {
        duration: animation.duration,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      className={active ? `${getColorClass()}` : ''}
    >
      {children}
    </motion.div>
  );
}

// Hover lift effect for cards
interface HoverLiftProps {
  children: React.ReactNode;
  lift?: 'small' | 'medium' | 'large';
  className?: string;
}

export function HoverLift({ children, lift = 'medium', className = '' }: HoverLiftProps) {
  const getLiftAmount = () => {
    switch (lift) {
      case 'small': return -2;
      case 'medium': return -5;
      case 'large': return -8;
      default: return -5;
    }
  };

  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: getLiftAmount(),
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// Progress celebration animation
interface ProgressCelebrationProps {
  value: number;
  maxValue: number;
  showCelebration: boolean;
  color?: string;
  height?: string;
}

export function ProgressCelebration({ 
  value, 
  maxValue, 
  showCelebration,
  color = 'bg-gradient-to-r from-purple-400 to-blue-400',
  height = 'h-3'
}: ProgressCelebrationProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="relative">
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} ${color} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {showCelebration && percentage >= 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              animate={{
                opacity: [0, 0.8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: 3
              }}
            />
          )}
        </motion.div>
      </div>
      
      {/* Sparkle celebration for completion */}
      <AnimatePresence>
        {showCelebration && percentage >= 100 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                }}
                initial={{ y: 0, opacity: 1, scale: 0 }}
                animate={{
                  y: [-10, -30],
                  opacity: [1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 40]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Button with loading state and success animation
interface SmartButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void> | void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
}

export function SmartButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '' 
}: SmartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantClasses = () => {
    if (isSuccess) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white';
      default:
        return 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white';
    }
  };

  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${getVariantClasses()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
      transition={isLoading ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading...
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Success!
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Contextual micro-feedback for user actions
interface MicroFeedbackProps {
  action: 'like' | 'save' | 'share' | 'complete' | 'delete';
  active: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MicroFeedback({ action, active, size = 'md' }: MicroFeedbackProps) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getConfig = () => {
    switch (action) {
      case 'like':
        return { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100' };
      case 'save':
        return { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
      case 'complete':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'delete':
        return { icon: X, color: 'text-red-500', bgColor: 'bg-red-100' };
      default:
        return { icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-100' };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      className={`${getSizeClass()} ${config.color} relative`}
      animate={active ? {
        scale: [1, 1.3, 1],
        rotate: action === 'like' ? [0, -10, 10, 0] : 0
      } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Icon className="w-full h-full" />
      
      {active && (
        <motion.div
          className={`absolute inset-0 ${config.bgColor} rounded-full -z-10`}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
}