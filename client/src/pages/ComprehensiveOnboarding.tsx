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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@shared/schema";

export default function ComprehensiveOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();
  const { user: firebaseUser, loading: authLoading } = useAuth();
  
  // Comprehensive onboarding data
  const [onboardingData, setOnboardingData] = useState({
    // Step 1: Basic Financial Info
    name: "",
    monthlyIncome: "",
    currency: "GBP",
    currentSavings: "",
    monthlyExpenses: "",
    
    // Step 2: Financial Goals & Priorities
    primaryGoal: "",
    goalAmount: "",
    goalTimeframe: "",
    financialPriorities: [] as string[],
    riskTolerance: "",
    
    // Step 3: Budget Categories
    budgetCategories: {
      "Food & Dining": "",
      "Shopping & Retail": "",
      "Entertainment": "",
      "Transport": "",
      "Bills & Utilities": "",
      "Healthcare": "",
      "Travel": "",
      "Other": ""
    },
    
    // Step 4: Spending Habits & Emotional Triggers
    spendingTriggers: [] as string[],
    spendingMoods: [] as string[],
    budgetingExperience: "",
    impulseBuyingFrequency: "",
    
    // Step 5: Personalization & Preferences
    smartiePersonality: "",
    notificationPreferences: {
      dailyTips: true,
      weeklyReports: true,
      budgetAlerts: true,
      goalReminders: true,
      impulseWarnings: true
    },
    preferredAdviceStyle: ""
  });

  // Redirect if not authenticated and fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (authLoading) return; // Wait for auth to complete
      
      if (!firebaseUser) {
        navigate("/auth");
        return;
      }

      try {
        setUserLoading(true);
        
        // First sync the Firebase user with database
        const syncResponse = await fetch('/api/auth/firebase-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
          })
        });

        if (syncResponse.ok) {
          const userData = await syncResponse.json();
          setUser(userData);
          
          // Pre-populate name from database or Firebase
          setOnboardingData(prev => ({
            ...prev,
            name: userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || ""
          }));

          // If user has already completed onboarding, redirect to dashboard
          if (userData.onboardingCompleted) {
            console.log('✅ User already completed onboarding, redirecting to dashboard');
            navigate('/');
            return;
          }
        } else {
          console.error('Failed to sync user with database');
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Still allow onboarding to proceed even if there's an error
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [firebaseUser, authLoading, navigate]);

  const updateField = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBudgetCategory = (category: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      budgetCategories: {
        ...prev.budgetCategories,
        [category]: value
      }
    }));
  };

  const toggleArrayItem = (arrayField: string, item: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField as keyof typeof prev].includes(item)
        ? (prev[arrayField as keyof typeof prev] as string[]).filter((i: string) => i !== item)
        : [...(prev[arrayField as keyof typeof prev] as string[]), item]
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
      // Create comprehensive financial profile
      const financialProfile = {
        ...onboardingData,
        completedAt: new Date().toISOString(),
        version: "2.0"
      };

      // Update user in PostgreSQL with onboarding completion
      const response = await fetch(`/api/user/${user.id}/complete-onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          financialProfile,
          name: onboardingData.name,
          monthlyIncome: onboardingData.monthlyIncome
        })
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Create initial budgets based on user input
      for (const [category, amount] of Object.entries(onboardingData.budgetCategories)) {
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
      if (onboardingData.primaryGoal && onboardingData.goalAmount) {
        const targetDate = new Date();
        if (onboardingData.goalTimeframe === "3months") {
          targetDate.setMonth(targetDate.getMonth() + 3);
        } else if (onboardingData.goalTimeframe === "6months") {
          targetDate.setMonth(targetDate.getMonth() + 6);
        } else if (onboardingData.goalTimeframe === "1year") {
          targetDate.setFullYear(targetDate.getFullYear() + 1);
        }

        await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            title: onboardingData.primaryGoal,
            targetAmount: onboardingData.goalAmount,
            targetDate: targetDate.toISOString()
          })
        });
      }

      console.log("✅ Comprehensive onboarding completed successfully!");
      // Force full page refresh to trigger protected route logic
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSmartieReaction = () => {
    switch (step) {
      case 1: return "happy";
      case 2: return "thinking";
      case 3: return "calculating";
      case 4: return "concerned";
      case 5: return "celebrating";
      case 6: return "excited";
      default: return "happy";
    }
  };

  const renderStep = () => {
    const progressPercentage = (step / 6) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <ModernSmartieAvatar mood={getSmartieReaction()} size="xl" />
            <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
              Financial Setup Wizard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Step {step} of 6 - Let's create your personalized SmartSpend experience!
            </p>
            <Progress value={progressPercentage} className="w-full max-w-md mx-auto" />
          </div>

          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Welcome! Let's start with the basics</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tell me about your current financial situation so I can provide personalized advice.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">What should I call you?</Label>
                        <Input
                          id="name"
                          placeholder="Your preferred name"
                          value={onboardingData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="income">Monthly Income (£)</Label>
                        <Input
                          id="income"
                          type="number"
                          placeholder="3500"
                          value={onboardingData.monthlyIncome}
                          onChange={(e) => updateField("monthlyIncome", e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">This helps me understand your spending capacity</p>
                      </div>

                      <div>
                        <Label htmlFor="savings">Current Savings (£)</Label>
                        <Input
                          id="savings"
                          type="number"
                          placeholder="5000"
                          value={onboardingData.currentSavings}
                          onChange={(e) => updateField("currentSavings", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="expenses">Monthly Fixed Expenses (£)</Label>
                        <Input
                          id="expenses"
                          type="number"
                          placeholder="1200"
                          value={onboardingData.monthlyExpenses}
                          onChange={(e) => updateField("monthlyExpenses", e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">Rent, utilities, subscriptions, etc.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">What are your financial goals?</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Understanding your priorities helps me give you better advice.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal">Primary Financial Goal</Label>
                        <Select value={onboardingData.primaryGoal} onValueChange={(value) => updateField("primaryGoal", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your main goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency-fund">Build Emergency Fund</SelectItem>
                            <SelectItem value="house-deposit">Save for House Deposit</SelectItem>
                            <SelectItem value="travel">Save for Travel</SelectItem>
                            <SelectItem value="car">Buy a Car</SelectItem>
                            <SelectItem value="debt-payoff">Pay Off Debt</SelectItem>
                            <SelectItem value="retirement">Retirement Savings</SelectItem>
                            <SelectItem value="education">Education/Course</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="goalAmount">Target Amount (£)</Label>
                        <Input
                          id="goalAmount"
                          type="number"
                          placeholder="10000"
                          value={onboardingData.goalAmount}
                          onChange={(e) => updateField("goalAmount", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>When do you want to achieve this?</Label>
                        <RadioGroup value={onboardingData.goalTimeframe} onValueChange={(value) => updateField("goalTimeframe", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3months" id="3months" />
                            <Label htmlFor="3months">3 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6months" id="6months" />
                            <Label htmlFor="6months">6 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1year" id="1year" />
                            <Label htmlFor="1year">1 year</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2years" id="2years" />
                            <Label htmlFor="2years">2+ years</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>What's most important to you? (Select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            "Financial Security", "Enjoying Life", "Building Wealth", 
                            "Debt Freedom", "Travel Experiences", "Future Planning"
                          ].map((priority) => (
                            <div key={priority} className="flex items-center space-x-2">
                              <Checkbox
                                id={priority}
                                checked={onboardingData.financialPriorities.includes(priority)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    toggleArrayItem("financialPriorities", priority);
                                  } else {
                                    toggleArrayItem("financialPriorities", priority);
                                  }
                                }}
                              />
                              <Label htmlFor={priority} className="text-sm">{priority}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Set Your Monthly Budget</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        How much do you want to spend in each category per month?
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(onboardingData.budgetCategories).map(([category, amount]) => (
                        <div key={category}>
                          <Label htmlFor={category}>{category} (£)</Label>
                          <Input
                            id={category}
                            type="number"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => updateBudgetCategory(category, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      💡 Don't worry about being perfect - you can adjust these later as you learn your spending patterns!
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Understanding Your Spending Habits</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        This helps me provide better warnings and support when needed.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <Label>What triggers you to spend impulsively? (Select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            "Stress", "Boredom", "Sales/Discounts", "Social Media", 
                            "Peer Pressure", "Celebration", "Bad Day", "Payday"
                          ].map((trigger) => (
                            <div key={trigger} className="flex items-center space-x-2">
                              <Checkbox
                                id={trigger}
                                checked={onboardingData.spendingTriggers.includes(trigger)}
                                onCheckedChange={() => toggleArrayItem("spendingTriggers", trigger)}
                              />
                              <Label htmlFor={trigger} className="text-sm">{trigger}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>How often do you make impulse purchases?</Label>
                        <RadioGroup value={onboardingData.impulseBuyingFrequency} onValueChange={(value) => updateField("impulseBuyingFrequency", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rarely" id="rarely" />
                            <Label htmlFor="rarely">Rarely (once a month or less)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sometimes" id="sometimes" />
                            <Label htmlFor="sometimes">Sometimes (few times a month)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="often" id="often" />
                            <Label htmlFor="often">Often (weekly)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="daily" id="daily" />
                            <Label htmlFor="daily">Daily</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Experience with budgeting</Label>
                        <RadioGroup value={onboardingData.budgetingExperience} onValueChange={(value) => updateField("budgetingExperience", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner">Complete beginner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="some" id="some" />
                            <Label htmlFor="some">I've tried before</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="experienced" id="experienced" />
                            <Label htmlFor="experienced">Quite experienced</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Personalize Your Smartie Experience</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        How would you like me to communicate with you?
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <Label>Smartie's Personality Style</Label>
                        <RadioGroup value={onboardingData.smartiePersonality} onValueChange={(value) => updateField("smartiePersonality", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="encouraging" id="encouraging" />
                            <Label htmlFor="encouraging">Encouraging Friend - Supportive and motivating</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="analytical" id="analytical" />
                            <Label htmlFor="analytical">Data Analyst - Facts and numbers focused</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="coach" id="coach" />
                            <Label htmlFor="coach">Tough Coach - Direct and challenging</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="casual" id="casual" />
                            <Label htmlFor="casual">Casual Buddy - Relaxed and informal</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Advice Style Preference</Label>
                        <RadioGroup value={onboardingData.preferredAdviceStyle} onValueChange={(value) => updateField("preferredAdviceStyle", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="detailed" id="detailed" />
                            <Label htmlFor="detailed">Detailed explanations with examples</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quick" id="quick" />
                            <Label htmlFor="quick">Quick tips and bullet points</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="visual" id="visual" />
                            <Label htmlFor="visual">Visual charts and progress tracking</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Notification Preferences</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            { key: "dailyTips", label: "Daily financial tips" },
                            { key: "weeklyReports", label: "Weekly spending reports" },
                            { key: "budgetAlerts", label: "Budget limit warnings" },
                            { key: "goalReminders", label: "Goal progress reminders" },
                            { key: "impulseWarnings", label: "Impulse buying warnings" }
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={onboardingData.notificationPreferences[key as keyof typeof onboardingData.notificationPreferences]}
                                onCheckedChange={(checked) => {
                                  setOnboardingData(prev => ({
                                    ...prev,
                                    notificationPreferences: {
                                      ...prev.notificationPreferences,
                                      [key]: checked
                                    }
                                  }));
                                }}
                              />
                              <Label htmlFor={key}>{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 text-center"
                  >
                    <div className="mb-6">
                      <ModernSmartieAvatar mood="celebrating" size="xl" />
                      <h2 className="text-2xl font-bold mt-4 mb-2">All Set! 🎉</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        I now have everything I need to provide personalized financial coaching just for you!
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Here's what I'll help you with:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <p>✅ Personalized spending advice</p>
                          <p>✅ Smart purchase recommendations</p>
                          <p>✅ Goal progress tracking</p>
                        </div>
                        <div className="text-left">
                          <p>✅ Budget monitoring & alerts</p>
                          <p>✅ Emotional spending support</p>
                          <p>✅ Weekly financial insights</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={completeOnboarding} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                    >
                      {loading ? "Setting up your dashboard..." : "Start My Financial Journey! 🚀"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {step < 6 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {step === 5 ? "Final Step" : "Continue"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Show loading while waiting for authentication or user data
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Setting up your financial profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!firebaseUser) {
    return null;
  }

  return renderStep();
}