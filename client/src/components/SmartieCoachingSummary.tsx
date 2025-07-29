import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ExactSmartieAvatar from './ExactSmartieAvatar';
import CollapsibleCategoryView from './CollapsibleCategoryView';

interface PurchaseAnalysis {
  smart: number;
  borderline: number;
  regret: number;
  totalSpent: number;
  patterns: string[];
}

interface SmartieCoachingSummaryProps {
  weeklyAnalysis: PurchaseAnalysis;
  recentPurchases: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    utilityScore: number;
    timestamp: string;
    mood?: string;
  }>;
}

const SmartieCoachingSummary: React.FC<SmartieCoachingSummaryProps> = ({
  weeklyAnalysis,
  recentPurchases
}) => {
  const [showCompactView, setShowCompactView] = React.useState(false);
  const getSmartieMessage = () => {
    const { smart, borderline, regret } = weeklyAnalysis;
    const total = smart + borderline + regret;
    
    if (smart >= total * 0.7) {
      return {
        message: `Brilliant! ${smart} smart purchases this week. You're becoming a financial wizard! 🧙‍♂️`,
        mood: "celebrating" as const,
        bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
      };
    } else if (regret >= total * 0.5) {
      return {
        message: `You made ${total} purchases this week. ${regret} were impulse buys. Let's tighten it up! 💪`,
        mood: "concerned" as const,
        bgColor: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
      };
    } else {
      return {
        message: `${smart} smart, ${borderline} borderline, ${regret} impulse buys. Good balance, room to improve! 🎯`,
        mood: "thinking" as const,
        bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
      };
    }
  };

  const coachingData = getSmartieMessage();

  const getCategoryBreakdown = () => {
    const categories = recentPurchases.reduce((acc, purchase) => {
      const category = purchase.category;
      if (!acc[category]) {
        acc[category] = { smart: 0, borderline: 0, regret: 0, total: 0 };
      }
      
      if (purchase.utilityScore >= 8) acc[category].smart++;
      else if (purchase.utilityScore >= 5) acc[category].borderline++;
      else acc[category].regret++;
      
      acc[category].total += purchase.amount;
      return acc;
    }, {} as Record<string, {smart: number, borderline: number, regret: number, total: number}>);

    return Object.entries(categories);
  };

  const getUtilityColor = (score: number) => {
    if (score >= 8) return "💚 text-green-700 bg-green-100";
    if (score >= 5) return "🟡 text-yellow-700 bg-yellow-100";
    return "🔴 text-red-700 bg-red-100";
  };

  const getTimeBasedGroups = () => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      today: recentPurchases.filter(p => new Date(p.timestamp).toDateString() === today),
      thisWeek: recentPurchases.filter(p => new Date(p.timestamp) >= thisWeek),
      older: recentPurchases.filter(p => new Date(p.timestamp) < thisWeek)
    };
  };

  const timeGroups = getTimeBasedGroups();
  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="space-y-6">
      {/* Smartie Coaching Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${coachingData.bgColor} border-2`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ExactSmartieAvatar
                mood={coachingData.mood}
                size="lg"
                animated={true}
                animationType={coachingData.mood === "celebrating" ? "milestone" : "thinking"}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smartie's Weekly Coaching</h3>
                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                  {coachingData.message}
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    💚 {weeklyAnalysis.smart} Smart
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    🟡 {weeklyAnalysis.borderline} Borderline
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                    🔴 {weeklyAnalysis.regret} Regret Zone
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Tabbed View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="time" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="time">📅 By Time</TabsTrigger>
                  <TabsTrigger value="category">🏷️ By Category</TabsTrigger>
                  <TabsTrigger value="utility">⭐ By Smartness</TabsTrigger>
                  <TabsTrigger value="collapsible">📁 Collapsible</TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompactView(!showCompactView)}
                  className="text-xs"
                >
                  {showCompactView ? "Full View" : "Compact View"}
                </Button>
              </div>

              <TabsContent value="time" className="mt-6">
                <div className="space-y-4">
                  {/* Today */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      🌅 Today ({timeGroups.today.length} purchases)
                    </h4>
                    {timeGroups.today.length > 0 ? (
                      <div className="space-y-2">
                        {timeGroups.today.map(purchase => (
                          <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm px-2 py-1 rounded-full font-medium ${getUtilityColor(purchase.utilityScore)}`}>
                                {purchase.utilityScore}/10
                              </span>
                              <span className="font-medium text-gray-900">{purchase.name}</span>
                              <Badge variant="outline">{purchase.category}</Badge>
                            </div>
                            <span className="font-bold text-gray-900">£{purchase.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No purchases today - well done! 🎉</p>
                    )}
                  </div>

                  {/* This Week */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      📊 This Week ({timeGroups.thisWeek.length} purchases)
                    </h4>
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                      {timeGroups.thisWeek.slice(0, 10).map(purchase => (
                        <div key={purchase.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getUtilityColor(purchase.utilityScore)}`}>
                              {purchase.utilityScore}/10
                            </span>
                            <span className="text-sm font-medium text-gray-900">{purchase.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">£{purchase.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="category" className="mt-6">
                <div className="space-y-4">
                  {categoryBreakdown.map(([category, data]) => (
                    <div key={category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{category}</h4>
                        <span className="text-lg font-bold text-gray-900">£{data.total.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800">💚 {data.smart}</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">🟡 {data.borderline}</Badge>
                        <Badge className="bg-red-100 text-red-800">🔴 {data.regret}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="utility" className="mt-6">
                <div className="space-y-4">
                  {/* Smart Purchases */}
                  <div>
                    <h4 className="text-lg font-bold text-green-700 mb-2">💚 Smart Purchases (8-10/10)</h4>
                    <div className="space-y-2">
                      {recentPurchases.filter(p => p.utilityScore >= 8).map(purchase => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-700">{purchase.utilityScore}/10</span>
                            <span className="font-medium text-gray-900">{purchase.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">£{purchase.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Borderline Purchases */}
                  <div>
                    <h4 className="text-lg font-bold text-yellow-700 mb-2">🟡 Think Again (5-7/10)</h4>
                    <div className="space-y-2">
                      {recentPurchases.filter(p => p.utilityScore >= 5 && p.utilityScore < 8).map(purchase => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-yellow-700">{purchase.utilityScore}/10</span>
                            <span className="font-medium text-gray-900">{purchase.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">£{purchase.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regret Zone */}
                  <div>
                    <h4 className="text-lg font-bold text-red-700 mb-2">🔴 Regret Zone (1-4/10)</h4>
                    <div className="space-y-2">
                      {recentPurchases.filter(p => p.utilityScore < 5).map(purchase => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-700">{purchase.utilityScore}/10</span>
                            <span className="font-medium text-gray-900">{purchase.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">£{purchase.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collapsible" className="mt-6">
                <CollapsibleCategoryView
                  purchases={recentPurchases}
                  showCompactView={showCompactView}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SmartieCoachingSummary;