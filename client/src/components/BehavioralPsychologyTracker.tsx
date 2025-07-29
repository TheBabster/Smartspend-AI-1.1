import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Heart, Clock, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import SmartieAnimated from "./SmartieAnimated";
import { staggerContainer, staggerItem } from "./MicroAnimations";

interface ConflictPurchase {
  id: string;
  item: string;
  amount: number;
  utilityLevel: number; // 1-5
  desireLevel: number; // 1-5
  timestamp: Date;
  emotionalTrigger: "boredom" | "stress" | "fomo" | "social_comparison" | "comfort" | "celebration";
  followUpResponse?: {
    wasWorthIt: number; // 1-5
    feedback: string;
    weekAfterReview: Date;
  };
}

interface PsychologicalProfile {
  primaryTriggers: string[];
  spendingPatterns: {
    timeOfDay: string;
    dayOfWeek: string;
    mostVulnerableState: string;
  };
  improvementAreas: string[];
  strengths: string[];
}

interface BehavioralPsychologyTrackerProps {
  recentDecisions: any[];
}

export default function BehavioralPsychologyTracker({ recentDecisions }: BehavioralPsychologyTrackerProps) {
  const [conflictPurchases, setConflictPurchases] = useState<ConflictPurchase[]>([]);
  const [showConflictForm, setShowConflictForm] = useState(false);
  const [psychProfile, setPsychProfile] = useState<PsychologicalProfile | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<ConflictPurchase | null>(null);

  // Generate psychological profile based on past decisions
  const generatePsychologicalProfile = (): PsychologicalProfile => {
    const triggers = ["stress", "boredom", "fomo", "social_comparison"];
    const triggerCounts = triggers.reduce((acc, trigger) => {
      acc[trigger] = conflictPurchases.filter(p => p.emotionalTrigger === trigger).length;
      return acc;
    }, {} as Record<string, number>);

    const sortedTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([trigger]) => trigger);

    return {
      primaryTriggers: sortedTriggers.slice(0, 2),
      spendingPatterns: {
        timeOfDay: "Evening (8-10 PM)", // Would be calculated from actual data
        dayOfWeek: "Sunday",
        mostVulnerableState: sortedTriggers[0] || "stress"
      },
      improvementAreas: [
        "Implement 48-hour rule for non-essential purchases",
        "Create alternative stress-relief activities",
        "Set spending limits for emotional states"
      ],
      strengths: [
        "Good at tracking spending decisions",
        "Willing to reflect on purchases",
        "Shows awareness of emotional triggers"
      ]
    };
  };

  useEffect(() => {
    // Simulate some conflict purchases for demo
    const mockConflicts: ConflictPurchase[] = [
      {
        id: "1",
        item: "Designer coffee mug",
        amount: 45,
        utilityLevel: 2,
        desireLevel: 4,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        emotionalTrigger: "stress",
        followUpResponse: {
          wasWorthIt: 2,
          feedback: "I realized I already have plenty of mugs and this was just stress shopping",
          weekAfterReview: new Date()
        }
      },
      {
        id: "2",
        item: "Impulse online course",
        amount: 99,
        utilityLevel: 3,
        desireLevel: 5,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        emotionalTrigger: "fomo"
      }
    ];

    setConflictPurchases(mockConflicts);
    setPsychProfile(generatePsychologicalProfile());
  }, []);

  const addConflictPurchase = (purchase: Omit<ConflictPurchase, 'id' | 'timestamp'>) => {
    const newPurchase: ConflictPurchase = {
      ...purchase,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setConflictPurchases(prev => [...prev, newPurchase]);
    setShowConflictForm(false);
  };

  const submitFollowUp = (conflictId: string, response: ConflictPurchase['followUpResponse']) => {
    setConflictPurchases(prev => 
      prev.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, followUpResponse: response }
          : conflict
      )
    );
    setSelectedConflict(null);
  };

  const getConflictLevel = (utility: number, desire: number) => {
    const conflict = desire - utility;
    if (conflict >= 3) return { level: "High", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" };
    if (conflict >= 1) return { level: "Medium", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" };
    return { level: "Low", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" };
  };

  const getTriggerIcon = (trigger: ConflictPurchase['emotionalTrigger']) => {
    switch (trigger) {
      case "stress": return "😰";
      case "boredom": return "😴";
      case "fomo": return "😱";
      case "social_comparison": return "👥";
      case "comfort": return "🤗";
      case "celebration": return "🎉";
      default: return "❓";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Behavioral Psychology Tracker</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Understand your spending patterns and emotional triggers
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setShowConflictForm(true)}
            className="w-full"
          >
            Log a Conflict Purchase
          </Button>
        </CardContent>
      </Card>

      {/* Psychological Profile */}
      {psychProfile && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Your Psychological Spending Profile
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-red-600">Primary Triggers</h4>
                <div className="space-y-2">
                  {psychProfile.primaryTriggers.map((trigger, index) => (
                    <div key={trigger} className="flex items-center gap-2">
                      <span className="text-lg">{getTriggerIcon(trigger as any)}</span>
                      <span className="capitalize">{trigger.replace('_', ' ')}</span>
                      {index === 0 && <Badge variant="destructive" className="text-xs">Most Common</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-blue-600">Spending Patterns</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Peak time:</strong> {psychProfile.spendingPatterns.timeOfDay}</div>
                  <div><strong>Vulnerable day:</strong> {psychProfile.spendingPatterns.dayOfWeek}</div>
                  <div><strong>Main trigger:</strong> {psychProfile.spendingPatterns.mostVulnerableState}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-orange-600">Improvement Areas</h4>
                <ul className="space-y-1 text-sm">
                  {psychProfile.improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-green-600">Your Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {psychProfile.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conflict Purchases */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Utility vs Desire Conflicts
          </h3>

          <div className="space-y-4">
            {conflictPurchases.map((conflict) => {
              const conflictLevel = getConflictLevel(conflict.utilityLevel, conflict.desireLevel);
              const needsFollowUp = !conflict.followUpResponse && 
                new Date().getTime() - conflict.timestamp.getTime() > 7 * 24 * 60 * 60 * 1000;

              return (
                <motion.div
                  key={conflict.id}
                  className={`p-4 rounded-lg border ${conflictLevel.bg} border-gray-200 dark:border-gray-700`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{conflict.item}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        £{conflict.amount} • {conflict.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={conflictLevel.color}>
                        {conflictLevel.level} Conflict
                      </Badge>
                      <span className="text-lg">{getTriggerIcon(conflict.emotionalTrigger)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Utility</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < conflict.utilityLevel 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Desire</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < conflict.desireLevel 
                                ? 'bg-red-500' 
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {conflict.followUpResponse ? (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Week Later Review</span>
                        <Badge variant="secondary">
                          Worth it: {conflict.followUpResponse.wasWorthIt}/5
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {conflict.followUpResponse.feedback}
                      </p>
                    </div>
                  ) : needsFollowUp ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedConflict(conflict)}
                      className="w-full"
                    >
                      Review After 1 Week
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Review available in {Math.ceil((7 * 24 * 60 * 60 * 1000 - (new Date().getTime() - conflict.timestamp.getTime())) / (24 * 60 * 60 * 1000))} days
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Conflict Form Modal */}
      {showConflictForm && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Log Conflict Purchase</h3>
              {/* Form implementation would go here */}
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConflictForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Log Purchase
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Follow-up Review Modal */}
      {selectedConflict && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">One Week Review</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                How do you feel about purchasing "{selectedConflict.item}" now?
              </p>
              {/* Review form implementation would go here */}
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedConflict(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}