import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target, Calendar, DollarSign, Trophy, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import BadgeSystem from "@/components/BadgeSystem";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AnimatedButton from "@/components/AnimatedButton";
import { type Goal } from "@shared/schema";
import { format } from "date-fns";

const goalIcons = ["🎯", "✈️", "🏠", "🚗", "💰", "🎓", "💍", "🎮", "📱", "🎸"];

export default function Goals() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    icon: "🎯",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery<Goal[]>({ 
    queryKey: ["/api/goals"] 
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      return apiRequest("POST", "/api/goals", goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setShowCreateModal(false);
      setNewGoal({ title: "", targetAmount: "", targetDate: "", icon: "🎯" });
      toast({
        title: "Goal Created! 🎉",
        description: "Your new goal has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate({
      title: newGoal.title,
      targetAmount: newGoal.targetAmount,
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
      icon: newGoal.icon,
    });
  };

  const getProgressPercentage = (current: string, target: string) => {
    const currentAmount = parseFloat(current);
    const targetAmount = parseFloat(target);
    return targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  };

  const getDaysRemaining = (targetDate: string | null) => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="px-6 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <motion.header 
        className="gradient-bg text-white px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎯 Goals & Achievements</h1>
            <p className="text-white/80 text-sm mt-1">
              Track your progress and unlock badges
            </p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="rounded-full">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Emergency Fund"
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount (£)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date (Optional)</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Choose an Icon</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {goalIcons.map((icon) => (
                      <Button
                        key={icon}
                        variant={newGoal.icon === icon ? "default" : "outline"}
                        onClick={() => setNewGoal({ ...newGoal, icon })}
                        className="h-12 text-lg"
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleCreateGoal}
                  disabled={createGoalMutation.isPending}
                  className="w-full gradient-bg text-white"
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.header>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-20">
        {/* Achievement Badges Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassmorphicCard className="p-6 mb-6" gradient="purple" glow>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Achievement Badges</h2>
                <p className="text-white/80 text-sm">Unlock badges as you reach financial milestones</p>
              </div>
            </div>
          </GlassmorphicCard>
          
          <BadgeSystem />
        </motion.section>

        {/* Goals Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <GlassmorphicCard className="p-6" gradient="blue" glow>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Savings Goals</h2>
                <p className="text-white/80 text-sm">Set targets and track your financial journey</p>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.section>

        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg text-center">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Set your first financial goal to start tracking your progress!
                </p>
                <AnimatedButton 
                  onClick={() => setShowCreateModal(true)}
                  className="gradient-bg text-white"
                  glowOnHover
                  shimmer
                >
                  Create Your First Goal
                </AnimatedButton>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal, index) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>£{goal.currentAmount} / £{goal.targetAmount}</span>
                            </div>
                            {goal.targetDate && (
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>
                                  {daysRemaining !== null ? (
                                    daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"
                                  ) : "No deadline"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(progress)}%
                          </div>
                          {goal.completed && (
                            <div className="text-sm text-green-600 font-medium">✓ Completed</div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <AnimatedProgressBar 
                        percentage={progress} 
                        color={progress >= 100 ? 'green' : progress >= 75 ? 'yellow' : 'purple'}
                        size="lg"
                        showGlow
                        animated
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>£{(parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount)).toFixed(0)} to go</span>
                        {goal.targetDate && (
                          <span>{format(new Date(goal.targetDate), "MMM dd, yyyy")}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav currentTab="goals" />
    </div>
  );
}
