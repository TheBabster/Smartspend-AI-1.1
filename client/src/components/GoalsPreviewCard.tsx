import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import type { Goal } from '@shared/schema';

interface GoalsPreviewCardProps {
  goals: Goal[];
  className?: string;
}

export default function GoalsPreviewCard({ goals, className = "" }: GoalsPreviewCardProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => 
    parseFloat(goal.currentAmount || '0') >= parseFloat(goal.targetAmount)
  ).length;
  
  const totalTargetAmount = goals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount), 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount || '0'), 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'house': return '🏠';
      case 'car': return '🚗';
      case 'vacation': return '✈️';
      case 'education': return '🎓';
      case 'emergency': return '🚨';
      default: return '🎯';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Financial Goals
          </div>
          <Link href="/goals">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No goals set yet</p>
            <Link href="/goals">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Set Your First Goal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>£{totalCurrentAmount.toLocaleString()}</span>
                <span>£{totalTargetAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Goal Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalGoals}</div>
                <div className="text-sm text-purple-600">Active Goals</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
            </div>

            {/* Top 3 Goals Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Recent Goals</h4>
              {goals.slice(0, 3).map((goal) => {
                const progress = Math.min(
                  (parseFloat(goal.currentAmount || '0') / parseFloat(goal.targetAmount)) * 100,
                  100
                );
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span className="text-lg">{getGoalIcon(goal.icon || 'savings')}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{goal.title}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-1 flex-1" />
                        <span className="text-xs text-gray-600">{progress.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Action */}
            <Link href="/goals">
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Manage All Goals
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}