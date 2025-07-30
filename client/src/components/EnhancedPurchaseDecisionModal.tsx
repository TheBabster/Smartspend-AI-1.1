import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ModernSmartieAvatar from "./ModernSmartieAvatar";
import { Brain, ShoppingCart, Clock, DollarSign, Target, Lightbulb, ChevronDown, ChevronUp, BarChart3, Award, Eye, MessageSquare, Sparkles, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { type Budget } from "@shared/schema";

interface EnhancedPurchaseDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DecisionResponse {
  recommendation: 'yes' | 'think_again' | 'no';
  reasoning: string;
  confidence: number;
  emotional_insight: string;
  financial_impact: string;
  alternatives?: string[];
  budget_impact: {
    category_percentage: number;
    total_budget_impact: number;
    remaining_budget: number;
  };
  simulated_effects: {
    wellness_score_change: number;
    streak_risk: boolean;
    goal_impact: string;
  };
  badge_eligible?: string;
}

export default function EnhancedPurchaseDecisionModal({ open, onOpenChange }: EnhancedPurchaseDecisionModalProps) {
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [desireLevel, setDesireLevel] = useState([5]);
  const [urgency, setUrgency] = useState([3]);
  const [reasoning, setReasoning] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [showReasoningDetails, setShowReasoningDetails] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [followedDecision, setFollowedDecision] = useState<boolean | null>(null);
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [reflectionReason, setReflectionReason] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch current budgets for impact simulation
  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ["/api/budgets"] });

  const createDecisionMutation = useMutation({
    mutationFn: async (decisionData: any) => {
      const response = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decisionData),
      });
      if (!response.ok) throw new Error('Failed to save decision');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
      toast({
        title: "Decision recorded!",
        description: "Your purchase decision has been saved.",
      });
    },
  });

  const analyzeDecision = async () => {
    if (!itemName || !amount || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with sophisticated decision logic
    setTimeout(() => {
      const amountNum = parseFloat(amount);
      const desire = desireLevel[0];
      const urgencyLevel = urgency[0];
      
      let recommendation: 'yes' | 'think_again' | 'no';
      let confidence = 0;
      let smartieMood: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'proud' = 'thinking';
      
      // Decision algorithm
      const score = (desire * 0.4) + (urgencyLevel * 0.3) + (amountNum < 50 ? 0.3 : amountNum < 200 ? 0.2 : 0.1) * 10;
      
      if (score >= 7) {
        recommendation = 'yes';
        confidence = 85 + Math.random() * 10;
        smartieMood = 'happy';
      } else if (score >= 4) {
        recommendation = 'think_again';
        confidence = 70 + Math.random() * 15;
        smartieMood = 'thinking';
      } else {
        recommendation = 'no';
        confidence = 80 + Math.random() * 15;
        smartieMood = 'concerned';
      }

      const mockDecision: DecisionResponse = {
        recommendation,
        confidence: Math.round(confidence),
        reasoning: getReasoningText(recommendation, amountNum, desire, urgencyLevel),
        emotional_insight: getEmotionalInsight(recommendation, desire),
        financial_impact: getFinancialImpact(recommendation, amountNum),
        alternatives: recommendation !== 'yes' ? getAlternatives(itemName, category) : undefined,
        budget_impact: getBudgetImpact(amountNum, category),
        simulated_effects: getSimulatedEffects(recommendation, amountNum),
        badge_eligible: getBadgeEligibility(recommendation, desire, urgencyLevel)
      };

      setDecision(mockDecision);
      setIsAnalyzing(false);
    }, 3000); // 3-second analysis
  };

  const getReasoningText = (rec: string, amount: number, desire: number, urgency: number) => {
    const reasons = {
      yes: [
        `This purchase aligns well with your current budget and desires. At £${amount}, it's within a reasonable range for ${category.toLowerCase()}.`,
        `Your high desire level (${desire}/10) and urgency (${urgency}/10) suggest this is something you've thought about carefully.`,
        `This seems like a worthwhile investment that you'll appreciate and use regularly.`
      ],
      think_again: [
        `While this isn't a terrible purchase, I'd suggest sleeping on it for 24 hours.`,
        `Your desire level is moderate (${desire}/10), which might indicate impulse rather than genuine need.`,
        `Consider if £${amount} could be better used toward your savings goals right now.`
      ],
      no: [
        `I'd recommend skipping this purchase for now. Your desire and urgency levels suggest this might be impulse-driven.`,
        `£${amount} could make a bigger impact in your emergency fund or towards your financial goals.`,
        `This doesn't seem essential right now, and you might regret it later.`
      ]
    };
    return reasons[rec as keyof typeof reasons][Math.floor(Math.random() * 3)];
  };

  const getEmotionalInsight = (rec: string, desire: number) => {
    if (rec === 'yes') return "You seem genuinely excited about this - that positive emotion can lead to long-term satisfaction!";
    if (rec === 'think_again') return desire > 6 ? "Your strong desire might be clouding your judgment. Take a step back!" : "You seem unsure - trust that instinct!";
    return "I sense some impulsiveness here. Your future self will thank you for showing restraint!";
  };

  const getFinancialImpact = (rec: string, amount: number) => {
    if (rec === 'yes') return `This £${amount} investment fits your budget and won't derail your financial goals.`;
    if (rec === 'think_again') return `Delaying this £${amount} purchase for a month could boost your savings by the same amount.`;
    return `Skipping this £${amount} purchase means you can put that money toward your emergency fund or debt reduction!`;
  };

  const getBudgetImpact = (amount: number, cat: string) => {
    const categoryBudget = budgets.find(b => b.category === cat);
    const categorySpent = parseFloat(categoryBudget?.spent || "0");
    const categoryLimit = parseFloat(categoryBudget?.monthlyLimit || "500");
    
    return {
      category_percentage: ((categorySpent + amount) / categoryLimit) * 100,
      total_budget_impact: (amount / 2000) * 100, // Assuming £2000 total budget
      remaining_budget: categoryLimit - categorySpent - amount
    };
  };

  const getSimulatedEffects = (rec: string, amount: number) => {
    return {
      wellness_score_change: rec === 'yes' ? 2 : rec === 'think_again' ? -1 : -5,
      streak_risk: rec === 'no' && amount > 100,
      goal_impact: rec === 'yes' ? "minimal impact" : rec === 'think_again' ? "moderate delay" : "significant setback"
    };
  };

  const getBadgeEligibility = (rec: string, desire: number, urgency: number) => {
    if (rec === 'think_again' && desire > 7) return "Impulse Control Master";
    if (rec === 'yes' && urgency > 8) return "Strategic Spender";
    if (rec === 'no' && desire > 8) return "Budget Guardian";
    return undefined;
  };

  const getAlternatives = (item: string, cat: string) => {
    const categoryAlternatives = {
      'Food & Dining': [
        'Cook a special meal at home for half the cost',
        'Try a new recipe with ingredients you have',
        'Organize a potluck with friends',
        'Look for restaurant deals and coupons'
      ],
      'Shopping': [
        'Check if you already own something similar',
        'Browse second-hand marketplaces first',
        'Set a price alert for sales notifications',
        'Compare prices across 3+ retailers'
      ],
      'Entertainment': [
        'Find free events and activities nearby',
        'Host a game or movie night at home',
        'Try a new hobby using free resources',
        'Visit free museums or galleries'
      ],
      'Transport': [
        'Walk or cycle for better health',
        'Use public transport with a day pass',
        'Combine multiple errands into one trip',
        'Consider carpooling with friends'
      ],
      'Utilities': [
        'Review and switch to cheaper providers',
        'Reduce usage with energy-saving habits',
        'Look into government energy assistance',
        'Negotiate a better rate with current provider'
      ],
      'Other': [
        'Search for quality second-hand options',
        'Ask friends if they have one to borrow',
        'Check library or community resources',
        'Wait for seasonal sales and discounts'
      ]
    };
    
    return categoryAlternatives[cat as keyof typeof categoryAlternatives] || categoryAlternatives['Other'];
  };

  const handleSubmit = () => {
    if (!decision) return;
    
    createDecisionMutation.mutate({
      itemName,
      amount: parseFloat(amount),
      category,
      desireLevel: desireLevel[0],
      urgency: urgency[0],
      recommendation: decision.recommendation,
      reasoning: decision.reasoning,
    });

    // Reset form
    setItemName("");
    setAmount("");
    setCategory("");
    setDesireLevel([5]);
    setUrgency([3]);
    setReasoning("");
    setDecision(null);
    onOpenChange(false);
  };

  const getSmartieProps = () => {
    if (isAnalyzing) return { mood: 'thinking' as const, showCoin: false };
    if (!decision) return { mood: 'happy' as const, showCoin: false };
    
    const moodMap = {
      yes: 'celebrating' as const,
      think_again: 'thinking' as const,
      no: 'concerned' as const
    };
    
    return { 
      mood: moodMap[decision.recommendation], 
      showCoin: decision.recommendation === 'no' 
    };
  };

  const getRecommendationColor = (rec: string) => {
    const colors = {
      yes: 'text-green-600 dark:text-green-400',
      think_again: 'text-yellow-600 dark:text-yellow-400',
      no: 'text-red-600 dark:text-red-400'
    };
    return colors[rec as keyof typeof colors];
  };

  const getRecommendationIcon = (rec: string) => {
    const icons = {
      yes: '✅',
      think_again: '🤔',
      no: '❌'
    };
    return icons[rec as keyof typeof icons];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={16} />
            </div>
            Smart Purchase Decision
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Smartie Assistant */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-4">
              <ModernSmartieAvatar 
                mood={isAnalyzing ? 'thinking' : decision ? (decision.recommendation === 'yes' ? 'celebrating' : decision.recommendation === 'think_again' ? 'thinking' : 'concerned') : 'happy'}
                size="lg"
              />
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Let me analyze this purchase for you... I'm considering your budget, emotional state, and financial goals.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </motion.div>
                  ) : decision ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getRecommendationIcon(decision.recommendation)}</span>
                        <h3 className={`font-semibold ${getRecommendationColor(decision.recommendation)}`}>
                          {decision.recommendation === 'yes' ? 'Go for it!' : 
                           decision.recommendation === 'think_again' ? 'Maybe wait a bit?' : 
                           'I\'d skip this one'}
                        </h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          {decision.confidence}% confident
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {decision.reasoning}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="initial"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Hi! I'm here to help you make smart spending decisions. Tell me what you're thinking of buying!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>

          {/* Purchase Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">What are you buying?</Label>
              <Input
                id="itemName"
                placeholder="e.g., Wireless headphones"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">How much does it cost?</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Dining">🍽️ Food & Dining</SelectItem>
                  <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
                  <SelectItem value="Entertainment">🎭 Entertainment</SelectItem>
                  <SelectItem value="Transport">🚗 Transport</SelectItem>
                  <SelectItem value="Utilities">⚡ Utilities</SelectItem>
                  <SelectItem value="Other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Why do you want this?</Label>
              <Input
                placeholder="e.g., My current ones are broken"
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
              />
            </div>
          </div>

          {/* Emotional Assessment */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                How much do you want this? (1 = meh, 10 = must have!)
              </Label>
              <Slider
                value={desireLevel}
                onValueChange={setDesireLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>😐 Meh</span>
                <span className="font-medium">Desire: {desireLevel[0]}/10</span>
                <span>🤩 Must have!</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                How urgent is this? (1 = can wait, 10 = need it now!)
              </Label>
              <Slider
                value={urgency}
                onValueChange={setUrgency}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>⏰ Can wait</span>
                <span className="font-medium">Urgency: {urgency[0]}/10</span>
                <span>🚨 Need now!</span>
              </div>
            </div>
          </div>

          {/* Enhanced Decision Results */}
          <AnimatePresence>
            {decision && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* AI Reasoning Transparency */}
                <Card className="p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                      Why this recommendation?
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReasoningDetails(!showReasoningDetails)}
                      className="h-8 px-2"
                    >
                      {showReasoningDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showReasoningDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <p>• Your desire level: {desireLevel[0]}/10 - {desireLevel[0] > 7 ? "High impulse risk" : "Reasonable want"}</p>
                        <p>• Urgency: {urgency[0]}/10 - {urgency[0] > 6 ? "Time-sensitive" : "Can wait"}</p>
                        <p>• Budget impact: {decision.budget_impact.category_percentage.toFixed(1)}% of {category} budget</p>
                        <p>• Remaining after purchase: £{decision.budget_impact.remaining_budget.toFixed(2)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Simulate Purchase Impact */}
                <Card className="p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                      <Eye size={16} />
                      Preview Impact
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSimulation(!showSimulation)}
                      className="h-8 px-2"
                    >
                      {showSimulation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showSimulation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-sm">Financial Wellness Score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">75</span>
                            <motion.span
                              className={`text-sm ${decision.simulated_effects.wellness_score_change > 0 ? 'text-green-500' : 'text-red-500'}`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              {decision.simulated_effects.wellness_score_change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              {decision.simulated_effects.wellness_score_change > 0 ? '+' : ''}{decision.simulated_effects.wellness_score_change}
                            </motion.span>
                          </div>
                        </div>
                        
                        {decision.simulated_effects.streak_risk && (
                          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <AlertTriangle size={16} className="text-red-500" />
                            <span className="text-sm text-red-700 dark:text-red-300">This could break your budget streak!</span>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Goal impact: {decision.simulated_effects.goal_impact}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Badge Eligibility */}
                {decision.badge_eligible && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award size={20} className="text-yellow-600" />
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">Badge Eligible!</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{decision.badge_eligible}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Better Alternatives & Smart Suggestions */}
          <AnimatePresence>
            {decision?.alternatives && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Better Alternative Suggestions */}
                {decision.recommendation === 'think_again' && (
                  <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Better Approach</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg">
                            <Clock size={16} className="text-yellow-600" />
                            <span className="text-sm text-yellow-800 dark:text-yellow-200">
                              Wait 10 days and revisit this item
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg">
                            <BarChart3 size={16} className="text-yellow-600" />
                            <span className="text-sm text-yellow-800 dark:text-yellow-200">
                              Set a price alert for better deals
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Smart Alternatives */}
                <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                        {decision.recommendation === 'think_again' ? 'Consider These Instead' : 'Smart Alternatives'}
                      </h4>
                      <div className="space-y-2">
                        {decision.alternatives.map((alt, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-2 p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700/40 transition-colors cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                            <span className="text-sm text-purple-700 dark:text-purple-300">{alt}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!decision ? (
              <Button 
                onClick={analyzeDecision} 
                disabled={isAnalyzing || !itemName || !amount || !category}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Get Smartie's Advice
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDecision(null)} className="flex-1">
                  Ask Again
                </Button>
                <Button 
                  onClick={() => setShowReflectionPrompt(true)} 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  I Followed This
                </Button>
              </>
            )}
          </div>

          {/* Post-Decision Reflection Prompt */}
          <AnimatePresence>
            {showReflectionPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowReflectionPrompt(false)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md mx-4"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <div className="text-center mb-4">
                    <ModernSmartieAvatar mood="happy" size="md" />
                    <h3 className="font-semibold text-lg mt-2">What made you follow this advice?</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { emoji: "😇", text: "I want to save", reason: "saving_focused" },
                      { emoji: "😬", text: "Budget is tight", reason: "budget_constraint" },
                      { emoji: "🤷", text: "I'll wait for better deal", reason: "timing_strategy" },
                      { emoji: "🧠", text: "Smartie convinced me", reason: "ai_guidance" }
                    ].map((option) => (
                      <motion.button
                        key={option.reason}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setReflectionReason(option.reason);
                          handleReflectionSubmit(option.reason);
                        }}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div>{option.text}</div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowReflectionPrompt(false)} className="flex-1">
                      Skip
                    </Button>
                    <Button 
                      onClick={() => handleReflectionSubmit("other")}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Tell More
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );

  const handleReflectionSubmit = async (reason: string) => {
    try {
      await createDecisionMutation.mutateAsync({
        itemName,
        amount: parseFloat(amount),
        category,
        desireLevel: desireLevel[0],
        urgency: urgency[0],
        reasoning,
        recommendation: decision?.recommendation,
        followed: true,
        reflection_reason: reason,
        createdAt: new Date().toISOString()
      });
      
      setShowReflectionPrompt(false);
      onOpenChange(false);
      
      toast({
        title: "Decision recorded!",
        description: "Your purchase decision and reflection have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save decision. Please try again.",
        variant: "destructive",
      });
    }
  };
}