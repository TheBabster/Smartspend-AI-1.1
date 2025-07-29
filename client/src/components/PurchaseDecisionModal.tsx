import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Smartie from "@/components/Smartie";
import { type Budget } from "@shared/schema";

interface PurchaseDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Food & Dining",
  "Shopping", 
  "Entertainment",
  "Transport",
  "Utilities",
  "Other"
];

const desireEmojis = [
  "😐", "🙂", "😊", "😄", "😍", "🤩", "🔥", "💖", "🚀", "⭐"
];

const urgencyEmojis = [
  "😴", "😌", "🤔", "⏰", "⚡", "🔥", "🚨", "💥", "🆘", "🚑"
];

export default function PurchaseDecisionModal({ open, onOpenChange }: PurchaseDecisionModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    amount: "",
    category: "",
    desireLevel: 5,
    urgency: 5,
  });
  const [decision, setDecision] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ["/api/budgets"] });

  const decisionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/decisions", data);
      return response.json();
    },
    onSuccess: (result) => {
      setDecision(result);
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
    },
    onError: () => {
      toast({
        title: "Decision Error",
        description: "Failed to get decision. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.itemName || !formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    decisionMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      itemName: "",
      amount: "",
      category: "",
      desireLevel: 5,
      urgency: 5,
    });
    setDecision(null);
    setShowResult(false);
    onOpenChange(false);
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return <CheckCircle className="text-green-500" size={24} />;
      case "no":
        return <XCircle className="text-red-500" size={24} />;
      case "think_again":
        return <AlertCircle className="text-yellow-500" size={24} />;
      default:
        return <AlertCircle className="text-gray-500" size={24} />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return "from-green-500 to-emerald-500";
      case "no":
        return "from-red-500 to-pink-500";
      case "think_again":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return "Go for it!";
      case "no":
        return "Skip this one";
      case "think_again":
        return "Think it over";
      default:
        return "Hmm...";
    }
  };

  const selectedBudget = budgets.find(b => b.category === formData.category);
  const remainingBudget = selectedBudget 
    ? parseFloat(selectedBudget.monthlyLimit) - parseFloat(selectedBudget.spent || "0")
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
            Purchase Decision Assistant
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemName">What do you want to buy?</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="iPhone 15, Coffee, Netflix subscription..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">How much does it cost?</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      £
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="25.99"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category && selectedBudget && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £{remainingBudget.toFixed(0)} remaining in {formData.category} budget
                    </p>
                  )}
                </div>

                <div>
                  <Label>How much do you want it? {desireEmojis[formData.desireLevel - 1]}</Label>
                  <div className="mt-3 px-2">
                    <Slider
                      value={[formData.desireLevel]}
                      onValueChange={(value) => setFormData({ ...formData, desireLevel: value[0] })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Meh 😐</span>
                      <span>{formData.desireLevel}/10</span>
                      <span>Need it! ⭐</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>How urgent is it? {urgencyEmojis[formData.urgency - 1]}</Label>
                  <div className="mt-3 px-2">
                    <Slider
                      value={[formData.urgency]}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value[0] })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Whenever 😴</span>
                      <span>{formData.urgency}/10</span>
                      <span>Now! 🚑</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={decisionMutation.isPending}
                  className="flex-1 gradient-bg text-white"
                >
                  {decisionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Get Smartie's Advice"
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className={`shadow-lg border-2 bg-gradient-to-r ${getRecommendationColor(decision?.recommendation || "")} text-white`}>
                <CardContent className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-4"
                  >
                    {getRecommendationIcon(decision?.recommendation || "")}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">
                    {getRecommendationText(decision?.recommendation || "")}
                  </h3>
                  <p className="text-lg">£{decision?.amount || formData.amount}</p>
                  <p className="text-sm opacity-90">{decision?.itemName || formData.itemName}</p>
                </CardContent>
              </Card>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <Smartie 
                  message={decision?.reasoning || "Let me think about this..."}
                  showTyping={true}
                  emotion={
                    decision?.recommendation === 'yes' ? 'excited' :
                    decision?.recommendation === 'no' ? 'concerned' :
                    decision?.recommendation === 'think_again' ? 'thinking' :
                    'thinking'
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="text-2xl">{desireEmojis[formData.desireLevel - 1]}</div>
                  <div className="font-medium">Desire</div>
                  <div className="text-gray-600 dark:text-gray-400">{formData.desireLevel}/10</div>
                </div>
                <div>
                  <div className="text-2xl">{urgencyEmojis[formData.urgency - 1]}</div>
                  <div className="font-medium">Urgency</div>
                  <div className="text-gray-600 dark:text-gray-400">{formData.urgency}/10</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResult(false)}
                  className="flex-1"
                >
                  Try Another
                </Button>
                <Button 
                  onClick={handleClose}
                  className="flex-1 gradient-bg text-white"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
