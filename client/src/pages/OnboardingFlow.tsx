import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@shared/schema";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();
  const { user: firebaseUser } = useAuth();
  
  // Enhanced form data for comprehensive financial onboarding
  const [formData, setFormData] = useState({
    // Basic Financial Info
    monthlyIncome: "",
    currency: "GBP",
    
    // Budget Categories
    budgetCategories: {
      "Food & Dining": "",
      "Shopping": "",
      "Entertainment": "",
      "Transport": "",
      "Bills & Utilities": "",
      "Healthcare": "",
      "Other": ""
    },
    
    // Financial Goals
    primaryGoal: "",
    goalAmount: "",
    goalDeadline: "",
    
    // Financial Situation
    currentSavings: "",
    monthlyExpenses: "",
    debtAmount: "",
    
    // Preferences & Habits
    spendingTriggers: [] as string[],
    financialPriorities: [] as string[],
    budgetingExperience: "",
    notificationPreferences: {
      dailyTip: true,
      weeklyReport: true,
      goalReminder: true,
      budgetAlert: true
    }
  });

  // Redirect if not authenticated and fetch user data
  useEffect(() => {
    if (!firebaseUser) {
      navigate("/auth");
      return;
    }

    // Fetch current user data from PostgreSQL
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${encodeURIComponent(firebaseUser.email!)}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [firebaseUser, navigate]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBudgetCategory = (category: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budgetCategories: {
        ...prev.budgetCategories,
        [category]: value
      }
    }));
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const completeOnboarding = async () => {
    if (!firebaseUser || !user) return;
    
    setLoading(true);
    try {
      // Save comprehensive financial profile to PostgreSQL
      const financialProfile = {
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
        budgetCategories: formData.budgetCategories,
        primaryGoal: formData.primaryGoal,
        goalAmount: parseFloat(formData.goalAmount) || 0,
        goalDeadline: formData.goalDeadline,
        currentSavings: parseFloat(formData.currentSavings) || 0,
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
        debtAmount: parseFloat(formData.debtAmount) || 0,
        spendingTriggers: formData.spendingTriggers,
        financialPriorities: formData.financialPriorities,
        budgetingExperience: formData.budgetingExperience,
        notificationPreferences: formData.notificationPreferences,
        completedAt: new Date().toISOString()
      };

      // Update user in PostgreSQL
      const response = await fetch(`/api/user/${user.id}/complete-onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialProfile })
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Create initial budgets based on user input
      for (const [category, amount] of Object.entries(formData.budgetCategories)) {
        if (amount && parseFloat(amount) > 0) {
          await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              category,
              monthlyLimit: amount,
              month: new Date().toISOString().slice(0, 7)
            })
          });
        }
      }

      // Create initial savings goal if specified
      if (formData.primaryGoal && formData.goalAmount) {
        await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            title: formData.primaryGoal,
            targetAmount: formData.goalAmount,
            targetDate: formData.goalDeadline ? new Date(formData.goalDeadline).toISOString() : null
          })
        });
      }

      console.log("✅ Onboarding completed successfully!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for form updates
  const updateSpendingTriggers = (trigger: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      spendingTriggers: checked 
        ? [...prev.spendingTriggers, trigger]
        : prev.spendingTriggers.filter(t => t !== trigger)
    }));
  };

  const updateFinancialPriorities = (priority: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      financialPriorities: checked 
        ? [...prev.financialPriorities, priority]
        : prev.financialPriorities.filter(p => p !== priority)
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <ModernSmartieAvatar mood="happy" size="xl" />
              <h2 className="text-2xl font-bold mt-4 mb-2">Welcome to SmartSpend!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                I'm Smartie, your AI financial coach. Let's set up your personalized experience in just a few steps.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Monthly Income (£)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="3500"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                />
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                This helps me understand your spending capacity and provide better advice.
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <ModernSmartieAvatar mood="thinking" size="lg" />
              <h2 className="text-xl font-bold mb-2">Set Your Monthly Budget</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Let's allocate your income across different spending categories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.entries({
                food: "Food & Dining",
                shopping: "Shopping",
                entertainment: "Entertainment",
                transport: "Transport",
                utilities: "Bills & Utilities"
              }).map(([key, label]) => (
                <div key={key}>
                  <Label htmlFor={key}>{label} (£)</Label>
                  <Input
                    id={key}
                    type="number"
                    placeholder="300"
                    value={formData.budgetCategories[key as keyof typeof formData.budgetCategories]}
                    onChange={(e) => updateBudgetCategory(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <ModernSmartieAvatar mood="celebrating" size="lg" />
              <h2 className="text-xl font-bold mb-2">Set a Savings Goal</h2>
              <p className="text-gray-600 dark:text-gray-300">
                What would you like to save for? I'll help you stay on track.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">Savings Goal</Label>
                <Input
                  id="goal"
                  placeholder="Emergency Fund"
                  value={formData.savingsGoal}
                  onChange={(e) => updateFormData("savingsGoal", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Target Amount (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  value={formData.goalAmount}
                  onChange={(e) => updateFormData("goalAmount", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.goalDeadline}
                  onChange={(e) => updateFormData("goalDeadline", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <ModernSmartieAvatar mood="celebrating" size="xl" />
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your personalized SmartSpend experience is ready. Here's what you can do:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Smart Purchase Decision</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Get AI advice before any purchase</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Expense Tracking</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Log spending and see patterns</p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300">Budget Management</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Track progress toward your goals</p>
              </div>
              
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <h3 className="font-semibold text-pink-800 dark:text-pink-300">Chat with Smartie</h3>
                <p className="text-sm text-pink-600 dark:text-pink-400">Get personalized financial coaching</p>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <Progress value={(step / 4) * 100} className="h-2" />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Step {step} of 4
          </p>
        </div>
        
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !formData.monthlyIncome) ||
                    (step === 3 && (!formData.savingsGoal || !formData.goalAmount))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={completeOnboarding}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Setting Up..." : "Start Using SmartSpend"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}