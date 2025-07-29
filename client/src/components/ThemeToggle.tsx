import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import SmartieAnimated from "./SmartieAnimated";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSmartie, setShowSmartie] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Show Smartie reaction
    setShowSmartie(true);
    setTimeout(() => setShowSmartie(false), 2000);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="relative w-10 h-10 p-0 rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
        >
          <motion.div
            initial={false}
            animate={{
              scale: theme === 'light' ? 1 : 0,
              rotate: theme === 'light' ? 0 : 180,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-5 h-5 text-yellow-500" />
          </motion.div>
          
          <motion.div
            initial={false}
            animate={{
              scale: theme === 'dark' ? 1 : 0,
              rotate: theme === 'dark' ? 0 : -180,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-5 h-5 text-blue-400" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Smartie Reaction */}
      {showSmartie && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="absolute -top-16 -left-8 z-50"
        >
          <div className="relative">
            <SmartieAnimated 
              mood={theme === 'dark' ? 'sleepy' : 'happy'} 
              size="sm"
              isIdle={false}
            />
            {/* Speech bubble */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 text-xs font-medium shadow-lg border"
            >
              {theme === 'dark' ? '😴 Sleepy mode!' : '☀️ Bright mode!'}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}