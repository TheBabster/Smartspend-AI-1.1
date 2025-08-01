import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import BottomNav from '@/components/BottomNav';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import FinancialPositionWizard from '@/components/FinancialPositionWizard';
import SavingsTreeVisualization from '@/components/SavingsTreeVisualization';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  PiggyBank,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart
} from 'lucide-react';
import type { Goal } from '@shared/schema';

export default function Goals() {
  const { user: firebaseUser } = useAuth();
  const { toast } = useToast();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showFinancialWizard, setShowFinancialWizard] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings'
  });
  const [dbUser, setDbUser] = useState<any>(null);

  const queryClient = useQueryClient();

  // Sync Firebase user with database first
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
      const userData = await response.json();
      setDbUser(userData);
      return userData;
    },
    enabled: !!firebaseUser
  });

  // Fetch goals using the synced user ID
  const { data: goals = [], isLoading, refetch: refetchGoals } = useQuery<Goal[]>({ 
    queryKey: ['/api/goals', syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      console.log('🔍 Fetching goals for user:', syncedUser.id);
      const response = await fetch(`/api/goals/${syncedUser.id}`);
      const data = await response.json();
      console.log('📋 Goals received:', data);
      return data;
    },
    enabled: !!syncedUser?.id
  });

  // Add goal mutation
  const addGoalMutation = useMutation({
    mutationFn: async (goal: any) => {
      console.log('🚀 Submitting goal to API:', goal);
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('❌ API Error:', error);
        throw new Error(`Failed to create goal: ${error}`);
      }
      
      const result = await response.json();
      console.log('✅ Goal created successfully:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Goal creation successful, refreshing goals...');
      // Force immediate refetch
      refetchGoals();
      queryClient.invalidateQueries({ queryKey: ['/api/goals', syncedUser?.id] });
      setShowAddGoal(false);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'savings'
      });
    },
    onError: (error) => {
      console.error('❌ Goal creation failed:', error);
    }
  });

  // Add money to goal mutation
  const addMoneyMutation = useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string, amount: number }) => {
      return fetch(`/api/goals/${goalId}/add-money`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      }).then(res => res.json());
    },
    onSuccess: () => {
      console.log('🔄 Refreshing goals after money addition...');
      refetchGoals();
      queryClient.invalidateQueries({ queryKey: ['/api/goals', syncedUser?.id] });
    }
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      return response.json();
    },
    onSuccess: () => {
      refetchGoals();
      queryClient.invalidateQueries({ queryKey: ['/api/goals', syncedUser?.id] });
      toast({
        title: 'Goal Deleted',
        description: 'Your goal has been successfully deleted.',
      });
    },
    onError: () => {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete goal. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !syncedUser?.id) return;
    
    const goalData = {
      userId: syncedUser.id,
      title: newGoal.name,
      targetAmount: newGoal.targetAmount, // Keep as string for decimal field
      currentAmount: newGoal.currentAmount || '0', // Keep as string for decimal field
      targetDate: newGoal.targetDate || null,
      icon: newGoal.category
    };
    
    console.log('🎯 Sending goal data:', goalData);
    addGoalMutation.mutate(goalData);
  };

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'house': return <Home className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'vacation': return <Plane className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'emergency': return <Heart className="w-5 h-5" />;
      default: return <PiggyBank className="w-5 h-5" />;
    }
  };

  const getGoalColor = (category: string) => {
    switch (category) {
      case 'house': return 'text-blue-600';
      case 'car': return 'text-green-600';
      case 'vacation': return 'text-orange-600';
      case 'education': return 'text-purple-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-pink-600';
    }
  };

  return (
    <ResponsiveLayout className="bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pt-4"
      >
        <div className="w-20 h-20 mx-auto mb-4">
          <ExactSmartieAvatar mood="happy" size="xl" animated={true} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Financial Goals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Set your financial goals and track your progress. Smartie will help you stay motivated!
        </p>
      </motion.div>

      {/* Add Goal Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowAddGoal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Goal
          </Button>
          <Button
            onClick={() => window.location.href = '/analytics'}
            variant="outline"
            className="border-2 border-blue-300 hover:bg-blue-50"
          >
            <Target className="w-5 h-5 mr-2" />
            Financial Position
          </Button>
        </div>
      </motion.div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="Emergency Fund, House Deposit, etc."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetAmount">Target Amount (£)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="currentAmount">Current Amount (£)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="savings">General Savings</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="house">House Deposit</option>
                  <option value="car">Car Purchase</option>
                  <option value="vacation">Vacation</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date (Optional)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddGoal} 
                  disabled={addGoalMutation.isPending}
                  className="flex-1"
                >
                  {addGoalMutation.isPending ? 'Adding...' : 'Add Goal'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}





      {/* Goals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <ExactSmartieAvatar mood="thinking" size="lg" animated={true} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4">
              <ExactSmartieAvatar mood="happy" size="xl" animated={true} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Goals Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto">
              Start your financial journey by setting your first goal. Every big achievement starts with a clear target!
            </p>
            <Button
              onClick={() => setShowAddGoal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </motion.div>
        ) : (
          goals.map((goal, index) => {
            const progress = Math.min(
              (parseFloat(goal.currentAmount || '0') / parseFloat(goal.targetAmount)) * 100,
              100
            );
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={getGoalColor(goal.icon || 'savings')}>
                        {getGoalIcon(goal.icon || 'savings')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          £{goal.currentAmount || 0} of £{goal.targetAmount}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            {progress.toFixed(1)}%
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Delete button clicked for goal:', goal.id, goal.title);
                            if (window.confirm(`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`)) {
                              console.log('User confirmed deletion, calling mutation');
                              deleteGoalMutation.mutate(goal.id);
                            } else {
                              console.log('User cancelled deletion');
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 z-10 relative"
                          disabled={deleteGoalMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={progress} className="h-3" />
                      
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Amount to add"
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const amount = parseFloat((e.target as HTMLInputElement).value);
                              if (amount > 0) {
                                addMoneyMutation.mutate({ goalId: goal.id, amount });
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                            const amount = parseFloat(input?.value || '0');
                            if (amount > 0) {
                              addMoneyMutation.mutate({ goalId: goal.id, amount });
                              input.value = '';
                            }
                          }}
                          disabled={addMoneyMutation.isPending}
                        >
                          Add
                        </Button>
                      </div>

                      {goal.targetDate && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav currentTab="goals" />
    </ResponsiveLayout>
  );
}