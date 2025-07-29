import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Smartie from "@/components/Smartie";

interface OnboardingData {
  name: string;
  email: string;
  currency: string;
  monthlyIncome: string;
  budgets: Record<string, string>;
}

const currencies = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

const categories = [
  { name: "Food & Dining", icon: "🍽️" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Transport", icon: "🚗" },
  { name: "Utilities", icon: "💡" },
  { name: "Other", icon: "📦" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    currency: "GBP",
    monthlyIncome: "",
    budgets: {},
  });
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const completeMutation = useMutation({
    mutationFn: async (userData: OnboardingData) => {
      // Update user profile
      await apiRequest("PATCH", "/api/user", {
        name: userData.name,
        email: userData.email,
        currency: userData.currency,
        monthlyIncome: userData.monthlyIncome,
        onboardingCompleted: true,
      });

      // Create budgets
      const currentMonth = new Date().toISOString().slice(0, 7);
      for (const [category, limit] of Object.entries(userData.budgets)) {
        if (limit && parseFloat(limit) > 0) {
          await apiRequest("POST", "/api/budgets", {
            category,
            monthlyLimit: limit,
            month: currentMonth,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Welcome to SmartSpend! 🎉",
        description: "Your account has been set up successfully.",
      });
      navigate("/dashboard");
    },
    onError: () => {
      toast({
        title: "Setup Error",
        description: "There was an issue setting up your account.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    completeMutation.mutate(data);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.name.trim() && data.email.trim();
      case 2:
        return data.currency && data.monthlyIncome && parseFloat(data.monthlyIncome) > 0;
      case 3:
        return Object.values(data.budgets).some(v => v && parseFloat(v) > 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Smartie 
                  message="Welcome aboard! Let's get you set up with a personalized budget. First, tell me a bit about yourself! 👋"
                  className="mb-6"
                />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">What's your name?</label>
                    <Input
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email address</label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Smartie 
                  message="Great! Now let's talk money. What's your monthly income? This helps me create realistic budgets for you! 💰"
                  className="mb-6"
                />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <div className="grid grid-cols-3 gap-2">
                      {currencies.map((currency) => (
                        <Button
                          key={currency.code}
                          variant={data.currency === currency.code ? "default" : "outline"}
                          onClick={() => setData({ ...data, currency: currency.code })}
                          className="h-12"
                        >
                          <div className="text-center">
                            <div className="text-lg">{currency.symbol}</div>
                            <div className="text-xs">{currency.code}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currencies.find(c => c.code === data.currency)?.symbol}
                      </span>
                      <Input
                        type="number"
                        value={data.monthlyIncome}
                        onChange={(e) => setData({ ...data, monthlyIncome: e.target.value })}
                        placeholder="3000"
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Include salary, freelance income, and any regular earnings
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Smartie 
                  message="Perfect! Now let's set up your spending categories. How much would you like to budget for each area monthly? 📊"
                  className="mb-6"
                />
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="flex-1">
                        <label className="block text-sm font-medium">{category.name}</label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {currencies.find(c => c.code === data.currency)?.symbol}
                          </span>
                          <Input
                            type="number"
                            value={data.budgets[category.name] || ""}
                            onChange={(e) => setData({
                              ...data,
                              budgets: { ...data.budgets, [category.name]: e.target.value }
                            })}
                            placeholder="200"
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Smartie 
                  message="Awesome! You're all set! I'll be here to help you make smart spending decisions and reach your financial goals. Ready to start your journey? 🎉"
                  className="mb-6"
                />
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Your Setup Summary:</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {data.name}</p>
                      <p><strong>Monthly Income:</strong> {currencies.find(c => c.code === data.currency)?.symbol}{data.monthlyIncome}</p>
                      <p><strong>Total Budget:</strong> {currencies.find(c => c.code === data.currency)?.symbol}{Object.values(data.budgets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Back
              </Button>
              
              {step < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gradient-bg text-white"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed() || completeMutation.isPending}
                  className="gradient-bg text-white"
                >
                  {completeMutation.isPending ? "Setting up..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
