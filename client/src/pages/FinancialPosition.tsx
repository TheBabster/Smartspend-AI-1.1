import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import BottomNav from '@/components/BottomNav';
import WealthProjectionChart from '@/components/WealthProjectionChart';
import SavingsTreeVisualization from '@/components/SavingsTreeVisualization';
import { Briefcase, DollarSign, TrendingUp, Calculator, Target } from 'lucide-react';

export default function FinancialPosition() {
  const { user: firebaseUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    annualSalary: '',
    monthlyIncome: '',
    financialGoal: ''
  });

  // Sync Firebase user with database
  const { data: syncedUser } = useQuery({
    queryKey: ['sync-user', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      const response = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
        })
      });
      return response.json();
    },
    enabled: !!firebaseUser
  });

  // Get user's expenses for calculations
  const { data: expenses = [] } = useQuery({
    queryKey: ['/api/expenses', syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/expenses/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });

  // Get user's goals for calculations
  const { data: goals = [] } = useQuery({
    queryKey: ['/api/goals', syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/goals/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });

  const updateFinancialInfo = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/user/${syncedUser?.id}/financial-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-user'] });
      toast({
        title: "Financial Position Updated!",
        description: "Your wealth projections have been calculated."
      });
    }
  });

  // Populate form with existing data
  React.useEffect(() => {
    if (syncedUser) {
      setFormData({
        jobTitle: syncedUser.jobTitle || '',
        annualSalary: syncedUser.annualSalary || '',
        monthlyIncome: syncedUser.monthlyIncome || '',
        financialGoal: ''
      });
    }
  }, [syncedUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.annualSalary) {
      toast({
        title: "Missing Information",
        description: "Please provide your job title and salary.",
        variant: "destructive"
      });
      return;
    }

    const monthlyIncome = parseFloat(formData.annualSalary) / 12;
    
    updateFinancialInfo.mutate({
      jobTitle: formData.jobTitle,
      annualSalary: parseFloat(formData.annualSalary),
      monthlyIncome: monthlyIncome.toFixed(2)
    });
  };

  // Calculate financial metrics
  const monthlyIncome = parseFloat(syncedUser?.monthlyIncome || '0');
  const monthlyExpenses = expenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);
  const totalSaved = goals.reduce((sum: number, goal: any) => sum + parseFloat(goal.currentAmount || '0'), 0);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
        
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-2">Financial Position</h1>
          <p className="text-blue-100">Understand your wealth potential and set your financial future</p>
        </motion.div>

        <div className="p-6 space-y-6">
          
          {/* Financial Info Form */}
          {(!syncedUser?.jobTitle || !syncedUser?.annualSalary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Tell Us About Your Financial Position
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Help Smartie analyze your wealth potential and provide personalized advice
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g., Software Engineer, Teacher, etc."
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="annualSalary">Annual Salary (£)</Label>
                      <Input
                        id="annualSalary"
                        type="number"
                        value={formData.annualSalary}
                        onChange={(e) => setFormData(prev => ({ ...prev, annualSalary: e.target.value }))}
                        placeholder="e.g., 35000"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="financialGoal">Primary Financial Goal (Optional)</Label>
                      <Input
                        id="financialGoal"
                        value={formData.financialGoal}
                        onChange={(e) => setFormData(prev => ({ ...prev, financialGoal: e.target.value }))}
                        placeholder="e.g., Buy a house, Retire early, etc."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                      disabled={updateFinancialInfo.isPending}
                    >
                      {updateFinancialInfo.isPending ? 'Analyzing...' : 'Analyze My Wealth Potential'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Financial Overview */}
          {syncedUser?.monthlyIncome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Income</p>
                        <p className="text-xl font-bold text-blue-600">£{monthlyIncome.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Expenses</p>
                        <p className="text-xl font-bold text-red-600">£{monthlyExpenses.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calculator className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Savings Rate</p>
                        <p className="text-xl font-bold text-green-600">{savingsRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Wealth Projection Chart */}
          {syncedUser?.monthlyIncome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WealthProjectionChart
                currentSavings={totalSaved}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                savingsRate={Math.max(savingsRate, 0)}
                years={10}
              />
            </motion.div>
          )}

          {/* Savings Tree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SavingsTreeVisualization
              totalSaved={totalSaved}
              goals={goals.map((goal: any) => ({
                id: goal.id,
                title: goal.title,
                targetAmount: parseFloat(goal.targetAmount),
                currentAmount: parseFloat(goal.currentAmount || '0'),
                completed: goal.completed || false
              }))}
              onWaterTree={() => {
                toast({
                  title: "Tree Watered! 💧",
                  description: "Your financial tree is growing stronger!"
                });
              }}
            />
          </motion.div>

          {/* Career Insights */}
          {syncedUser?.jobTitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Career & Wealth Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Role:</span>
                      <span className="font-semibold">{syncedUser.jobTitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Salary:</span>
                      <span className="font-semibold">£{syncedUser.annualSalary?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Financial Health:</span>
                      <span className={`font-semibold ${
                        savingsRate >= 20 ? 'text-green-600' : 
                        savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {savingsRate >= 20 ? 'Excellent' : 
                         savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <BottomNav currentTab="analytics" />
      </div>
    </ResponsiveLayout>
  );
}