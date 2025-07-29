import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface MoodSpendingData {
  mood: string;
  emoji: string;
  totalSpent: number;
  averageUtility: number;
  purchaseCount: number;
  categories: string[];
}

interface EmotionalSpendingTrackerProps {
  moodData: MoodSpendingData[];
  onMoodSelect?: (mood: string) => void;
}

const EmotionalSpendingTracker: React.FC<EmotionalSpendingTrackerProps> = ({
  moodData,
  onMoodSelect
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    { mood: "happy", emoji: "😊", label: "Happy" },
    { mood: "sad", emoji: "😢", label: "Sad" },
    { mood: "stressed", emoji: "😰", label: "Stressed" },
    { mood: "excited", emoji: "🤩", label: "Excited" },
    { mood: "bored", emoji: "😐", label: "Bored" },
    { mood: "angry", emoji: "😠", label: "Angry" }
  ];

  const getHighestSpendingMood = () => {
    if (moodData.length === 0) return null;
    return moodData.reduce((highest, current) => 
      current.totalSpent > highest.totalSpent ? current : highest
    );
  };

  const getSmartieInsight = () => {
    const highestMood = getHighestSpendingMood();
    if (!highestMood) return null;

    const insights = {
      sad: "You spend 3x more when feeling down. Try a walk or call a friend instead! 🌟",
      stressed: "Stress shopping detected! Deep breaths and a 10-minute wait might save you money. 🧘‍♀️",
      bored: "Boredom leads to impulse buys. Try a hobby or quick workout first! 🏃‍♂️",
      excited: "Excitement spending! Channel that energy into saving for bigger goals! 🎯",
      angry: "Angry purchases rarely bring joy. Take a pause and revisit later. ⏰",
      happy: "Happy spending is usually smarter, but watch those celebration splurges! 🎉"
    };

    return insights[highestMood.mood as keyof typeof insights] || "Interesting spending pattern detected!";
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: "bg-green-100 text-green-800 border-green-200",
      sad: "bg-blue-100 text-blue-800 border-blue-200",
      stressed: "bg-red-100 text-red-800 border-red-200",
      excited: "bg-purple-100 text-purple-800 border-purple-200",
      bored: "bg-gray-100 text-gray-800 border-gray-200",
      angry: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[mood as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Mood Selector */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🧠 How are you feeling today?
          </CardTitle>
          <p className="text-gray-600">Track your mood to understand spending patterns</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moodOptions.map(({ mood, emoji, label }) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                onClick={() => {
                  setSelectedMood(mood);
                  onMoodSelect?.(mood);
                }}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Spending Analysis */}
      {moodData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">
                  📊 Your Emotional Spending Patterns
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowAnalysis(!showAnalysis)}
                >
                  {showAnalysis ? "Hide" : "Show"} Analysis
                </Button>
              </div>
            </CardHeader>
            
            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="space-y-6">
                    {/* Smartie's Insight */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-start gap-4">
                        <ExactSmartieAvatar
                          mood="thinking"
                          size="md"
                          animated={true}
                          animationType="thinking"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Smartie's Emotional Intelligence</h4>
                          <p className="text-gray-800 font-medium">{getSmartieInsight()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mood Spending Breakdown */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900">Spending by Mood</h4>
                      <div className="grid gap-4">
                        {moodData
                          .sort((a, b) => b.totalSpent - a.totalSpent)
                          .map((data) => (
                            <div
                              key={data.mood}
                              className={`p-4 rounded-lg border-2 ${getMoodColor(data.mood)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{data.emoji}</span>
                                  <span className="font-bold capitalize">{data.mood}</span>
                                </div>
                                <span className="text-xl font-bold">£{data.totalSpent.toFixed(2)}</span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <Badge variant="outline">
                                  {data.purchaseCount} purchases
                                </Badge>
                                <Badge variant="outline">
                                  Avg utility: {data.averageUtility.toFixed(1)}/10
                                </Badge>
                                <div className="flex gap-1">
                                  {data.categories.slice(0, 3).map(category => (
                                    <Badge key={category} variant="secondary" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-current h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(100, (data.totalSpent / Math.max(...moodData.map(m => m.totalSpent))) * 100)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                      <h4 className="font-bold text-gray-900 mb-2">💡 Smartie's Tips</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Wait 10 minutes before emotional purchases</li>
                        <li>• Set mood-based spending limits</li>
                        <li>• Find free alternatives to stress relief</li>
                        <li>• Celebrate wins without overspending</li>
                      </ul>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmotionalSpendingTracker;