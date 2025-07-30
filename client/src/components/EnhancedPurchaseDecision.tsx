import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  Brain,
  TrendingUp,
  Target,
  Clock,
  DollarSign,
  Heart,
  AlertTriangle,
  CheckCircle,
  Zap,
  Calculator,
  PiggyBank,
  ShoppingCart,
  Award
} from 'lucide-react';

interface EnhancedPurchaseDecisionProps {
  onDecision: (decision: {
    shouldBuy: boolean;
    confidence: number;
    reasoning: string[];
    alternatives: string[];
    goalImpact: number;
    smartnessScore: number;
  }) => void;
  userGoals: Array<{
    name: string;
    target: number;
    current: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  recentSpending: Array<{
    category: string;
    amount: number;
    regretLevel: number;
  }>;
  currentBudgets: Array<{
    category: string;
    spent: number;
    limit: number;
  }>;
}

export default function EnhancedPurchaseDecision({ 
  onDecision, 
  userGoals, 
  recentSpending, 
  currentBudgets 
}: EnhancedPurchaseDecisionProps) {
  const [purchaseData, setPurchaseData] = useState({
    item: '',
    cost: '',
    category: '',
    urgency: [5],
    desire: [7],
    usefulness: [6],
    alternatives: '',
    emotionalState: '',
    timeframe: 'now'
  });

  const [analysis, setAnalysis] = useState<{
    smartnessScore: number;
    recommendation: 'buy' | 'wait' | 'skip';
    confidence: number;
    reasoning: string[];
    goalImpact: Array<{
      goal: string;
      impact: number;
      delayWeeks: number;
    }>;
    alternativeSuggestions: string[];
    opportunityCost: number;
    regretProbability: number;
    valueScore: number;
  } | null>(null);

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);

  // Real-time analysis as user types
  useEffect(() => {
    if (purchaseData.item && purchaseData.cost) {
      generateAnalysis();
    }
  }, [purchaseData]);

  const generateAnalysis = () => {
    const cost = parseFloat(purchaseData.cost) || 0;
    const urgency = purchaseData.urgency[0];
    const desire = purchaseData.desire[0];
    const usefulness = purchaseData.usefulness[0];

    // Calculate smartness score (0-100)
    let smartnessScore = 50; // Base score

    // Urgency factor (lower urgency = higher score unless it's truly urgent)
    if (urgency <= 3) smartnessScore += 15; // Low urgency = good
    else if (urgency >= 8) smartnessScore += 10; // High urgency = necessary
    else smartnessScore -= 5; // Medium urgency = questionable

    // Desire vs usefulness ratio
    const rationalityRatio = usefulness / Math.max(desire, 1);
    if (rationalityRatio > 1.2) smartnessScore += 20; // High utility, controlled desire
    else if (rationalityRatio < 0.7) smartnessScore -= 15; // High desire, low utility

    // Budget impact analysis
    const categoryBudget = currentBudgets.find(b => b.category === purchaseData.category);
    if (categoryBudget) {
      const percentageOfBudget = (cost / categoryBudget.limit) * 100;
      const remainingBudget = categoryBudget.limit - categoryBudget.spent;
      
      if (cost > remainingBudget) smartnessScore -= 25; // Over budget
      else if (percentageOfBudget > 30) smartnessScore -= 10; // Large portion of budget
      else if (percentageOfBudget < 10) smartnessScore += 5; // Small impact
    }

    // Goal impact analysis
    const goalImpacts = userGoals.map(goal => {
      const impactPercentage = (cost / (goal.target - goal.current)) * 100;
      const delayWeeks = cost / ((goal.target - goal.current) / 20); // Assuming 20 weeks to goal
      
      if (goal.priority === 'high' && impactPercentage > 10) {
        smartnessScore -= 15;
      }
      
      return {
        goal: goal.name,
        impact: impactPercentage,
        delayWeeks: Math.round(delayWeeks * 10) / 10
      };
    });

    // Regret probability based on recent spending patterns
    const similarPurchases = recentSpending.filter(s => s.category === purchaseData.category);
    const avgRegret = similarPurchases.reduce((sum, s) => sum + s.regretLevel, 0) / similarPurchases.length || 0;
    const regretProbability = Math.min(avgRegret * 10 + (desire - usefulness) * 5, 100);
    
    if (regretProbability > 60) smartnessScore -= 10;

    // Emotional state impact
    if (purchaseData.emotionalState === 'stressed' || purchaseData.emotionalState === 'bored') {
      smartnessScore -= 15;
    } else if (purchaseData.emotionalState === 'happy' || purchaseData.emotionalState === 'calm') {
      smartnessScore += 5;
    }

    // Value score (usefulness per pound)
    const valueScore = Math.min((usefulness * 20) / cost, 100);

    // Final score adjustments
    smartnessScore = Math.max(0, Math.min(100, smartnessScore));

    // Generate recommendation
    let recommendation: 'buy' | 'wait' | 'skip';
    let confidence: number;

    if (smartnessScore >= 70) {
      recommendation = 'buy';
      confidence = smartnessScore;
    } else if (smartnessScore >= 40) {
      recommendation = 'wait';
      confidence = 100 - smartnessScore;
    } else {
      recommendation = 'skip';
      confidence = 100 - smartnessScore;
    }

    // Generate reasoning
    const reasoning: string[] = [];
    
    if (smartnessScore >= 70) {
      reasoning.push("✅ This purchase aligns well with your financial priorities");
      if (rationalityRatio > 1.2) reasoning.push("✅ High utility relative to emotional desire");
      if (urgency >= 8) reasoning.push("✅ High urgency suggests genuine need");
    } else if (smartnessScore >= 40) {
      reasoning.push("⏳ Consider waiting 24-48 hours before deciding");
      if (regretProbability > 50) reasoning.push("⚠️ Similar purchases led to regret recently");
      if (desire > usefulness + 2) reasoning.push("⚠️ Desire might be overriding practical need");
    } else {
      reasoning.push("❌ This purchase may not serve your financial goals");
      if (cost > (categoryBudget?.limit || 0) - (categoryBudget?.spent || 0)) {
        reasoning.push("❌ Would exceed your budget for this category");
      }
      if (goalImpacts.some(g => g.impact > 15)) {
        reasoning.push("❌ Significantly delays your priority goals");
      }
    }

    // Alternative suggestions
    const alternativeSuggestions: string[] = [];
    
    if (recommendation === 'skip' || recommendation === 'wait') {
      alternativeSuggestions.push(`Wait and save the £${cost} toward your ${userGoals[0]?.name || 'goals'}`);
      if (purchaseData.category === 'Entertainment') {
        alternativeSuggestions.push("Try a free alternative like reading, walking, or calling a friend");
      }
      if (cost > 50) {
        alternativeSuggestions.push("Look for a lower-cost version or wait for a sale");
      }
      alternativeSuggestions.push("Set a 'purchase fund' and save up specifically for this item");
    }

    // Opportunity cost calculation
    const opportunityCost = cost * 1.05; // Simple 5% opportunity cost

    setAnalysis({
      smartnessScore,
      recommendation,
      confidence,
      reasoning,
      goalImpact: goalImpacts,
      alternativeSuggestions,
      opportunityCost,
      regretProbability,
      valueScore
    });
  };

  const getRecommendationColor = () => {
    if (!analysis) return 'text-gray-600';
    switch (analysis.recommendation) {
      case 'buy': return 'text-green-600';
      case 'wait': return 'text-yellow-600';
      case 'skip': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSmartieReaction = () => {
    if (!analysis) return 'thinking';
    if (analysis.smartnessScore >= 70) return 'celebrating';
    if (analysis.smartnessScore <= 40) return 'concerned';
    return 'thinking';
  };

  const getScoreColor = () => {
    if (!analysis) return 'bg-gray-100 text-gray-800';
    if (analysis.smartnessScore >= 70) return 'bg-green-100 text-green-800';
    if (analysis.smartnessScore >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleSubmit = () => {
    if (analysis) {
      onDecision({
        shouldBuy: analysis.recommendation === 'buy',
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        alternatives: analysis.alternativeSuggestions,
        goalImpact: analysis.goalImpact.reduce((sum, g) => sum + g.impact, 0) / analysis.goalImpact.length,
        smartnessScore: analysis.smartnessScore
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <ModernSmartieAvatar mood={getSmartieReaction()} size="lg" />
              <div>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  Smart Purchase Decision
                </h2>
                <p className="text-blue-600 dark:text-blue-400">
                  Advanced AI analysis linked to your goals
                </p>
              </div>
            </div>
            
            {analysis && (
              <Badge className={`${getScoreColor()} border-0 px-4 py-2 text-lg`}>
                <Brain className="w-4 h-4 mr-2" />
                {analysis.smartnessScore}/100
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item">What are you considering buying?</Label>
                  <Input
                    id="item"
                    value={purchaseData.item}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, item: e.target.value }))}
                    placeholder="e.g., New smartphone, coffee machine..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cost">How much does it cost?</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="cost"
                      type="number"
                      value={purchaseData.cost}
                      onChange={(e) => setPurchaseData(prev => ({ ...prev, cost: e.target.value }))}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={purchaseData.category}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transport">Transport</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Emotional assessment sliders */}
                <div className="space-y-4">
                  <div>
                    <Label>How urgent is this purchase? (1-10)</Label>
                    <div className="mt-2">
                      <Slider
                        value={purchaseData.urgency}
                        onValueChange={(value) => setPurchaseData(prev => ({ ...prev, urgency: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Can wait months</span>
                        <span>{purchaseData.urgency[0]}</span>
                        <span>Need it now</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>How much do you want it? (1-10)</Label>
                    <div className="mt-2">
                      <Slider
                        value={purchaseData.desire}
                        onValueChange={(value) => setPurchaseData(prev => ({ ...prev, desire: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Don't really want</span>
                        <span>{purchaseData.desire[0]}</span>
                        <span>Really want</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>How useful will it be? (1-10)</Label>
                    <div className="mt-2">
                      <Slider
                        value={purchaseData.usefulness}
                        onValueChange={(value) => setPurchaseData(prev => ({ ...prev, usefulness: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Not very useful</span>
                        <span>{purchaseData.usefulness[0]}</span>
                        <span>Very useful</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>How are you feeling right now?</Label>
                  <select
                    value={purchaseData.emotionalState}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, emotionalState: e.target.value }))}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your mood</option>
                    <option value="happy">Happy 😊</option>
                    <option value="stressed">Stressed 😰</option>
                    <option value="bored">Bored 😴</option>
                    <option value="excited">Excited 🤩</option>
                    <option value="calm">Calm 😌</option>
                    <option value="sad">Sad 😢</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="space-y-6">
              <AnimatePresence>
                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Recommendation */}
                    <Card className={`p-4 border-2 ${
                      analysis.recommendation === 'buy' ? 'border-green-200 bg-green-50' :
                      analysis.recommendation === 'wait' ? 'border-yellow-200 bg-yellow-50' :
                      'border-red-200 bg-red-50'
                    }`}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-2 ${getRecommendationColor()}`}>
                          {analysis.recommendation === 'buy' && '✅ GO FOR IT'}
                          {analysis.recommendation === 'wait' && '⏳ WAIT & THINK'}
                          {analysis.recommendation === 'skip' && '❌ SKIP THIS ONE'}
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysis.confidence}% confidence in this recommendation
                        </p>
                      </div>
                    </Card>

                    {/* Quick metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="p-3 text-center">
                        <PiggyBank className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                        <p className="text-xs text-gray-600">Value Score</p>
                        <p className="font-semibold text-blue-600">{analysis.valueScore.toFixed(0)}/100</p>
                      </Card>
                      
                      <Card className="p-3 text-center">
                        <AlertTriangle className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                        <p className="text-xs text-gray-600">Regret Risk</p>
                        <p className="font-semibold text-orange-600">{analysis.regretProbability.toFixed(0)}%</p>
                      </Card>
                    </div>

                    {/* Reasoning */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Why I think this:
                      </h3>
                      <div className="space-y-2">
                        {analysis.reasoning.map((reason, index) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-gray-700"
                          >
                            {reason}
                          </motion.p>
                        ))}
                      </div>
                    </Card>

                    {/* Goal Impact */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Impact on Your Goals:
                      </h3>
                      <div className="space-y-2">
                        {analysis.goalImpact.map((impact, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{impact.goal}</span>
                            <span className={`font-semibold ${
                              impact.impact > 15 ? 'text-red-600' :
                              impact.impact > 5 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {impact.delayWeeks > 0 ? `+${impact.delayWeeks} weeks` : 'No delay'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Alternatives */}
                    {analysis.alternativeSuggestions.length > 0 && (
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Smart Alternatives:
                        </h3>
                        <div className="space-y-2">
                          {analysis.alternativeSuggestions.map((alternative, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-sm text-blue-700 bg-blue-50 p-2 rounded"
                            >
                              💡 {alternative}
                            </motion.p>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                      >
                        Accept Recommendation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                        className="flex items-center gap-2"
                      >
                        <Calculator className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}