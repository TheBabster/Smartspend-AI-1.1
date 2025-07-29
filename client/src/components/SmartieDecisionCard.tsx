import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SmartieAnimated from "./SmartieAnimated";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface SmartieDecisionCardProps {
  recommendation: 'yes' | 'think_again' | 'no';
  score: number;
  reasoning: string;
  emotionalInsight: string;
  financialImpact: string;
  confidenceLevel: number;
  savingsImpact?: number;
  streakImpact?: number;
}

export default function SmartieDecisionCard({
  recommendation,
  score,
  reasoning,
  emotionalInsight,
  financialImpact,
  confidenceLevel,
  savingsImpact = 0,
  streakImpact = 0
}: SmartieDecisionCardProps) {
  const getDecisionConfig = () => {
    switch (recommendation) {
      case 'yes':
        return {
          color: 'green',
          bgClass: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderClass: 'border-green-200 dark:border-green-700',
          textClass: 'text-green-800 dark:text-green-200',
          scoreClass: 'text-green-600 dark:text-green-400',
          emoji: '✅',
          title: 'Smart Purchase!',
          mood: 'celebrating' as const,
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      case 'think_again':
        return {
          color: 'yellow',
          bgClass: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderClass: 'border-yellow-200 dark:border-yellow-700',
          textClass: 'text-yellow-800 dark:text-yellow-200',
          scoreClass: 'text-yellow-600 dark:text-yellow-400',
          emoji: '🤔',
          title: 'Think It Over',
          mood: 'thinking' as const,
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
      case 'no':
        return {
          color: 'red',
          bgClass: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
          borderClass: 'border-red-200 dark:border-red-700',
          textClass: 'text-red-800 dark:text-red-200',
          scoreClass: 'text-red-600 dark:text-red-400',
          emoji: '❌',
          title: 'Skip This One',
          mood: 'concerned' as const,
          icon: TrendingDown,
          iconColor: 'text-red-500'
        };
      default:
        return {
          color: 'gray',
          bgClass: 'bg-gray-50',
          borderClass: 'border-gray-200',
          textClass: 'text-gray-800',
          scoreClass: 'text-gray-600',
          emoji: '🤷',
          title: 'Hmm...',
          mood: 'thinking' as const,
          icon: AlertTriangle,
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getDecisionConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Card className={`relative overflow-hidden ${config.bgClass} ${config.borderClass} border-2`}>
        {/* Header with Smartie and Decision */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <SmartieAnimated 
              mood={config.mood}
              size="lg"
              showCoin={recommendation === 'no'}
              isIdle={false}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                <h3 className={`text-xl font-bold ${config.textClass}`}>
                  {config.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${config.scoreClass}`}>
                  {score}% {recommendation === 'yes' ? 'SMART' : recommendation === 'think_again' ? 'UNSURE' : 'RISKY'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {confidenceLevel}% confident
                </div>
              </div>
            </div>
          </div>

          {/* Main Reasoning */}
          <div className="mb-6">
            <p className={`text-base leading-relaxed ${config.textClass}`}>
              {reasoning}
            </p>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Emotional Insight */}
            <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🧠</span>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Emotional Check</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {emotionalInsight}
              </p>
            </div>

            {/* Financial Impact */}
            <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💰</span>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Financial Impact</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {financialImpact}
              </p>
            </div>
          </div>

          {/* Savings & Streak Impact Visualization */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/30 dark:bg-black/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                {savingsImpact >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">Savings Impact</span>
              </div>
              <div className={`text-lg font-bold ${savingsImpact >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {savingsImpact >= 0 ? '+' : ''}£{Math.abs(savingsImpact)}
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-white/30 dark:bg-black/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                {streakImpact >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">Streak Impact</span>
              </div>
              <div className={`text-lg font-bold ${streakImpact >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {streakImpact > 0 ? '+' : ''}{streakImpact} days
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
        <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-${config.color}-300/20 to-transparent rounded-full blur-2xl`} />
      </Card>
    </motion.div>
  );
}