import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Smartie from "@/components/Smartie";

export default function Home() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Add background pattern styles
    document.body.style.background = "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)";
    
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-20 right-16 w-12 h-12 rounded-full bg-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="text-white px-6 py-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-bold">SmartSpend</h1>
          </div>
          <p className="text-lg opacity-90 font-medium">Welcome to Financial Freedom!</p>
          <p className="text-sm opacity-75 mt-2">Take control of your money with AI-powered insights</p>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-6 -mt-6 relative z-20">
          {/* Smartie Introduction Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Smartie 
              message="Hi! I'm Smartie, your financial assistant. Let's build your perfect budget together and crush those spending goals! 🚀"
              showTyping={true}
            />
          </motion.div>

          {/* Core Features Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 category-card">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-lg">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Smart Budgeting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered budget allocation based on your spending patterns and goals
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 category-card">
              <div className="w-12 h-12 smartie-gradient rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-lg">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Get personalized recommendations and spending insights from Smartie
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 category-card">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-lg">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Goal Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Set and achieve financial goals with gamified progress tracking
              </p>
            </div>
          </motion.div>

          {/* Get Started Button */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Button 
              onClick={() => navigate("/dashboard")}
              className="gradient-bg text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full md:w-auto text-lg"
            >
              Get Started 🚀
            </Button>
            <p className="text-white/80 text-sm mt-4">
              <button 
                onClick={() => navigate("/dashboard")}
                className="hover:underline"
              >
                I already have an account
              </button>
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
