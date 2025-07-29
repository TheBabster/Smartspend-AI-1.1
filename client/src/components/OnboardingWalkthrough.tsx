import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Brain, Target, CreditCard, TrendingUp } from 'lucide-react';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  targetElement: string;
  smartieMessage: string;
  smartieMood: 'happy' | 'thinking' | 'excited' | 'celebrating';
}

interface OnboardingWalkthroughProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Meet Smartie, Your AI Financial Coach!',
      description: 'I\'m here to help you make smarter spending decisions and reach your financial goals.',
      icon: <Brain className="w-6 h-6" />,
      action: 'Get Started',
      targetElement: '',
      smartieMessage: 'Hi there! I\'m Smartie, your personal financial coach. Ready to transform your spending habits?',
      smartieMood: 'happy'
    },
    {
      id: 'mood-tracking',
      title: 'Track Your Spending Mood',
      description: 'Before each purchase, I\'ll help you understand your emotional state to make better decisions.',
      icon: <Brain className="w-6 h-6" />,
      action: 'Tap here to track mood 🧠',
      targetElement: '.mood-tracker',
      smartieMessage: 'Understanding WHY you spend is just as important as WHAT you spend on. Let\'s check your emotions!',
      smartieMood: 'thinking'
    },
    {
      id: 'goal-setting',
      title: 'Set Your Financial Goals',
      description: 'Define what you\'re saving for and I\'ll help you stay motivated with personalized encouragement.',
      icon: <Target className="w-6 h-6" />,
      action: 'Set a goal here 🎯',
      targetElement: '.goals-section',
      smartieMessage: 'Goals give your money purpose! Whether it\'s a vacation or a new gadget, I\'ll help you get there.',
      smartieMood: 'excited'
    },
    {
      id: 'purchase-rating',
      title: 'Rate Your Purchase Decisions',
      description: 'After spending, rate how smart the purchase was. I\'ll learn your patterns and give better advice.',
      icon: <CreditCard className="w-6 h-6" />,
      action: 'Rate your purchase here 💸',
      targetElement: '.purchase-modal',
      smartieMessage: 'Every purchase is a learning opportunity! Rate them honestly and I\'ll get smarter about your habits.',
      smartieMood: 'thinking'
    },
    {
      id: 'analytics',
      title: 'Discover Your Spending Insights',
      description: 'View detailed analytics about your spending patterns, streaks, and financial wellness score.',
      icon: <TrendingUp className="w-6 h-6" />,
      action: 'Check insights here 📊',
      targetElement: '.analytics-section',
      smartieMessage: 'Knowledge is power! I\'ll show you patterns you never noticed and celebrate your wins.',
      smartieMood: 'celebrating'
    }
  ];

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    }
  }, [isActive]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const skipOnboarding = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const currentStepData = steps[currentStep];

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        >
          {/* Onboarding Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="relative max-w-md w-full"
          >
            <Card className="bg-white shadow-2xl border-2 border-purple-200">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipOnboarding}
                    className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16">
                      <ExactSmartieAvatar 
                        mood={currentStepData.smartieMood} 
                        size="lg" 
                        animated={true} 
                        animationType="greeting"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90 mb-1">
                        Step {currentStep + 1} of {steps.length}
                      </div>
                      <h2 className="font-bold text-lg leading-tight">
                        {currentStepData.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Smartie Speech Bubble */}
                  <div className="bg-purple-50 rounded-lg p-4 mb-6 relative">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-purple-50 transform rotate-45"></div>
                    <p className="text-sm text-purple-800 font-medium">
                      "{currentStepData.smartieMessage}"
                    </p>
                  </div>

                  {/* Step Icon and Description */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                      {currentStepData.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">
                        {currentStepData.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">👆</div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">Try it now:</div>
                        <div className="text-purple-600 font-semibold">
                          {currentStepData.action}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
                      {currentStep < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>

                  {/* Skip Option */}
                  <div className="text-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipOnboarding}
                      className="text-gray-500 text-xs"
                    >
                      Skip walkthrough
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-30"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingWalkthrough;