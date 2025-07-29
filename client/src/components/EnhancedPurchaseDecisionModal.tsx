import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SmartieAnimated from "./SmartieAnimated";
import { Brain, ShoppingCart, Clock, DollarSign, Target, Lightbulb } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        alternatives: recommendation !== 'yes' ? getAlternatives(itemName, category) : undefined
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

  const getAlternatives = (item: string, cat: string) => {
    const alternatives = {
      'Food & Dining': ['Cook a special meal at home', 'Try a new recipe instead', 'Have a picnic'],
      'Shopping': ['Check if you already own something similar', 'Browse free alternatives online', 'Wait for a sale'],
      'Entertainment': ['Find free events in your area', 'Try a free trial instead', 'Enjoy nature or exercise'],
      'Transport': ['Walk or cycle if possible', 'Use public transport', 'Combine errands into one trip'],
      'Other': ['Find a DIY solution', 'Borrow from a friend', 'Look for free alternatives']
    };
    return alternatives[cat as keyof typeof alternatives] || alternatives['Other'];
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
              <SmartieAnimated 
                {...getSmartieProps()}
                size="md"
                isIdle={!isAnalyzing}
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

          {/* Decision Results */}
          <AnimatePresence>
            {decision && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Emotional Insight */}
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Emotional Check-in</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{decision.emotional_insight}</p>
                    </div>
                  </div>
                </Card>

                {/* Financial Impact */}
                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Financial Impact</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">{decision.financial_impact}</p>
                    </div>
                  </div>
                </Card>

                {/* Alternatives */}
                {decision.alternatives && (
                  <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Smart Alternatives</h4>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                          {decision.alternatives.map((alt, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!decision ? (
              <Button 
                onClick={analyzeDecision} 
                disabled={isAnalyzing || !itemName || !amount || !category}
                className="flex-1"
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
                <Button onClick={handleSubmit} className="flex-1">
                  Save Decision
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}