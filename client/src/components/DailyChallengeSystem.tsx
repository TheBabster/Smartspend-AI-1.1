import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, Star, Gift, Zap, Shield, Heart, Trophy, Clock, CheckCircle2 } from "lucide-react";
import SmartieAnimated from "./SmartieAnimated";
import { CountUp, PulseGlow, SuccessCheckmark } from "./MicroAnimations";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: "saving" | "reflection" | "decision" | "streak" | "mindfulness";
  difficulty: "easy" | "medium" | "hard";
  reward: {
    coins: number;
    wisdomLeaves: number;
    xp: number;
  };
  progress: number;
  target: number;
  completed: boolean;
  timeLeft: string;
  smartieMessage: string;
}

interface WeeklyBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  target: number;
  unlocked: boolean;
  tier: "bronze" | "silver" | "gold" | "diamond";
}

interface DailyChallengeSystemProps {
  currentStreak: number;
  weeklySpent: number;
  weeklyDecisions: number;
  totalSaved: number;
}

export default function DailyChallengeSystem({
  currentStreak,
  weeklySpent,
  weeklyDecisions,
  totalSaved
}: DailyChallengeSystemProps) {
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [weeklyBadges, setWeeklyBadges] = useState<WeeklyBadge[]>([]);
  const [showRewardCelebration, setShowRewardCelebration] = useState(false);
  const [userCoins, setUserCoins] = useState(125);
  const [wisdomLeaves, setWisdomLeaves] = useState(45);

  // Generate today's challenge based on user behavior
  const generateDailyChallenge = (): DailyChallenge => {
    const challenges = [
      {
        id: "no-wants-day",
        title: "Zero Wants Challenge",
        description: "Go one full day without spending on wants (only needs)",
        type: "saving" as const,
        difficulty: "medium" as const,
        reward: { coins: 15, wisdomLeaves: 3, xp: 25 },
        smartieMessage: "Your willpower muscle is getting stronger! 💪"
      },
      {
        id: "regret-reflection",
        title: "Regret Rewind",
        description: "Think about one past regret purchase and write why you'd decide differently",
        type: "reflection" as const,
        difficulty: "easy" as const,
        reward: { coins: 10, wisdomLeaves: 5, xp: 15 },
        smartieMessage: "Learning from the past makes future decisions easier! 🧠"
      },
      {
        id: "three-decisions",
        title: "Triple Decision Day",
        description: "Use SmartSpend decision tool 3 times before making purchases",
        type: "decision" as const,
        difficulty: "easy" as const,
        reward: { coins: 12, wisdomLeaves: 2, xp: 20 },
        smartieMessage: "You're building a habit of mindful spending! ✨"
      },
      {
        id: "streak-builder",
        title: "Streak Guardian",
        description: "Maintain your current streak for one more day",
        type: "streak" as const,
        difficulty: currentStreak >= 7 ? "hard" : "easy",
        reward: { coins: 8 + currentStreak, wisdomLeaves: 1, xp: 10 + currentStreak },
        smartieMessage: "Consistency is the key to lasting change! 🌟"
      },
      {
        id: "mindful-pause",
        title: "The 24-Hour Rule",
        description: "If you want something, wait 24 hours before deciding",
        type: "mindfulness" as const,
        difficulty: "medium" as const,
        reward: { coins: 18, wisdomLeaves: 4, xp: 30 },
        smartieMessage: "Patience is a superpower when it comes to money! ⏰"
      }
    ];

    const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    return {
      ...selectedChallenge,
      progress: 0,
      target: 1,
      completed: false,
      timeLeft: "23h 45m", // Would be calculated based on current time
    };
  };

  // Generate weekly badge system
  const generateWeeklyBadges = (): WeeklyBadge[] => [
    {
      id: "seven-day-smart",
      name: "7-Day Smart",
      description: "Make smart decisions for 7 consecutive days",
      icon: Target,
      color: "text-blue-500",
      progress: currentStreak,
      target: 7,
      unlocked: currentStreak >= 7,
      tier: "bronze"
    },
    {
      id: "fifty-saved",
      name: "£50 Saver",
      description: "Save £50 in total",
      icon: Shield,
      color: "text-green-500",
      progress: totalSaved,
      target: 50,
      unlocked: totalSaved >= 50,
      tier: "silver"
    },
    {
      id: "decision-master",
      name: "Decision Master",
      description: "Use decision tool 3 times in one week",
      icon: Zap,
      color: "text-purple-500",
      progress: weeklyDecisions,
      target: 3,
      unlocked: weeklyDecisions >= 3,
      tier: "bronze"
    },
    {
      id: "impulse-dodger",
      name: "Impulse Dodger",
      description: "Successfully avoid your first impulse purchase",
      icon: Heart,
      color: "text-red-500",
      progress: 1, // Would track actual impulse avoidance
      target: 1,
      unlocked: true,
      tier: "gold"
    }
  ];

  useEffect(() => {
    setTodayChallenge(generateDailyChallenge());
    setWeeklyBadges(generateWeeklyBadges());
  }, [currentStreak, weeklySpent, weeklyDecisions, totalSaved]);

  const completeChallenge = () => {
    if (!todayChallenge || todayChallenge.completed) return;

    const updatedChallenge = { ...todayChallenge, completed: true, progress: 1 };
    setTodayChallenge(updatedChallenge);
    
    // Add rewards
    setUserCoins(prev => prev + updatedChallenge.reward.coins);
    setWisdomLeaves(prev => prev + updatedChallenge.reward.wisdomLeaves);
    
    // Show celebration
    setShowRewardCelebration(true);
    setTimeout(() => setShowRewardCelebration(false), 3000);
  };

  const getBadgeTierColor = (tier: WeeklyBadge["tier"]) => {
    switch (tier) {
      case "bronze": return "from-amber-400 to-amber-600";
      case "silver": return "from-gray-300 to-gray-500";
      case "gold": return "from-yellow-400 to-yellow-600";
      case "diamond": return "from-blue-400 to-purple-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  if (!todayChallenge) return null;

  return (
    <div className="space-y-6">
      {/* Daily Challenge Card */}
      <Card className="shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center gap-4">
              <PulseGlow color="purple" intensity="high">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="w-8 h-8" />
                </div>
              </PulseGlow>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Today's Challenge</h2>
                <p className="text-white/90 text-sm">
                  Complete this to earn coins and grow your savings tree!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {todayChallenge.timeLeft}
                </div>
                <div className="text-xs text-white/80">remaining</div>
              </div>
            </div>
          </div>

          {/* Challenge Content */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12">
                <SmartieAnimated 
                  mood={todayChallenge.completed ? "celebrating" : "happy"} 
                  size="lg" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{todayChallenge.title}</h3>
                  <Badge 
                    variant={todayChallenge.difficulty === "easy" ? "secondary" : 
                           todayChallenge.difficulty === "medium" ? "default" : "destructive"}
                  >
                    {todayChallenge.difficulty}
                  </Badge>
                  {todayChallenge.completed && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {todayChallenge.description}
                </p>
                
                {/* Smartie's message */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200/50 dark:border-purple-800/30">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    💭 Smartie says: "{todayChallenge.smartieMessage}"
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {todayChallenge.progress}/{todayChallenge.target}
                </span>
              </div>
              <Progress 
                value={(todayChallenge.progress / todayChallenge.target) * 100} 
                className="h-3"
              />
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="font-semibold text-yellow-600">+{todayChallenge.reward.coins}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Coins</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="font-semibold text-green-600">+{todayChallenge.reward.wisdomLeaves}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Leaves</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="font-semibold text-blue-600">+{todayChallenge.reward.xp}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">XP</div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={completeChallenge}
              disabled={todayChallenge.completed}
              className="w-full"
              size="lg"
            >
              {todayChallenge.completed ? (
                <div className="flex items-center gap-2">
                  <SuccessCheckmark size={20} />
                  Challenge Completed!
                </div>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Resources */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <CountUp 
              from={0} 
              to={userCoins} 
              className="text-2xl font-bold text-yellow-600"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">SmartCoins</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <CountUp 
              from={0} 
              to={wisdomLeaves} 
              className="text-2xl font-bold text-green-600"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Wisdom Leaves</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Badge Board */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Weekly Badge Board
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className={`relative p-4 rounded-xl border-2 ${
                  badge.unlocked 
                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {badge.unlocked && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getBadgeTierColor(badge.tier)} flex items-center justify-center`}>
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${badge.unlocked ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.min(badge.progress, badge.target)}/{badge.target}</span>
                  </div>
                  <Progress 
                    value={(Math.min(badge.progress, badge.target) / badge.target) * 100} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward Celebration */}
      <AnimatePresence>
        {showRewardCelebration && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm w-full"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
            >
              <div className="w-16 h-16 mx-auto mb-4">
                <SmartieAnimated mood="celebrating" size="xl" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Great job! You've earned your rewards.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="font-bold text-yellow-600">+{todayChallenge.reward.coins}</div>
                  <div className="text-xs">Coins</div>
                </div>
                <div className="text-center">
                  <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-green-600">+{todayChallenge.reward.wisdomLeaves}</div>
                  <div className="text-xs">Leaves</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-blue-600">+{todayChallenge.reward.xp}</div>
                  <div className="text-xs">XP</div>
                </div>
              </div>

              <Button 
                onClick={() => setShowRewardCelebration(false)}
                className="w-full"
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}