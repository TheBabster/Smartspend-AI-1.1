import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Flower2, Cherry, Bird, Star, Trophy, Gift } from "lucide-react";
import { CountUp, PulseGlow } from "./MicroAnimations";

interface TreeGrowthStage {
  id: string;
  name: string;
  requiredSavings: number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
}

interface SavingsTreeProps {
  totalSaved: number;
  currentStreak: number;
  monthlyStreak: number;
}

export default function SavingsTreeGamification({ 
  totalSaved, 
  currentStreak, 
  monthlyStreak 
}: SavingsTreeProps) {
  const [animateNewGrowth, setAnimateNewGrowth] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const treeStages: TreeGrowthStage[] = [
    {
      id: "seedling",
      name: "Tiny Seedling",
      requiredSavings: 0,
      description: "Your savings journey begins!",
      icon: Star,
      color: "text-green-400",
      unlocked: true
    },
    {
      id: "first_leaves",
      name: "First Leaves",
      requiredSavings: 10,
      description: "£10 saved - your first leaves appear!",
      icon: Leaf,
      color: "text-green-500",
      unlocked: totalSaved >= 10
    },
    {
      id: "growing_tree",
      name: "Growing Tree",
      requiredSavings: 50,
      description: "£50 saved - the tree is getting stronger!",
      icon: Leaf,
      color: "text-green-600",
      unlocked: totalSaved >= 50
    },
    {
      id: "flowering",
      name: "Beautiful Flowers",
      requiredSavings: 100,
      description: "£100 saved + 1 month streak - flowers bloom!",
      icon: Flower2,
      color: "text-pink-500",
      unlocked: totalSaved >= 100 && monthlyStreak >= 1
    },
    {
      id: "bearing_fruit",
      name: "Bearing Fruit",
      requiredSavings: 250,
      description: "£250 saved + 3 month streak - delicious fruit grows!",
      icon: Cherry,
      color: "text-red-500",
      unlocked: totalSaved >= 250 && monthlyStreak >= 3
    },
    {
      id: "bird_nest",
      name: "Bird's Paradise",
      requiredSavings: 500,
      description: "£500 saved + 6 month streak - a bird makes its home!",
      icon: Bird,
      color: "text-blue-500",
      unlocked: totalSaved >= 500 && monthlyStreak >= 6
    }
  ];

  const currentStage = treeStages.reduce((current, stage) => 
    stage.unlocked ? stage : current
  );

  const nextStage = treeStages.find(stage => !stage.unlocked);

  // Calculate leaves based on £10 intervals
  const leafCount = Math.floor(totalSaved / 10);
  const maxLeaves = 20; // Visual limit for the tree

  // Generate leaf positions for animation
  const generateLeafPositions = () => {
    const positions = [];
    const actualLeaves = Math.min(leafCount, maxLeaves);
    
    for (let i = 0; i < actualLeaves; i++) {
      // Distribute leaves around the tree crown
      const angle = (i / actualLeaves) * 360;
      const radius = 60 + (i % 3) * 15; // Vary the radius for natural look
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      positions.push({ x, y, delay: i * 0.1 });
    }
    return positions;
  };

  const leafPositions = generateLeafPositions();

  useEffect(() => {
    // Check if user just reached a new milestone
    const previousSavings = totalSaved - 10; // Simulate previous state
    const previousStage = treeStages.reduce((current, stage) => 
      stage.requiredSavings <= previousSavings && 
      (stage.id !== "flowering" || monthlyStreak >= 1) &&
      (stage.id !== "bearing_fruit" || monthlyStreak >= 3) &&
      (stage.id !== "bird_nest" || monthlyStreak >= 6)
        ? stage : current
    );

    if (currentStage.id !== previousStage.id) {
      setAnimateNewGrowth(true);
      setShowCelebration(true);
      
      setTimeout(() => {
        setAnimateNewGrowth(false);
        setShowCelebration(false);
      }, 3000);
    }
  }, [totalSaved, currentStreak, monthlyStreak]);

  const TreeVisualization = () => (
    <div className="relative w-80 h-80 mx-auto flex items-end justify-center">
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-green-200 to-green-100 dark:from-green-800 dark:to-green-700 rounded-full" />
      
      {/* Tree Trunk */}
      <motion.div
        className="relative w-6 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg z-10"
        style={{ height: Math.min(80 + (totalSaved / 10) * 2, 120) }}
        initial={{ height: 80 }}
        animate={{ height: Math.min(80 + (totalSaved / 10) * 2, 120) }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Tree Crown Background */}
      <motion.div
        className="absolute bottom-16 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-80"
        initial={{ scale: 0.5 }}
        animate={{ scale: Math.min(1 + (totalSaved / 200), 1.5) }}
        transition={{ duration: 1 }}
      />

      {/* Leaves */}
      <div className="absolute bottom-20">
        {leafPositions.map((pos, index) => (
          <motion.div
            key={index}
            className="absolute w-4 h-4"
            style={{ 
              left: `calc(50% + ${pos.x}px)`, 
              top: `calc(50% + ${pos.y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: pos.delay,
              type: "spring",
              stiffness: 200 
            }}
          >
            <Leaf className="w-4 h-4 text-green-500" />
          </motion.div>
        ))}
      </div>

      {/* Flowers (if unlocked) */}
      {currentStage.id === "flowering" || currentStage.id === "bearing_fruit" || currentStage.id === "bird_nest" ? (
        <div className="absolute bottom-24">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={`flower-${index}`}
              className="absolute w-6 h-6"
              style={{ 
                left: `calc(50% + ${(index - 1.5) * 30}px)`, 
                top: `calc(50% + ${Math.sin(index) * 20}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 1 + index * 0.2,
                type: "spring"
              }}
            >
              <Flower2 className="w-6 h-6 text-pink-500" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Fruit (if unlocked) */}
      {currentStage.id === "bearing_fruit" || currentStage.id === "bird_nest" ? (
        <div className="absolute bottom-28">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`fruit-${index}`}
              className="absolute w-5 h-5"
              style={{ 
                left: `calc(50% + ${(index - 1) * 25}px)`, 
                top: `calc(50% + ${index * 10}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 1.5 + index * 0.3,
                type: "spring"
              }}
            >
              <Cherry className="w-5 h-5 text-red-500" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Bird (if unlocked) */}
      {currentStage.id === "bird_nest" ? (
        <motion.div
          className="absolute bottom-36 right-8"
          initial={{ x: 100, y: -50 }}
          animate={{ x: 0, y: 0 }}
          transition={{ 
            duration: 2, 
            delay: 2,
            type: "spring"
          }}
        >
          <Bird className="w-8 h-8 text-blue-500" />
        </motion.div>
      ) : null}

      {/* Celebration Effects */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3"
                style={{
                  left: `${20 + (i % 4) * 20}%`,
                  top: `${20 + Math.floor(i / 4) * 20}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [1, 1.5, 0], 
                  rotate: 360,
                  y: [-10, -30, -50]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.1,
                  repeat: 2 
                }}
              >
                <Star className="w-3 h-3 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tree Growth Header */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Savings Tree</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Watch it grow as you save money and build streaks!
            </p>
          </div>

          {/* Current Stage Display */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <PulseGlow color="green" intensity="medium">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <currentStage.icon className={`w-6 h-6 ${currentStage.color}`} />
              </div>
            </PulseGlow>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{currentStage.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStage.description}
              </p>
            </div>
          </div>

          {/* Tree Visualization */}
          <TreeVisualization />

          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CountUp 
                from={0} 
                to={totalSaved} 
                prefix="£" 
                className="text-lg font-bold text-green-600"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Saved</p>
            </div>
            
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-lg font-bold text-blue-600">{leafCount}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Leaves Grown</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-lg font-bold text-purple-600">{currentStreak}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
            </div>
            
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-lg font-bold text-orange-600">{monthlyStreak}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Month Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      {nextStage && (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Next Milestone
              </h3>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <nextStage.icon className={`w-8 h-8 ${nextStage.color} opacity-50`} />
                <div>
                  <h4 className="font-medium">{nextStage.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {nextStage.description}
                  </p>
                </div>
              </div>

              {/* Progress to next stage */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((totalSaved / nextStage.requiredSavings) * 100, 100)}%` 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                £{(nextStage.requiredSavings - totalSaved).toFixed(0)} more to unlock
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Growth Stages */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Growth Stages</h3>
          <div className="space-y-3">
            {treeStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  stage.unlocked 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stage.icon className={`w-6 h-6 ${stage.unlocked ? stage.color : 'text-gray-400'}`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${stage.unlocked ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>
                    {stage.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stage.description}
                  </p>
                </div>
                {stage.unlocked && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Unlocked
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}