import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, TrendingUp } from 'lucide-react';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  emoji: string;
  deadline?: string;
  createdAt: string;
}

interface SavingsGoalEngineProps {
  goals: SavingsGoal[];
  onCreateGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, amount: number) => void;
}

const SavingsGoalEngine: React.FC<SavingsGoalEngineProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    emoji: '🎯',
    deadline: ''
  });

  const goalCategories = [
    { name: "Gaming", emoji: "🕹️", items: ["PS5", "Gaming PC", "Nintendo Switch", "Gaming Chair"] },
    { name: "Travel", emoji: "✈️", items: ["Holiday", "Weekend Trip", "Road Trip", "Concert"] },
    { name: "Fashion", emoji: "👟", items: ["New Shoes", "Designer Bag", "Jacket", "Watch"] },
    { name: "Tech", emoji: "📱", items: ["iPhone", "AirPods", "Laptop", "Tablet"] },
    { name: "Fitness", emoji: "💪", items: ["Gym Membership", "Home Gym", "Running Shoes", "Bike"] },
    { name: "Education", emoji: "📚", items: ["Course", "Books", "Certification", "Workshop"] }
  ];

  const getProgressPercentage = (goal: SavingsGoal) => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const getSmartieEncouragement = (progress: number, goalName: string) => {
    if (progress >= 100) {
      return {
        message: `🎉 Goal achieved! You've saved for your ${goalName}! Time to celebrate!`,
        mood: "celebrating" as const,
        animation: "milestone" as const
      };
    } else if (progress >= 75) {
      return {
        message: `You're so close! ${Math.round(100 - progress)}% to go for your ${goalName}! 🔥`,
        mood: "confident" as const,
        animation: "positive" as const
      };
    } else if (progress >= 50) {
      return {
        message: `Halfway there! You're ${Math.round(progress)}% closer to your ${goalName}! 💪`,
        mood: "happy" as const,
        animation: "positive" as const
      };
    } else if (progress >= 25) {
      return {
        message: `Great start! Keep building towards your ${goalName}! 📈`,
        mood: "thinking" as const,
        animation: "thinking" as const
      };
    } else {
      return {
        message: `Every pound counts! Start small for your ${goalName}! 🌱`,
        mood: "happy" as const,
        animation: "greeting" as const
      };
    }
  };

  const handleCreateGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      onCreateGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        category: newGoal.category || "Other",
        emoji: newGoal.emoji,
        deadline: newGoal.deadline || undefined
      });
      
      setNewGoal({
        name: '',
        targetAmount: '',
        category: '',
        emoji: '🎯',
        deadline: ''
      });
      setShowCreateForm(false);
    }
  };

  const getTimeToGoal = (goal: SavingsGoal) => {
    if (goal.deadline) {
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return `${diffDays} days left`;
      } else {
        return "Deadline passed";
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Goal Button */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🎯 Savings Goals
              </CardTitle>
              <p className="text-gray-600 mt-1">Turn dreams into achievable targets</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>

        {/* Create Goal Form */}
        {showCreateForm && (
          <CardContent className="border-t">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Goal Name</label>
                  <Input
                    placeholder="e.g., PlayStation 5"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Target Amount (£)</label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newGoal.category}
                    onChange={(e) => {
                      const category = goalCategories.find(c => c.name === e.target.value);
                      setNewGoal(prev => ({ 
                        ...prev, 
                        category: e.target.value,
                        emoji: category?.emoji || '🎯'
                      }));
                    }}
                  >
                    <option value="">Select category</option>
                    {goalCategories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.emoji} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Deadline (Optional)</label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateGoal} className="bg-green-500 hover:bg-green-600 text-white">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </CardContent>
        )}
      </Card>

      {/* Active Goals */}
      <div className="grid gap-6">
        {goals.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-4">Create your first savings goal to start building towards your dreams!</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Create First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const encouragement = getSmartieEncouragement(progress, goal.name);
            const timeLeft = getTimeToGoal(goal);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.emoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{goal.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{goal.category}</Badge>
                            {timeLeft && (
                              <Badge variant={timeLeft.includes("left") ? "default" : "destructive"}>
                                {timeLeft}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          £{goal.currentAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          of £{goal.targetAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {progress.toFixed(1)}% Complete
                        </span>
                        <span className="text-sm text-gray-600">
                          £{(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    {/* Smartie Encouragement */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-start gap-3">
                        <ExactSmartieAvatar
                          mood={encouragement.mood}
                          size="sm"
                          animated={true}
                          animationType={encouragement.animation}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {encouragement.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions with Custom Amount */}
                    <div className="space-y-2 mt-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateGoal(goal.id, 5)}
                          className="flex-1"
                        >
                          +£5
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateGoal(goal.id, 10)}
                          className="flex-1"
                        >
                          +£10
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateGoal(goal.id, 25)}
                          className="flex-1"
                        >
                          +£25
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          className="flex-1"
                          id={`custom-${goal.id}`}
                          min="0.01"
                          step="0.01"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById(`custom-${goal.id}`) as HTMLInputElement;
                            const amount = parseFloat(input.value);
                            if (amount && amount > 0) {
                              onUpdateGoal(goal.id, amount);
                              input.value = '';
                            }
                          }}
                          variant="default"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Goal Suggestions */}
      {goals.length === 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">💡 Popular Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goalCategories.flatMap(category => 
                category.items.map(item => (
                  <Button
                    key={item}
                    variant="outline"
                    className="flex items-center gap-2 h-auto py-3 text-left"
                    onClick={() => {
                      setNewGoal(prev => ({
                        ...prev,
                        name: item,
                        category: category.name,
                        emoji: category.emoji
                      }));
                      setShowCreateForm(true);
                    }}
                  >
                    <span>{category.emoji}</span>
                    <span className="text-sm">{item}</span>
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoalEngine;