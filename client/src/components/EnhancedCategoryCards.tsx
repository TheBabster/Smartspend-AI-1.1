import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { BounceButton, CountUp } from "./MicroAnimations";

interface EnhancedCategoryCardProps {
  category: {
    name: string;
    icon: LucideIcon;
    emoji: string;
    spent: number;
    budget: number;
    color: string;
  };
  index: number;
  onClick?: () => void;
}

export default function EnhancedCategoryCard({ category, index, onClick }: EnhancedCategoryCardProps) {
  const percentage = Math.min((category.spent / category.budget) * 100, 100);
  const isOverBudget = category.spent > category.budget;
  const remaining = Math.max(category.budget - category.spent, 0);

  const getStatusColor = () => {
    if (isOverBudget) return { 
      bg: "from-red-400 to-rose-500", 
      text: "text-red-600", 
      ring: "ring-red-500/20",
      badge: "destructive"
    };
    if (percentage > 80) return { 
      bg: "from-orange-400 to-amber-500", 
      text: "text-orange-600", 
      ring: "ring-orange-500/20",
      badge: "secondary"
    };
    if (percentage > 60) return { 
      bg: "from-yellow-400 to-amber-500", 
      text: "text-yellow-600", 
      ring: "ring-yellow-500/20",
      badge: "secondary"
    };
    return { 
      bg: "from-green-400 to-emerald-500", 
      text: "text-green-600", 
      ring: "ring-green-500/20",
      badge: "secondary"
    };
  };

  const status = getStatusColor();

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${percentage}%`,
      transition: {
        delay: 0.5 + index * 0.1,
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <BounceButton
      onClick={onClick}
      className="w-full h-full"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full"
      >
        <Card className={`h-full relative overflow-hidden shadow-lg border-2 hover:shadow-xl transition-all duration-300 ${status.ring} ring-2`}>
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-gradient-to-br ${status.bg} opacity-5`} />
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
          
          <CardContent className="p-6 relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${status.bg} flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <category.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-high-contrast flex items-center gap-2">
                    {category.name}
                    <span className="text-lg">{category.emoji}</span>
                  </h3>
                  <p className="text-xs text-medium-contrast">
                    {isOverBudget ? "Over budget" : `£${remaining.toFixed(0)} remaining`}
                  </p>
                </div>
              </div>
              
              <Badge variant={status.badge as any} className="text-xs">
                {percentage.toFixed(0)}%
              </Badge>
            </div>

            {/* Spending Progress */}
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-medium-contrast">Spent</span>
                <div className="text-right">
                  <CountUp
                    from={0}
                    to={category.spent}
                    prefix="£"
                    className={`text-lg font-bold ${status.text}`}
                  />
                  <div className="text-xs text-medium-contrast">of £{category.budget}</div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${status.bg} rounded-full relative`}
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
                
                {/* Overflow indicator */}
                {isOverBudget && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-white text-xs font-bold">!</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xs text-medium-contrast">Avg/Day</div>
                <div className="text-sm font-semibold text-high-contrast">
                  £{(category.spent / 30).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-medium-contrast">Days Left</div>
                <div className="text-sm font-semibold text-high-contrast">
                  {isOverBudget ? "0" : Math.ceil(remaining / (category.spent / 30) || 30)}
                </div>
              </div>
            </div>

            {/* Hover Animation Elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 rounded-lg"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </BounceButton>
  );
}