import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SlideAnimation } from "./SlideAnimations";
import { SmartieToast } from "./MicroInteractions";
import EnhancedExpenseForm from "./EnhancedExpenseForm";
import AutoSuggestionEngine from "./AutoSuggestionEngine";
import { type Budget } from "@shared/schema";

interface ExpenseModalProps {
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

const emotionalTags = [
  { label: "Stress", emoji: "😰", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  { label: "Boredom", emoji: "😴", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
  { label: "Celebration", emoji: "🎉", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
  { label: "Peer Pressure", emoji: "👥", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  { label: "Impulse", emoji: "⚡", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
  { label: "Necessity", emoji: "✅", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  { label: "Reward", emoji: "🏆", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
];

export default function ExpenseModal({ open, onOpenChange }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    emotionalTag: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: budgets = [] } = useQuery<Budget[]>({ queryKey: ["/api/budgets"] });

  const expenseMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/expenses", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      
      toast({
        title: "Expense Added! 💰",
        description: "Your expense has been tracked successfully.",
      });
      
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    expenseMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      emotionalTag: "",
    });
    onOpenChange(false);
  };

  const selectedBudget = budgets.find(b => b.category === formData.category);
  const remainingBudget = selectedBudget 
    ? parseFloat(selectedBudget.monthlyLimit) - parseFloat(selectedBudget.spent)
    : 0;

  const willExceedBudget = selectedBudget && formData.amount 
    ? parseFloat(formData.amount) > remainingBudget
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
            Add New Expense
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">What did you buy?</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Coffee, Lunch, Uber ride..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
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
              {willExceedBudget && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                >
                  ⚠️ This will exceed your budget by £{(parseFloat(formData.amount) - remainingBudget).toFixed(2)}
                </motion.p>
              )}
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
              <Label>How were you feeling? (Optional)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {emotionalTags.map((tag) => (
                  <motion.button
                    key={tag.label}
                    onClick={() => setFormData({ 
                      ...formData, 
                      emotionalTag: formData.emotionalTag === tag.label ? "" : tag.label 
                    })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="focus:outline-none"
                  >
                    <Badge 
                      variant={formData.emotionalTag === tag.label ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        formData.emotionalTag === tag.label ? "gradient-bg text-white" : tag.color
                      }`}
                    >
                      <span className="mr-1">{tag.emoji}</span>
                      {tag.label}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Add Suggestions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <Label className="text-sm font-medium mb-2 block">Quick Add</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Coffee", amount: "3.50", category: "Food & Dining" },
                { name: "Lunch", amount: "8.99", category: "Food & Dining" },
                { name: "Bus Ticket", amount: "2.50", category: "Transport" },
                { name: "Snack", amount: "1.99", category: "Food & Dining" },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => setFormData({
                    description: item.name,
                    amount: item.amount,
                    category: item.category,
                    emotionalTag: "",
                  })}
                  className="p-2 text-left bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">£{item.amount}</div>
                </motion.button>
              ))}
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
              disabled={expenseMutation.isPending}
              className="flex-1 gradient-bg text-white"
            >
              {expenseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
