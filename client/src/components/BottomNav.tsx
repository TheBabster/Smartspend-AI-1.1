import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, TrendingUp, Target, Users, Brain, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  currentTab: "home" | "analytics" | "goals" | "decisions" | "smartie" | "growth" | "purchase" | "expenses";
}

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/analytics" },
  { id: "purchase", label: "Smart Buy", icon: ShoppingCart, path: "/purchase", special: true },
  { id: "goals", label: "Goals", icon: Target, path: "/goals" },
  { id: "smartie", label: "Smartie", icon: Brain, path: "/smartie" },
];

export default function BottomNav({ currentTab }: BottomNavProps) {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 md:hidden z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          
          return (
            <Link key={item.id} href={item.path}>
              <motion.button
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative",
                  isActive 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-gray-400 dark:text-gray-500",
                  item.special && "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                )}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={isActive ? { y: [-2, 0, -2] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon size={20} />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 w-6 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
