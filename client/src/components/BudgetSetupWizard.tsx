import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Wallet, ShoppingCart, Car, Home, Utensils, Gamepad2 } from 'lucide-react';

const budgetCategories = [
  { name: 'Food & Dining', icon: Utensils, color: 'text-orange-500' },
  { name: 'Shopping', icon: ShoppingCart, color: 'text-purple-500' },
  { name: 'Transportation', icon: Car, color: 'text-green-500' },
  { name: 'Entertainment', icon: Gamepad2, color: 'text-blue-500' },
  { name: 'Utilities', icon: Home, color: 'text-red-500' },
];

interface BudgetSetupWizardProps {
  onComplete: () => void;
}

export default function BudgetSetupWizard({ onComplete }: BudgetSetupWizardProps) {
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

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

  const createBudgetMutation = useMutation({
    mutationFn: async (budgetData: any) => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      onComplete();
    }
  });

  const handleSaveBudgets = async () => {
    if (!syncedUser?.id) {
      console.error('User authentication required to save budgets');
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    for (const [category, amount] of Object.entries(budgets)) {
      if (amount && parseFloat(amount) > 0) {
        await createBudgetMutation.mutateAsync({
          userId: syncedUser.id,
          category,
          monthlyLimit: amount,
          spent: '0',
          month: currentMonth
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-purple-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Set Your Monthly Budget</h3>
        <p className="text-gray-600 dark:text-gray-400">Enter how much you want to spend in each category per month</p>
      </div>

      <div className="grid gap-4">
        {budgetCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name} className="border-2 hover:border-purple-200 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Icon className={`w-6 h-6 ${category.color}`} />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">{category.name}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">£</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={budgets[category.name] || ''}
                      onChange={(e) => setBudgets({ ...budgets, [category.name]: e.target.value })}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={handleSaveBudgets}
          disabled={createBudgetMutation.isPending || Object.keys(budgets).length === 0}
          className="flex-1 bg-purple-500 hover:bg-purple-600"
        >
          {createBudgetMutation.isPending ? 'Saving...' : 'Save Budget'}
        </Button>
        <Button variant="outline" onClick={onComplete} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}