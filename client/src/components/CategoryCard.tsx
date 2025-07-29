import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { type Budget } from "@shared/schema";

interface CategoryCardProps {
  budget: Budget;
  delay?: number;
}

const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍽️",
  "Shopping": "🛍️",
  "Entertainment": "🎬",
  "Transport": "🚗",
  "Utilities": "💡",
  "Other": "📦",
};

const categoryColors: Record<string, string> = {
  "Food & Dining": "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
  "Shopping": "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
  "Entertainment": "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  "Transport": "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
  "Utilities": "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
  "Other": "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
};

const categoryProgressColors: Record<string, string> = {
  "Food & Dining": "bg-orange-500",
  "Shopping": "bg-purple-500",
  "Entertainment": "bg-blue-500",
  "Transport": "bg-green-500",
  "Utilities": "bg-purple-500",
  "Other": "bg-yellow-500",
};

export default function CategoryCard({ budget, delay = 0 }: CategoryCardProps) {
  const spent = parseFloat(budget.spent);
  const limit = parseFloat(budget.monthlyLimit);
  const remaining = limit - spent;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;

  const icon = categoryIcons[budget.category] || "📦";
  const gradientClass = categoryColors[budget.category] || categoryColors["Other"];
  const progressColor = categoryProgressColors[budget.category] || "bg-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="category-card"
    >
      <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${gradientClass} rounded-xl shadow-md`}>
        <div className="flex items-center gap-3">
          <motion.div 
            className={`w-10 h-10 ${progressColor.replace('bg-', 'bg-')} rounded-full flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-lg">{icon}</span>
          </motion.div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{budget.category}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              £{spent.toFixed(0)} of £{limit.toFixed(0)} spent
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{Math.abs(remaining).toFixed(0)} {remaining >= 0 ? 'left' : 'over'}
          </p>
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className={`h-full ${progressColor} rounded-full`}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
