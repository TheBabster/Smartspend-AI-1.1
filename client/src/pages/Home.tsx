import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Globe, Users, Star, Brain, TrendingUp, Target } from "lucide-react";
import ExactSmartSpendLogo from "@/components/ExactSmartSpendLogo";
import ExactSmartieAvatar from "@/components/ExactSmartieAvatar";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";

export default function Home() {
  const [, navigate] = useLocation();
  const [smartieMessage, setSmartieMessage] = useState("Hi there! I'm Smartie 👋");
  const [isTyping, setIsTyping] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Enhanced background styles
    document.body.style.background = "radial-gradient(ellipse at top, #667eea 0%, #764ba2 100%)";
    
    // Animate Smartie's greeting
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setSmartieMessage("Hey! Ready to take your finances to genius level today? 🚀");
        setIsTyping(false);
      }, 1500);
    }, 1000);
    
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Pattern with subtle animations */}
      <div className="absolute inset-0">
        {/* Animated background shimmer */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-pink-500/20"
          animate={{ 
            background: [
              "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)",
              "radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
              "radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating currency icons */}
        <motion.div 
          className="absolute top-10 left-10 w-6 h-6 text-white/20 text-2xl"
          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          £
        </motion.div>
        <motion.div 
          className="absolute top-32 right-16 w-6 h-6 text-white/20 text-xl"
          animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          €
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-10 w-6 h-6 text-white/20 text-2xl"
          animate={{ y: [-15, 15, -15], rotate: [0, 90, 180] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          $
        </motion.div>
        
        {/* Smartie silhouettes as watermarks */}
        <motion.div 
          className="absolute top-20 left-1/4 w-16 h-16 opacity-5"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <ExactSmartieAvatar mood="thinking" size="lg" animated={false} />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Professional Header with Real Logo */}
        <motion.header 
          className="text-white px-6 py-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-6">
            <ExactSmartSpendLogo 
              size="xl" 
              animated={true} 
              showText={true} 
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Welcome to Financial Freedom!
            </h2>
            <p className="text-lg opacity-90 font-medium mb-2">
              Take control of your money with AI-powered insights
            </p>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-6 relative z-20">
          {/* Enhanced Smartie Introduction Card */}
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              >
                <ExactSmartieAvatar 
                  mood="happy" 
                  size="lg" 
                  animated={true}
                  animationType="greeting"
                />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Smartie</h3>
                  <span className="text-sm text-purple-600">• AI Assistant</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-4 relative">
                  <AnimatePresence mode="wait">
                    {isTyping ? (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-sm">Smartie is thinking...</span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-800 leading-relaxed"
                      >
                        {smartieMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Core Features Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Smart Budgeting</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI-powered budget allocation based on your spending patterns and goals
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">AI Insights</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get personalized recommendations and spending insights from Smartie
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Goal Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Set and achieve financial goals with gamified progress tracking
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Get Started Button */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 w-full md:w-auto text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started 🚀
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
            
            <p className="text-white/80 text-sm mt-4">
              <button 
                onClick={() => navigate("/dashboard")}
                className="hover:underline hover:text-white transition-colors"
              >
                I already have an account
              </button>
            </p>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            className="text-center text-white/70 text-sm space-y-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>3,500+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>17 Countries</span>
              </div>
            </div>
            <p className="text-xs opacity-80">
              Trusted by users worldwide • Backed by advanced AI
            </p>
          </motion.div>
        </main>
      </div>

      {/* Onboarding Walkthrough */}
      <OnboardingWalkthrough
        isActive={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          navigate("/dashboard");
        }}
        onSkip={() => {
          setShowOnboarding(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
