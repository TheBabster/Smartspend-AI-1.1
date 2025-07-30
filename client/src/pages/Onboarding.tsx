import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthContext';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { ArrowRight, ArrowLeft, Check, PoundSterling, Target, TrendingUp, CreditCard } from 'lucide-react';

interface FinancialProfile {
  monthlyIncome: string;
  currency: string;
  recurringExpenses: {
    rent: string;
    utilities: string;
    transport: string;
    insurance: string;
    subscriptions: string;
    other: string;
  };
  savingsGoals: {
    emergency: string;
    shortTerm: string;
    longTerm: string;
    targetDate: string;
  };
  debt: {
    creditCards: string;
    loans: string;
    mortgage: string;
    other: string;
  };
  financialPriorities: string[];
  riskTolerance: string;
  spendingHabits: string;
}

const steps = [
  { id: 'income', title: 'Monthly Income', icon: PoundSterling },
  { id: 'expenses', title: 'Regular Expenses', icon: CreditCard },
  { id: 'goals', title: 'Savings Goals', icon: Target },
  { id: 'debt', title: 'Debt & Obligations', icon: TrendingUp },
  { id: 'preferences', title: 'Financial Preferences', icon: Check }
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { updateUser, user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<FinancialProfile>({
    monthlyIncome: '',
    currency: 'GBP',
    recurringExpenses: {
      rent: '',
      utilities: '',
      transport: '',
      insurance: '',
      subscriptions: '',
      other: ''
    },
    savingsGoals: {
      emergency: '',
      shortTerm: '',
      longTerm: '',
      targetDate: ''
    },
    debt: {
      creditCards: '',
      loans: '',
      mortgage: '',
      other: ''
    },
    financialPriorities: [],
    riskTolerance: '',
    spendingHabits: ''
  });

  const smartieMessages = [
    "Hi there! I'm Smartie, your AI financial buddy. Let's set up your profile so I can give you personalized advice! 🧠✨",
    "Great! Now let's talk about your regular monthly expenses. This helps me understand your spending patterns.",
    "Awesome! What are your savings goals? I'll help you stay on track and make smart spending decisions.",
    "Let's discuss any debts or financial obligations. Don't worry - I'm here to help you manage everything!",
    "Almost done! These preferences help me tailor my advice to your unique financial personality."
  ];

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedProfile = (section: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FinancialProfile],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      await updateUser({
        monthlyIncome: profile.monthlyIncome,
        currency: profile.currency,
        financialProfile: profile,
        onboardingCompleted: true
      });

      toast({
        title: "Profile Complete!",
        description: "Welcome to SmartSpend! Smartie is ready to help you achieve your financial goals.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePriority = (priority: string) => {
    setProfile(prev => ({
      ...prev,
      financialPriorities: prev.financialPriorities.includes(priority)
        ? prev.financialPriorities.filter(p => p !== priority)
        : [...prev.financialPriorities, priority]
    }));
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? 'text-purple-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        index <= currentStep
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <ExactSmartieAvatar 
                      mood={currentStep === steps.length - 1 ? "celebrating" : "thinking"} 
                      size="lg" 
                      animated={true} 
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <StepIcon className="w-6 h-6 text-purple-600" />
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                    {smartieMessages[currentStep]}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Step 0: Income */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={profile.currency} onValueChange={(value) => updateProfile('currency', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GBP">£ British Pound</SelectItem>
                            <SelectItem value="USD">$ US Dollar</SelectItem>
                            <SelectItem value="EUR">€ Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="income">Monthly Income (after tax)</Label>
                        <Input
                          id="income"
                          type="number"
                          value={profile.monthlyIncome}
                          onChange={(e) => updateProfile('monthlyIncome', e.target.value)}
                          placeholder="3500"
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Your take-home pay each month
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Expenses */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rent">Rent/Mortgage</Label>
                          <Input
                            id="rent"
                            type="number"
                            value={profile.recurringExpenses.rent}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'rent', e.target.value)}
                            placeholder="1200"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="utilities">Utilities & Bills</Label>
                          <Input
                            id="utilities"
                            type="number"
                            value={profile.recurringExpenses.utilities}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'utilities', e.target.value)}
                            placeholder="150"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="transport">Transport</Label>
                          <Input
                            id="transport"
                            type="number"
                            value={profile.recurringExpenses.transport}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'transport', e.target.value)}
                            placeholder="200"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="insurance">Insurance</Label>
                          <Input
                            id="insurance"
                            type="number"
                            value={profile.recurringExpenses.insurance}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'insurance', e.target.value)}
                            placeholder="80"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subscriptions">Subscriptions</Label>
                          <Input
                            id="subscriptions"
                            type="number"
                            value={profile.recurringExpenses.subscriptions}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'subscriptions', e.target.value)}
                            placeholder="50"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="other-expenses">Other Fixed Costs</Label>
                          <Input
                            id="other-expenses"
                            type="number"
                            value={profile.recurringExpenses.other}
                            onChange={(e) => updateNestedProfile('recurringExpenses', 'other', e.target.value)}
                            placeholder="100"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Goals */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergency">Emergency Fund Target</Label>
                          <Input
                            id="emergency"
                            type="number"
                            value={profile.savingsGoals.emergency}
                            onChange={(e) => updateNestedProfile('savingsGoals', 'emergency', e.target.value)}
                            placeholder="5000"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">3-6 months of expenses</p>
                        </div>
                        <div>
                          <Label htmlFor="shortTerm">Short-term Savings</Label>
                          <Input
                            id="shortTerm"
                            type="number"
                            value={profile.savingsGoals.shortTerm}
                            onChange={(e) => updateNestedProfile('savingsGoals', 'shortTerm', e.target.value)}
                            placeholder="2000"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Holiday, gadgets, etc.</p>
                        </div>
                        <div>
                          <Label htmlFor="longTerm">Long-term Savings</Label>
                          <Input
                            id="longTerm"
                            type="number"
                            value={profile.savingsGoals.longTerm}
                            onChange={(e) => updateNestedProfile('savingsGoals', 'longTerm', e.target.value)}
                            placeholder="10000"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">House deposit, pension, etc.</p>
                        </div>
                        <div>
                          <Label htmlFor="targetDate">Target Achievement Date</Label>
                          <Input
                            id="targetDate"
                            type="date"
                            value={profile.savingsGoals.targetDate}
                            onChange={(e) => updateNestedProfile('savingsGoals', 'targetDate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Debt */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="creditCards">Credit Card Debt</Label>
                          <Input
                            id="creditCards"
                            type="number"
                            value={profile.debt.creditCards}
                            onChange={(e) => updateNestedProfile('debt', 'creditCards', e.target.value)}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="loans">Personal Loans</Label>
                          <Input
                            id="loans"
                            type="number"
                            value={profile.debt.loans}
                            onChange={(e) => updateNestedProfile('debt', 'loans', e.target.value)}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mortgage">Mortgage Remaining</Label>
                          <Input
                            id="mortgage"
                            type="number"
                            value={profile.debt.mortgage}
                            onChange={(e) => updateNestedProfile('debt', 'mortgage', e.target.value)}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="other-debt">Other Debt</Label>
                          <Input
                            id="other-debt"
                            type="number"
                            value={profile.debt.other}
                            onChange={(e) => updateNestedProfile('debt', 'other', e.target.value)}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Preferences */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <Label>Financial Priorities (select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {[
                            'Build Emergency Fund',
                            'Pay Off Debt',
                            'Save for Holiday',
                            'Buy a House',
                            'Invest for Future',
                            'Improve Credit Score'
                          ].map((priority) => (
                            <Button
                              key={priority}
                              type="button"
                              variant={profile.financialPriorities.includes(priority) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => togglePriority(priority)}
                              className={profile.financialPriorities.includes(priority) 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : ''
                              }
                            >
                              {priority}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                        <Select value={profile.riskTolerance} onValueChange={(value) => updateProfile('riskTolerance', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="How do you feel about financial risk?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative - Safety first</SelectItem>
                            <SelectItem value="moderate">Moderate - Balanced approach</SelectItem>
                            <SelectItem value="aggressive">Aggressive - Higher risk for rewards</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="spendingHabits">Spending Habits</Label>
                        <Textarea
                          id="spendingHabits"
                          value={profile.spendingHabits}
                          onChange={(e) => updateProfile('spendingHabits', e.target.value)}
                          placeholder="Tell Smartie about your typical spending patterns, what triggers impulse purchases, or any financial habits you'd like to improve..."
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleFinish}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex items-center gap-2"
                      >
                        Complete Setup
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ResponsiveLayout>
  );
}