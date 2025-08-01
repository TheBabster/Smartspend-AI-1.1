import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, TreePine, Star, Trophy, Target } from 'lucide-react';

interface SavingsTreeProps {
  totalSaved: number;
  goals: Array<{
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    completed: boolean;
  }>;
  onWaterTree?: () => void;
  onResetTree?: () => void;
}

const SavingsTreeVisualization: React.FC<SavingsTreeProps> = ({
  totalSaved,
  goals,
  onWaterTree = () => {},
  onResetTree = () => {}
}) => {
  const [treeStage, setTreeStage] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Calculate tree growth based on total savings
  useEffect(() => {
    if (totalSaved < 100) setTreeStage(0);      // Seed
    else if (totalSaved < 500) setTreeStage(1);  // Sprout
    else if (totalSaved < 1000) setTreeStage(2); // Sapling
    else if (totalSaved < 2500) setTreeStage(3); // Young tree
    else if (totalSaved < 5000) setTreeStage(4); // Mature tree
    else setTreeStage(5);                         // Mighty oak
  }, [totalSaved]);

  const generateParticles = () => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200,
      y: Math.random() * 150
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const getTreeEmoji = () => {
    switch (treeStage) {
      case 0: return '🌱'; // Seed
      case 1: return '🌿'; // Sprout  
      case 2: return '🌳'; // Sapling
      case 3: return '🌲'; // Young tree
      case 4: return '🌴'; // Mature tree
      case 5: return '🌳'; // Mighty oak
      default: return '🌱';
    }
  };

  const getTreeMessage = () => {
    switch (treeStage) {
      case 0: return "Plant your first savings seed!";
      case 1: return "Your savings are sprouting!";
      case 2: return "Your financial sapling is growing!";
      case 3: return "A strong young tree is taking root!";
      case 4: return "Your mature savings tree is flourishing!";
      case 5: return "Mighty financial oak! You're financially strong!";
      default: return "Start your savings journey!";
    }
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-green-600" />
          Your Savings Tree
        </CardTitle>
        <p className="text-sm text-gray-600">Watch your financial growth bloom!</p>
        
        {/* How It Works Info */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-left">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
            <Target className="w-4 h-4" />
            <span className="font-semibold text-sm">How Your Tree Grows</span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="mb-1">Based on <strong>real goal progress</strong>:</p>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <span>🌱 £0-99</span>
              <span>🌿 £100-499</span>
              <span>🌳 £500-999</span>
              <span>🌲 £1K-2.5K</span>
              <span>🌴 £2.5K-5K</span>
              <span>🌳 £5K+</span>
            </div>
            <p className="mt-2 text-xs bg-blue-100 dark:bg-blue-800 p-1 rounded">
              💡 Only verified savings from completed goals count toward growth!
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Particle Effects */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0, x: particle.x, y: particle.y }}
              animate={{ 
                opacity: 0, 
                scale: 1.5, 
                y: particle.y - 50,
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute text-yellow-500 text-xl pointer-events-none"
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tree Visualization */}
        <div className="text-center space-y-6">
          <motion.div
            className="text-8xl"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            {getTreeEmoji()}
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {getTreeMessage()}
            </h3>
            <p className="text-2xl font-bold text-green-600">
              £{totalSaved.toFixed(2)} saved
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Reset Tree Button (when needed) */}
          {totalSaved > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset your savings tree? This will clear your current savings record but keep your goals.')) {
                    onResetTree();
                  }
                }}
                className="w-full text-gray-600 hover:text-red-600 hover:border-red-600"
              >
                Reset Savings Tree
              </Button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Only reset if your savings amount no longer reflects reality
              </p>
            </div>
          )}

          {/* Goal Fruits on Tree */}
          {goals.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Goal Fruits</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant={goal.completed ? "default" : "outline"}
                      className={`${goal.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {goal.completed ? '🍎' : '🌸'} {goal.title}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Water Tree Button */}
          <Button
            onClick={() => {
              onWaterTree();
              generateParticles();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={treeStage >= 5}
          >
            <span className="mr-2">💧</span>
            Water Your Tree
          </Button>

          {/* Achievements */}
          {treeStage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  Tree Achievement Unlocked!
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Your consistent saving has grown a beautiful financial tree!
              </p>
            </motion.div>
          )}
        </div>

        {/* Growth Stages Guide */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">Growth Stages</h5>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className={`text-center p-2 rounded ${treeStage >= 0 ? 'bg-green-100' : ''}`}>
              🌱 Seed<br/>£0-99
            </div>
            <div className={`text-center p-2 rounded ${treeStage >= 1 ? 'bg-green-100' : ''}`}>
              🌿 Sprout<br/>£100-499
            </div>
            <div className={`text-center p-2 rounded ${treeStage >= 2 ? 'bg-green-100' : ''}`}>
              🌳 Sapling<br/>£500-999
            </div>
            <div className={`text-center p-2 rounded ${treeStage >= 3 ? 'bg-green-100' : ''}`}>
              🌲 Young<br/>£1K-2.5K
            </div>
            <div className={`text-center p-2 rounded ${treeStage >= 4 ? 'bg-green-100' : ''}`}>
              🌴 Mature<br/>£2.5K-5K
            </div>
            <div className={`text-center p-2 rounded ${treeStage >= 5 ? 'bg-green-100' : ''}`}>
              🌳 Mighty<br/>£5K+
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsTreeVisualization;