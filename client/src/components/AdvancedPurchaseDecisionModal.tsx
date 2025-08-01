import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import ExactSmartieAvatar from './ExactSmartieAvatar';
import { 
  Brain, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  Target, 
  Lightbulb, 
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react';

interface AdvancedPurchaseDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmotionalState {
  id: string;
  label: string;
  emoji: string;
  color: string;
  impulsiveness: number; // 1-10, affects decision weight
}

interface DecisionResponse {
  recommendation: 'yes' | 'think_again' | 'no';
  reasoning: string;
  confidence: number;
  emotional_insight: string;
  financial_impact: string;
  alternatives?: string[];
  wait_suggestion?: string;
  streak_impact?: string;
}

const categories = [
  { id: 'food', label: 'Food & Dining', emoji: '🍔', keywords: ['food', 'restaurant', 'coffee', 'lunch', 'dinner'] },
  { id: 'tech', label: 'Technology', emoji: '📱', keywords: ['phone', 'laptop', 'gadget', 'app', 'software'] },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', keywords: ['movie', 'game', 'book', 'music', 'streaming'] },
  { id: 'clothing', label: 'Clothing & Fashion', emoji: '👕', keywords: ['shirt', 'shoes', 'jacket', 'dress', 'clothes'] },
  { id: 'health', label: 'Health & Fitness', emoji: '🏃', keywords: ['gym', 'supplements', 'health', 'fitness', 'medicine'] },
  { id: 'transport', label: 'Transport', emoji: '🚗', keywords: ['uber', 'taxi', 'bus', 'train', 'car', 'fuel'] },
  { id: 'home', label: 'Home & Garden', emoji: '🏠', keywords: ['furniture', 'decor', 'kitchen', 'garden', 'tools'] },
  { id: 'other', label: 'Other', emoji: '📦', keywords: [] }
];

const emotionalStates: EmotionalState[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-800', impulsiveness: 6 },
  { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'bg-red-100 text-red-800', impulsiveness: 8 },
  { id: 'bored', label: 'Bored', emoji: '😐', color: 'bg-gray-100 text-gray-800', impulsiveness: 7 },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-purple-100 text-purple-800', impulsiveness: 9 },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 text-blue-800', impulsiveness: 8 },
  { id: 'calm', label: 'Calm & Rational', emoji: '😌', color: 'bg-green-100 text-green-800', impulsiveness: 3 }
];

const utilityLevels = [
  { value: 1, label: 'Completely unnecessary', emoji: '🚫' },
  { value: 2, label: 'Very low utility', emoji: '😕' },
  { value: 3, label: 'Low utility', emoji: '🤷' },
  { value: 4, label: 'Somewhat useful', emoji: '🤔' },
  { value: 5, label: 'Moderately useful', emoji: '👍' },
  { value: 6, label: 'Quite useful', emoji: '😊' },
  { value: 7, label: 'Very useful', emoji: '😄' },
  { value: 8, label: 'Highly useful', emoji: '🤩' },
  { value: 9, label: 'Extremely useful', emoji: '💯' },
  { value: 10, label: 'Essential/Life-changing', emoji: '🌟' }
];

const desireLevels = [
  { value: 1, label: 'Meh, not really interested', emoji: '😐' },
  { value: 2, label: 'Slightly want it', emoji: '🙂' },
  { value: 3, label: 'Would be nice to have', emoji: '😊' },  
  { value: 4, label: 'Pretty interested', emoji: '😄' },
  { value: 5, label: 'Really want it', emoji: '😍' },
  { value: 6, label: 'Want it badly', emoji: '🤩' },
  { value: 7, label: 'Need it now!', emoji: '💖' },
  { value: 8, label: 'Obsessing over it', emoji: '🚀' },
  { value: 9, label: 'Can\'t stop thinking about it', emoji: '⭐' },
  { value: 10, label: 'MUST HAVE RIGHT NOW!', emoji: '🔥' }
];

export default function AdvancedPurchaseDecisionModal({ open, onOpenChange }: AdvancedPurchaseDecisionModalProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    amount: '',
    category: '',
    utilityLevel: [5],
    desireLevel: [5],
    emotionalState: '',
    isTimeSensitive: false,
    timeReason: '',
    notes: ''
  });
  
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [smartieMessage, setSmartieMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-detect category from product name
  useEffect(() => {
    if (formData.itemName && !formData.category) {
      const itemLower = formData.itemName.toLowerCase();
      const detectedCategory = categories.find(cat => 
        cat.keywords.some(keyword => itemLower.includes(keyword))
      );
      if (detectedCategory) {
        setFormData(prev => ({ ...prev, category: detectedCategory.id }));
      }
    }
  }, [formData.itemName, formData.category]);

  // Sync Firebase user with database first  
  const { data: syncedUser } = useQuery({
    queryKey: ['sync-user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: 'PLOFcMQeHePcuXObAvpAkewhZYa2',
          email: 'bdaniel6@outlook.com',
          name: 'bdaniel6'
        })
      });
      return response.json();
    }
  });

  // Fetch user's financial data for context
  const { data: budgets = [] } = useQuery({ queryKey: ['/api/budgets'] });
  const { data: userProfile } = useQuery({ queryKey: ['/api/user'] });
  const { data: recentDecisions = [] } = useQuery({ queryKey: ['/api/decisions'] });

  const createDecisionMutation = useMutation({
    mutationFn: async (decisionData: any) => {
      const response = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionData)
      });
      if (!response.ok) throw new Error('Failed to save decision');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decisions'] });
      toast({
        title: 'Decision Saved!',
        description: 'Your purchase decision has been recorded for future insights.',
      });
    }
  });

  const analyzeDecision = async () => {
    setIsAnalyzing(true);
    setCurrentStep(1);

    // Simulate advanced AI analysis with contextual factors
    const emotionalState = emotionalStates.find(e => e.id === formData.emotionalState);
    const budget = budgets.find(b => b.category === formData.category);
    const utilityScore = formData.utilityLevel[0];
    const desireScore = formData.desireLevel[0];
    const impulsiveness = emotionalState?.impulsiveness || 5;

    // Calculate financial context
    const budgetRemaining = budget ? 
      parseFloat(budget.monthlyLimit) - parseFloat(budget.spent || '0') : 1000;
    const itemCost = parseFloat(formData.amount || '0');
    const budgetImpact = itemCost / budgetRemaining;

    // Decision logic with contextual awareness
    let recommendation: 'yes' | 'think_again' | 'no' = 'think_again';
    let confidence = 50;
    let reasoning = '';

    if (utilityScore >= 8 && budgetImpact < 0.3) {
      recommendation = 'yes';
      confidence = 85;
      reasoning = `High utility item that fits well within your budget. This seems like a smart purchase!`;
    } else if (desireScore >= 8 && impulsiveness >= 7 && budgetImpact > 0.5) {
      recommendation = 'no';
      confidence = 80;
      reasoning = `You're feeling ${emotionalState?.label.toLowerCase()} which often leads to impulse purchases. This would use ${Math.round(budgetImpact * 100)}% of your remaining ${formData.category} budget.`;
    } else if (formData.isTimeSensitive && utilityScore >= 6) {
      recommendation = 'think_again';
      confidence = 70;
      reasoning = `Time-sensitive purchase with decent utility. Consider if this urgency is real or manufactured.`;
    } else if (utilityScore <= 4 && desireScore >= 7) {
      recommendation = 'no';
      confidence = 75;
      reasoning = `High desire but low utility - classic impulse buy territory. Your future self will thank you for skipping this.`;
    }

    // Generate personalized insights
    const emotionalInsight = `Your current ${emotionalState?.label.toLowerCase()} mood increases impulse purchase risk by ${impulsiveness * 10}%.`;
    const financialImpact = budgetImpact > 0.5 ? 
      `⚠️ This would consume ${Math.round(budgetImpact * 100)}% of your remaining monthly ${formData.category} budget.` :
      `💚 This fits comfortably in your ${formData.category} budget (${Math.round(budgetImpact * 100)}% of remaining).`;

    // Wait suggestion for non-urgent items
    const waitSuggestion = !formData.isTimeSensitive && recommendation !== 'yes' ? 
      `Let's add this to your wish list and revisit in 3 days. Often the desire fades, saving you money!` : undefined;

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate analysis time

    const mockDecision: DecisionResponse = {
      recommendation,
      reasoning,
      confidence,
      emotional_insight: emotionalInsight,
      financial_impact: financialImpact,
      wait_suggestion: waitSuggestion,
      alternatives: recommendation === 'no' ? [
        'Save the money toward your emergency fund',
        'Look for a cheaper alternative',
        'Wait for a sale or discount'
      ] : undefined
    };

    setDecision(mockDecision);
    setIsAnalyzing(false);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!syncedUser?.id) {
      toast({
        title: 'Error',
        description: 'User authentication required to save decision.',
        variant: 'destructive'
      });
      return;
    }

    const decisionData = {
      userId: syncedUser.id,
      itemName: formData.itemName,
      amount: formData.amount,
      category: formData.category,
      desireLevel: formData.desireLevel[0],
      urgency: formData.isTimeSensitive ? 8 : 3,
      emotion: formData.emotionalState,
      notes: formData.notes || null,
      recommendation: decision?.recommendation,
      reasoning: decision?.reasoning
    };

    await createDecisionMutation.mutateAsync(decisionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      itemName: '',
      amount: '',
      category: '',
      utilityLevel: [5],
      desireLevel: [5],
      emotionalState: '',
      isTimeSensitive: false,
      timeReason: '',
      notes: ''
    });
    setDecision(null);
    setIsAnalyzing(false);
    setCurrentStep(0);
    onOpenChange(false);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // In a real implementation, this would use Web Speech API
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        itemName: 'Nike Tech Fleece Hoodie',
        amount: '110'
      }));
      setIsListening(false);
      toast({
        title: 'Voice Input Received',
        description: 'I heard: "Nike Tech Fleece Hoodie, £110"',
      });
    }, 2000);
  };

  const getCurrentUtilityEmoji = () => {
    const level = utilityLevels.find(l => l.value === formData.utilityLevel[0]);
    return level?.emoji || '🤔';
  };

  const getCurrentDesireEmoji = () => {
    const level = desireLevels.find(l => l.value === formData.desireLevel[0]);
    return level?.emoji || '😐';
  };

  const getSmartieProps = () => {
    if (isAnalyzing) return { mood: 'thinking' as const, size: 'xl' as const, animated: true };
    if (!decision) return { mood: 'happy' as const, size: 'lg' as const, animated: true };
    
    const moodMap = {
      yes: 'celebrating' as const,
      think_again: 'thinking' as const,  
      no: 'concerned' as const
    };
    
    return { 
      mood: moodMap[decision.recommendation], 
      size: 'xl' as const,
      animated: true
    };
  };

  const getRecommendationColor = (rec: string) => {
    const colors = {
      yes: 'from-green-500 to-emerald-600',
      think_again: 'from-yellow-500 to-orange-500',
      no: 'from-red-500 to-pink-600'
    };
    return colors[rec as keyof typeof colors];
  };

  const getRecommendationIcon = (rec: string) => {
    const icons = {
      yes: <CheckCircle className="w-6 h-6" />,
      think_again: <AlertTriangle className="w-6 h-6" />,
      no: <XCircle className="w-6 h-6" />
    };
    return icons[rec as keyof typeof icons];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            Smart Purchase Assistant
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Smartie Avatar Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ExactSmartieAvatar {...getSmartieProps()} />
            <motion.p 
              className="text-sm text-gray-600 mt-2 min-h-[20px]"
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isAnalyzing && "Let me analyze this purchase using your financial profile..."}
              {!isAnalyzing && !decision && "Tell me about what you want to buy!"}
              {decision && `Based on my analysis, I ${decision.recommendation === 'yes' ? 'recommend' : decision.recommendation === 'think_again' ? 'suggest you reconsider' : 'advise against'} this purchase.`}
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!decision ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Voice Input Section */}
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">Quick Voice Input</h3>
                      <p className="text-sm text-gray-600">Say something like "iPhone 15, £800"</p>
                    </div>
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      onClick={isListening ? () => setIsListening(false) : startVoiceInput}
                      className="flex items-center gap-2"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isListening ? 'Stop' : 'Speak'}
                    </Button>
                  </div>
                </Card>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemName">What do you want to buy? *</Label>
                    <Input
                      id="itemName"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      placeholder="iPhone 15, Coffee, Netflix subscription..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Cost (£) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="99.99"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <Label>Category *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        type="button"
                        variant={formData.category === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className="flex items-center gap-2 h-auto py-3"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-xs">{cat.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Utility Level Slider */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Utility Level: {getCurrentUtilityEmoji()} {formData.utilityLevel[0]}/10
                  </Label>
                  <Slider
                    value={formData.utilityLevel}
                    onValueChange={(value) => setFormData({ ...formData, utilityLevel: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {utilityLevels.find(l => l.value === formData.utilityLevel[0])?.label}
                  </p>
                </div>

                {/* Desire Level Slider */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Desire Level: {getCurrentDesireEmoji()} {formData.desireLevel[0]}/10
                  </Label>
                  <Slider
                    value={formData.desireLevel}
                    onValueChange={(value) => setFormData({ ...formData, desireLevel: value })}
                    max={10}
                    min={1}
                    step={1} 
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {desireLevels.find(l => l.value === formData.desireLevel[0])?.label}
                  </p>
                </div>

                {/* Emotional State */}
                <div>
                  <Label>How are you feeling right now?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {emotionalStates.map((emotion) => (
                      <Button
                        key={emotion.id}
                        type="button"
                        variant={formData.emotionalState === emotion.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, emotionalState: emotion.id })}
                        className="flex items-center gap-2 h-auto py-2"
                      >
                        <span className="text-lg">{emotion.emoji}</span>
                        <span className="text-xs">{emotion.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Sensitivity */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Is this time-sensitive?
                    </Label>
                    <Button
                      type="button"
                      variant={formData.isTimeSensitive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, isTimeSensitive: !formData.isTimeSensitive })}
                    >
                      {formData.isTimeSensitive ? <Zap className="w-4 h-4 mr-1" /> : <Timer className="w-4 h-4 mr-1" />}
                      {formData.isTimeSensitive ? 'Urgent' : 'Not Urgent'}
                    </Button>
                  </div>
                  {formData.isTimeSensitive && (
                    <Input
                      value={formData.timeReason}
                      onChange={(e) => setFormData({ ...formData, timeReason: e.target.value })}
                      placeholder="Why is this time-sensitive? (e.g., sale ends today, need for event)"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={analyzeDecision}
                  disabled={isAnalyzing || !formData.itemName || !formData.amount || !formData.category || !formData.emotionalState}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Smartie's Smart Advice
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Decision Result Card */}
                <Card className={`shadow-xl border-2 bg-gradient-to-r ${getRecommendationColor(decision.recommendation)} text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRecommendationIcon(decision.recommendation)}
                        <div>
                          <h3 className="text-xl font-bold">
                            {decision.recommendation === 'yes' && 'Go for it!'}
                            {decision.recommendation === 'think_again' && 'Think it over'}
                            {decision.recommendation === 'no' && 'Skip this one'}
                          </h3>
                          <p className="text-white/80">Confidence: {decision.confidence}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          My Reasoning
                        </h4>
                        <p className="text-white/90">{decision.reasoning}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Emotional Insight
                        </h4>
                        <p className="text-white/90">{decision.emotional_insight}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Financial Impact
                        </h4>
                        <p className="text-white/90">{decision.financial_impact}</p>
                      </div>

                      {decision.wait_suggestion && (
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            Wait Strategy
                          </h4>
                          <p className="text-white/90">{decision.wait_suggestion}</p>
                        </div>
                      )}

                      {decision.alternatives && (
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Better Alternatives
                          </h4>
                          <ul className="text-white/90 space-y-1">
                            {decision.alternatives.map((alt, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                                {alt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setDecision(null)} 
                    className="flex-1"
                  >
                    Ask Again
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={createDecisionMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {createDecisionMutation.isPending ? 'Saving...' : 'Save Decision'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}