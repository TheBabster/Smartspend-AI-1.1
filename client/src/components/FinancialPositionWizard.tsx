import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, DollarSign, Target, Calculator } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface FinancialPositionWizardProps {
  userId: string;
}

export default function FinancialPositionWizard({ userId }: FinancialPositionWizardProps) {
  const [financialData, setFinancialData] = useState({
    monthlyIncome: '',
    jobTitle: '',
    currentSavings: '',
    monthlyExpenses: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user financial info
  const { data: user } = useQuery({
    queryKey: ['/api/user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}`);
      return response.json();
    },
    enabled: !!userId
  });

  // Update financial info mutation
  const updateFinancialInfoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/user/${userId}/financial-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', userId] });
      toast({
        title: "Financial Position Updated!",
        description: "Your financial information has been saved successfully.",
      });
    }
  });

  const handleSubmit = () => {
    if (!financialData.monthlyIncome || !financialData.jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in your monthly income and job title.",
        variant: "destructive"
      });
      return;
    }

    // Validate income is reasonable (not fake numbers)
    const income = parseFloat(financialData.monthlyIncome);
    const expenses = parseFloat(financialData.monthlyExpenses || '0');
    const savings = parseFloat(financialData.currentSavings || '0');

    if (income < 500 || income > 50000) {
      toast({
        title: "Please Enter Realistic Income",
        description: "Monthly income should be between £500 and £50,000 for accurate analysis.",
        variant: "destructive"
      });
      return;
    }

    if (expenses > income * 2) {
      toast({
        title: "Check Your Expenses",
        description: "Monthly expenses seem unusually high compared to income. Please verify.",
        variant: "destructive"
      });
      return;
    }

    updateFinancialInfoMutation.mutate({
      monthlyIncome: financialData.monthlyIncome,
      jobTitle: financialData.jobTitle,
      currentSavings: financialData.currentSavings || '0',
      monthlyExpenses: financialData.monthlyExpenses || '0'
    });
  };

  // Generate wealth projection data
  const generateWealthProjection = () => {
    const income = parseFloat(financialData.monthlyIncome || '0');
    const expenses = parseFloat(financialData.monthlyExpenses || '0');
    const currentSavings = parseFloat(financialData.currentSavings || '0');
    const monthlySavings = income - expenses;

    const projectionData = [];
    let savings = currentSavings;
    
    for (let year = 0; year <= 10; year++) {
      // Conservative scenario (50% savings rate)
      const conservativeSavings = savings + (monthlySavings * 0.5 * 12 * year);
      // Optimal scenario (70% savings rate)
      const optimalSavings = savings + (monthlySavings * 0.7 * 12 * year);
      // Current pace scenario
      const currentSavings = savings + (monthlySavings * 12 * year);

      projectionData.push({
        year: new Date().getFullYear() + year,
        conservative: Math.max(0, conservativeSavings),
        optimal: Math.max(0, optimalSavings),
        current: Math.max(0, currentSavings)
      });
    }

    return projectionData;
  };

  const projectionData = generateWealthProjection();

  return (
    <div className="space-y-6">
      {/* Financial Position Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            Your Financial Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (£)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={financialData.monthlyIncome}
                onChange={(e) => setFinancialData({...financialData, monthlyIncome: e.target.value})}
                placeholder="3000"
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={financialData.jobTitle}
                onChange={(e) => setFinancialData({...financialData, jobTitle: e.target.value})}
                placeholder="Software Engineer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentSavings">Current Savings (£)</Label>
              <Input
                id="currentSavings"
                type="number"
                value={financialData.currentSavings}
                onChange={(e) => setFinancialData({...financialData, currentSavings: e.target.value})}
                placeholder="5000"
              />
            </div>
            <div>
              <Label htmlFor="monthlyExpenses">Monthly Expenses (£)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={financialData.monthlyExpenses}
                onChange={(e) => setFinancialData({...financialData, monthlyExpenses: e.target.value})}
                placeholder="2000"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={updateFinancialInfoMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            {updateFinancialInfoMutation.isPending ? 'Saving...' : 'Update Financial Position'}
          </Button>
        </CardContent>
      </Card>

      {/* Wealth Projection Chart */}
      {financialData.monthlyIncome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                10-Year Wealth Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="conservative" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Conservative (50% savings)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Current pace"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="optimal" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Optimal (70% savings)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-red-50 rounded">
                  <div className="text-sm text-red-600 font-medium">Conservative</div>
                  <div className="text-lg font-bold text-red-700">
                    £{projectionData[10]?.conservative.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-sm text-blue-600 font-medium">Current Pace</div>
                  <div className="text-lg font-bold text-blue-700">
                    £{projectionData[10]?.current.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-sm text-green-600 font-medium">Optimal</div>
                  <div className="text-lg font-bold text-green-700">
                    £{projectionData[10]?.optimal.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}