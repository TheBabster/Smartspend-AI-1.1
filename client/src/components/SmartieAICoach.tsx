import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Heart, Clock, Zap, Coffee, Star, TrendingUp, TrendingDown, Target } from "lucide-react";
import SmartieAnimated from "./SmartieAnimated";
import { CountUp, PulseGlow } from "./MicroAnimations";

interface EmotionalTrigger {
  id: string;
  type: "boredom" | "stress" | "fomo" | "social_comparison" | "comfort" | "celebration";
  timestamp: Date;
  amount: number;
  description: string;
}

interface CoachingStyle {
  id: "gentle" | "tough_love" | "humorous" | "minimal";
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface WeeklyReflection {
  week: string;
  biggestRegret: string;
  wouldDoDifferently: string;
  happinessImpact: number;
  smartieAdvice: string;
}

interface SmartieAICoachProps {
  totalSpent: number;
  weeklySpent: number;
  lastWeekSpent: number;
  recentDecisions: any[];
  currentStreak: number;
}

export default function SmartieAICoach({
  totalSpent,
  weeklySpent,
  lastWeekSpent,
  recentDecisions = [],
  currentStreak
}: SmartieAICoachProps) {
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle["id"]>("gentle");
  const [showReflection, setShowReflection] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<string>("");
  const [smartieMood, setSmarteMood] = useState<"happy" | "concerned" | "proud" | "thinking">("happy");
  const [emotionalTriggers, setEmotionalTriggers] = useState<EmotionalTrigger[]>([]);

  const coachingStyles: CoachingStyle[] = [
    {
      id: "gentle",
      name: "Gentle Guide",
      description: "Supportive and encouraging approach",
      icon: Heart
    },
    {
      id: "tough_love",
      name: "Tough Love",
      description: "Direct and challenging feedback",
      icon: Zap
    },
    {
      id: "humorous",
      name: "Wise & Witty",
      description: "Light-hearted with humor",
      icon: Coffee
    },
    {
      id: "minimal",
      name: "Minimal Coach",
      description: "Brief, essential insights only",
      icon: Target
    }
  ];

  // Generate contextual advice based on spending patterns
  const generateContextualAdvice = () => {
    const weeklyChange = ((weeklySpent - lastWeekSpent) / lastWeekSpent) * 100;
    const style = coachingStyles.find(s => s.id === coachingStyle);
    
    // Analyze spending trends and patterns
    if (weeklyChange > 20) {
      switch (coachingStyle) {
        case "gentle":
          return "I notice you've spent more this week. That's okay - let's focus on small improvements tomorrow. 💙";
        case "tough_love":
          return "Your spending jumped 20% this week. Time to get serious about your goals. No excuses!";
        case "humorous":
          return "Your wallet called - it's feeling a bit lighter than usual! Maybe we can give it a break? 😄";
        case "minimal":
          return "Weekly spending: +20%. Review needed.";
        default:
          return "Let's work together to get back on track this week.";
      }
    } else if (weeklyChange < -10) {
      switch (coachingStyle) {
        case "gentle":
          return `Amazing! You saved ${Math.abs(weeklyChange).toFixed(1)}% compared to last week. You're building great habits! ✨`;
        case "tough_love":
          return `Good work! You cut spending by ${Math.abs(weeklyChange).toFixed(1)}%. Keep pushing - you can do even better!`;
        case "humorous":
          return `Your wallet is doing a happy dance! ${Math.abs(weeklyChange).toFixed(1)}% less spent = more money for future you! 💃`;
        case "minimal":
          return `Weekly spending: ${weeklyChange.toFixed(1)}%. Good progress.`;
        default:
          return "Great progress on your spending goals!";
      }
    } else if (currentStreak >= 7) {
      switch (coachingStyle) {
        case "gentle":
          return `${currentStreak} days of smart decisions! You're creating lasting change. I'm proud of you! 🌟`;
        case "tough_love":
          return `${currentStreak}-day streak! Don't get comfortable - this is just the beginning!`;
        case "humorous":
          return `${currentStreak} days strong! Your future self is probably writing you a thank-you note right now! 📝`;
        case "minimal":
          return `Streak: ${currentStreak} days. Maintain momentum.`;
        default:
          return "Your consistency is paying off!";
      }
    } else {
      return "Ready to make some smart financial decisions today?";
    }
  };

  // Detect emotional spending patterns from real user data
  const analyzeEmotionalTriggers = () => {
    // For now, start with empty array - this will be populated with real user regret data
    // when users actually report regret purchases through the app
    const triggers: EmotionalTrigger[] = [];
    
    setEmotionalTriggers(triggers);
  };

  useEffect(() => {
    const advice = generateContextualAdvice();
    setCurrentAdvice(advice);
    
    // Set Smartie's mood based on recent performance
    if (weeklySpent > lastWeekSpent * 1.2) {
      setSmarteMood("concerned");
    } else if (weeklySpent < lastWeekSpent * 0.8) {
      setSmarteMood("proud");
    } else if (currentStreak >= 5) {
      setSmarteMood("happy");
    } else {
      setSmarteMood("thinking");
    }

    analyzeEmotionalTriggers();
  }, [weeklySpent, lastWeekSpent, currentStreak, coachingStyle]);

  const RegretRadarSection = () => (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-800/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-700 dark:text-red-300">This Week's Regret Radar</h3>
        </div>
        
        {emotionalTriggers.length > 0 ? (
          <div className="space-y-3">
            {emotionalTriggers.map((trigger) => (
              <motion.div
                key={trigger.id}
                className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-red-200/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {trigger.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    £{trigger.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {trigger.description}
                </p>
              </motion.div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowReflection(true)}
              className="w-full mt-3"
            >
              Weekly Reflection with Smartie
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No regretful purchases detected this week! 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );

  const WeeklyReflectionModal = () => (
    <AnimatePresence>
      {showReflection && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12">
                  <SmartieAnimated mood="thinking" size="lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Weekly Reflection</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Let's learn from this week together
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What was your biggest regret this week?
                  </label>
                  <Textarea 
                    placeholder="I wish I hadn't bought that expensive coffee every day..."
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What would you do differently?
                  </label>
                  <Textarea 
                    placeholder="I could have made coffee at home and saved £20..."
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Did this purchase improve your happiness? (1-10)
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate the happiness impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}/10 {num <= 3 ? "😔" : num <= 6 ? "😐" : "😊"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReflection(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={() => setShowReflection(false)}
                  className="flex-1"
                >
                  Get Smartie's Insight
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <PulseGlow color="purple" intensity="medium">
              <div className="w-16 h-16">
                <SmartieAnimated mood={smartieMood} size="lg" />
              </div>
            </PulseGlow>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">Smartie's AI Coach</h2>
                <Badge variant="secondary" className="text-xs">
                  {coachingStyles.find(s => s.id === coachingStyle)?.name}
                </Badge>
              </div>
              
              <motion.p 
                key={currentAdvice}
                className="text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentAdvice}
              </motion.p>

              <div className="flex gap-2">
                <Select value={coachingStyle} onValueChange={(value: any) => setCoachingStyle(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coachingStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        <div className="flex items-center gap-2">
                          <style.icon className="w-4 h-4" />
                          {style.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Weekly Performance Analysis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CountUp 
                from={0} 
                to={weeklySpent} 
                prefix="£" 
                className="text-lg font-bold text-blue-600"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">This Week</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-lg font-bold text-gray-600">£{lastWeekSpent.toFixed(0)}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Last Week</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className={`text-lg font-bold ${
                weeklySpent < lastWeekSpent ? 'text-green-600' : 'text-red-600'
              }`}>
                {weeklySpent < lastWeekSpent ? '↓' : '↑'} 
                {Math.abs(((weeklySpent - lastWeekSpent) / lastWeekSpent) * 100).toFixed(1)}%
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Change</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-lg font-bold text-purple-600">{currentStreak}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regret Radar */}
      <RegretRadarSection />

      {/* Weekly Reflection Modal */}
      <WeeklyReflectionModal />
    </div>
  );
}