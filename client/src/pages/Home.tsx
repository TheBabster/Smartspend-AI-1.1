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
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [savingsLevel, setSavingsLevel] = useState(2);

  useEffect(() => {
    // Enhanced background styles with dark mode support
    if (darkMode) {
      document.body.style.background = "radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 100%)";
      document.body.classList.add('dark');
    } else {
      document.body.style.background = "radial-gradient(ellipse at top, #667eea 0%, #764ba2 100%)";
      document.body.classList.remove('dark');
    }
    
    // Animate Smartie's greeting with improved message
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setSmartieMessage("Hey! I'm Smartie, your AI money coach. Let's turn every penny into progress! 💸");
        setIsTyping(false);
      }, 1500);
    }, 1000);
    
    return () => {
      document.body.style.background = "";
    };
  }, [darkMode]);

  const handleGetStarted = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowOnboarding(true);
      setShowConfetti(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Enhanced Background Pattern with subtle animations */}
      <div className="absolute inset-0">
        {/* Enhanced animated background shimmer with dark mode support */}
        <motion.div 
          className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-slate-800/30 via-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-pink-500/20'}`}
          animate={{ 
            background: darkMode ? [
              "radial-gradient(ellipse at top left, rgba(51, 65, 85, 0.4) 0%, rgba(67, 56, 202, 0.2) 100%)",
              "radial-gradient(ellipse at top right, rgba(67, 56, 202, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)",
              "radial-gradient(ellipse at bottom, rgba(88, 28, 135, 0.3) 0%, rgba(30, 41, 59, 0.2) 100%)"
            ] : [
              "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 100%)",
              "radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.15) 100%)",
              "radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 100%)",
              "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.25) 0%, rgba(219, 39, 119, 0.2) 100%)"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
        
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
        
        {/* Floating stars */}
        <motion.div 
          className="absolute top-16 left-20 text-white/10 text-xl"
          animate={{ 
            y: [-10, 20, -10], 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div 
          className="absolute top-40 right-32 text-white/10 text-sm"
          animate={{ 
            y: [20, -10, 20], 
            rotate: [360, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-16 text-white/10 text-lg"
          animate={{ 
            y: [-15, 15, -15], 
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 9, repeat: Infinity }}
        >
          💫
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
        {/* Enhanced Dark Mode Toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 z-50 p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/40 text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ 
            scale: 1.15, 
            rotate: 360,
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 0.6, type: "spring" }}
        >
          <motion.span
            animate={{ rotate: darkMode ? 0 : 180 }}
            transition={{ duration: 0.5 }}
            className="text-xl"
          >
            {darkMode ? "☀️" : "🌙"}
          </motion.span>
        </motion.button>

        {/* Enhanced Gamified Progress Bar */}
        <motion.div
          className="absolute top-20 left-6 z-40 flex items-center gap-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {/* Streak Counter with Fire Animation */}
          <motion.div 
            className={`${darkMode ? 'bg-slate-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full px-4 py-2 border ${darkMode ? 'border-slate-600' : 'border-white/30'} shadow-lg relative overflow-hidden`}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <motion.span 
                className="text-orange-500 text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Streak: {currentStreak} days</span>
            </div>
            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStreak % 7) * 14.28}%` }}
              transition={{ duration: 1, delay: 2 }}
            />
          </motion.div>
          
          {/* Savings Tree with Growth Animation */}
          <motion.div 
            className={`${darkMode ? 'bg-slate-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full px-4 py-2 border ${darkMode ? 'border-slate-600' : 'border-white/30'} shadow-lg relative overflow-hidden`}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <motion.span 
                className="text-green-500 text-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌱
              </motion.span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Savings Tree Level {savingsLevel}</span>
            </div>
            {/* Growth leaves effect */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1 right-2 text-xs"
                style={{ left: `${60 + i * 8}%` }}
                initial={{ opacity: 0, y: 5, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [5, -10, -20],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                🍃
              </motion.div>
            ))}
            {/* Level progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${savingsLevel * 33}%` }}
              transition={{ duration: 1.5, delay: 2.5 }}
            />
          </motion.div>
        </motion.div>

        {/* Professional Header with Real Logo */}
        <motion.header 
          className={`${darkMode ? 'text-slate-100' : 'text-white'} px-6 py-6 text-center`}
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
            <h2 className={`text-4xl font-black mb-3 ${darkMode ? 'bg-gradient-to-r from-slate-100 to-indigo-200 bg-clip-text text-transparent' : 'bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent'}`}>
              Welcome to SmartSpend
            </h2>
            <p className={`text-lg ${darkMode ? 'opacity-90' : 'opacity-95'} font-semibold mb-3 ${darkMode ? 'text-indigo-200' : 'text-purple-100'}`}>
              Track your emotions. Build habits. Spend smarter.
            </p>
            <p className={`text-xl ${darkMode ? 'opacity-90' : 'opacity-95'} font-semibold mb-2`}>
              Master your money with AI, habits, and fun
            </p>
            <p className={`text-base ${darkMode ? 'opacity-75' : 'opacity-80'} font-medium`}>
              Your personal AI coach makes every financial decision smarter
            </p>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-6 relative z-20">
          {/* Enhanced Smartie Introduction Card with AI Indicator */}
          <motion.div 
            className={`${darkMode ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-white/20'} backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border relative overflow-hidden`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            whileHover={{ y: -2, shadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          >
            {/* Pulsing AI indicator */}
            <motion.div
              className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  y: [0, -3, 0]
                }}
                transition={{ 
                  scale: { delay: 0.5, duration: 0.5, type: "spring" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                className="cursor-pointer"
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
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>Smartie</h3>
                  <span className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-purple-600'}`}>• AI Assistant</span>
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-2xl p-4 relative`}>
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

          {/* Interactive Daily AI Tip Card */}
          <motion.div 
            className={`${darkMode ? 'bg-gradient-to-r from-slate-800/90 to-indigo-900/90 border border-slate-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'} rounded-3xl shadow-xl p-6 mb-6 backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Star className="w-5 h-5 text-white" />
              </motion.div>
              <motion.h3 
                className={`font-bold text-lg ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}
                animate={{ 
                  color: darkMode ? ["#f1f5f9", "#a5b4fc", "#f1f5f9"] : ["#1f2937", "#3730a3", "#1f2937"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Today's Smart Insight
              </motion.h3>
            </div>
            <motion.p 
              className={`leading-relaxed font-medium mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}
              animate={{ 
                color: darkMode ? ["#cbd5e1", "#a78bfa", "#cbd5e1"] : ["#374151", "#6366f1", "#374151"] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              "Track your emotional spending triggers! Users who log their mood before purchases save 23% more on average."
            </motion.p>
            <motion.button
              className={`text-sm font-bold px-6 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg'}`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/decisions")}
            >
              <span className="flex items-center gap-2">
                <span>Log Your Mood Now</span>
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Enhanced Core Features Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className={`${darkMode ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-white/20'} backdrop-blur-sm rounded-3xl shadow-xl p-7 border hover:shadow-2xl transition-all duration-300 group`}
              whileHover={{ y: -8, scale: 1.03 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className={`font-bold mb-3 text-lg ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>Smart Budgeting</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                AI-powered budget allocation based on your spending patterns and goals
              </p>
            </motion.div>
            
            <motion.div 
              className={`${darkMode ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-white/20'} backdrop-blur-sm rounded-3xl shadow-xl p-7 border hover:shadow-2xl transition-all duration-300 group`}
              whileHover={{ y: -8, scale: 1.03 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                whileHover={{ scale: 1.1 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity },
                  scale: { duration: 0.3 }
                }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className={`font-bold mb-3 text-lg ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>AI Insights</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Get personalized recommendations and spending insights from Smartie
              </p>
            </motion.div>
            
            <motion.div 
              className={`${darkMode ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-white/20'} backdrop-blur-sm rounded-3xl shadow-xl p-7 border hover:shadow-2xl transition-all duration-300 group`}
              whileHover={{ y: -8, scale: 1.03 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className={`font-bold mb-3 text-lg ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>Goal Tracking</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
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
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold py-6 px-16 rounded-2xl shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 w-full md:w-auto text-xl relative overflow-hidden group border-2 border-purple-300/40"
                style={{
                  boxShadow: "0 0 40px rgba(168, 85, 247, 0.5), 0 25px 50px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                }}
              >
                <span className="relative z-10 flex items-center gap-3 font-black tracking-wide">
                  🚀 Get Started Now
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(168, 85, 247, 0.5)",
                      "0 0 60px rgba(168, 85, 247, 0.7)",
                      "0 0 40px rgba(168, 85, 247, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Confetti Animation */}
                {showConfetti && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][i % 6],
                          left: `${50 + (Math.random() - 0.5) * 100}%`,
                          top: `${50 + (Math.random() - 0.5) * 100}%`
                        }}
                        animate={{
                          y: [-20, -100, 100],
                          x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                          rotate: [0, 360],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </Button>
            </motion.div>
            
            <p className={`text-sm mt-4 ${darkMode ? 'text-slate-300' : 'text-white/80'}`}>
              <button 
                onClick={() => navigate("/dashboard")}
                className={`transition-colors ${darkMode ? 'hover:underline hover:text-slate-100' : 'hover:underline hover:text-white'}`}
              >
                I already have an account
              </button>
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <motion.div
              className={`${darkMode ? 'bg-slate-800/60' : 'bg-white/20'} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? 'border-slate-600' : 'border-white/30'} shadow-lg`}
              animate={{ 
                background: darkMode ? [
                  "rgba(30, 41, 59, 0.6)",
                  "rgba(51, 65, 85, 0.6)",
                  "rgba(30, 41, 59, 0.6)"
                ] : [
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(255, 255, 255, 0.3)",
                  "rgba(255, 255, 255, 0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.p 
                className={`italic text-lg mb-3 ${darkMode ? 'text-slate-200' : 'text-white'}`}
                animate={{ 
                  opacity: [1, 0.8, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                "SmartSpend helped me save £300 in 2 months!"
              </motion.p>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-white/70'}`}>
                – Alex, UK
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Trust Elements */}
          <motion.div
            className={`text-center text-sm space-y-2 mb-8 ${darkMode ? 'text-slate-400' : 'text-white/70'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -1 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  scale: { duration: 0.2 },
                  opacity: { duration: 2, repeat: Infinity }
                }}
              >
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -1 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  scale: { duration: 0.2 },
                  opacity: { duration: 2, repeat: Infinity, delay: 0.5 }
                }}
              >
                <Users className="w-4 h-4" />
                <span>3,500+ Users</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -1 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  scale: { duration: 0.2 },
                  opacity: { duration: 2, repeat: Infinity, delay: 1 }
                }}
              >
                <Globe className="w-4 h-4" />
                <span>17 Countries</span>
              </motion.div>
            </div>
            <motion.p 
              className="text-xs opacity-80"
              animate={{ 
                color: darkMode ? ["#94a3b8", "#e2e8f0", "#94a3b8"] : ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Trusted by users worldwide • Backed by advanced AI
            </motion.p>
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
