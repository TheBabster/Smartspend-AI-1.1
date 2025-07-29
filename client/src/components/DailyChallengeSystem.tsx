import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, Flame, Trophy, CheckCircle, Clock, Coins } from 'lucide-react';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'spending' | 'savings' | 'mindful' | 'streak';
  target: number;
  progress: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft: string;
  completed: boolean;
}

interface DailyChallengeSystemProps {
  className?: string;
}

const DailyChallengeSystem: React.FC<DailyChallengeSystemProps> = ({ className = "" }) => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalChallengesCompleted, setTotalChallengesCompleted] = useState(24);
  const [todayCompleted, setTodayCompleted] = useState(false);

  // Sample challenges - in real app, these would come from API
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Mindful Spending Day',
      description: 'Think for 30 seconds before any purchase over £10',
      type: 'mindful',
      target: 3,
      progress: 1,
      reward: '50 Smartie Points',
      difficulty: 'easy',
      timeLeft: '8h 42m',
      completed: false
    },
    {
      id: '2',
      title: 'Budget Guardian',
      description: 'Stay under £25 total spending today',
      type: 'spending',
      target: 25,
      progress: 12,
      reward: 'Savings Streak Badge',
      difficulty: 'medium',
      timeLeft: '8h 42m',
      completed: false
    },
    {
      id: '3',
      title: 'Impulse Resist Master',
      description: 'Skip one impulse purchase you considered',
      type: 'mindful',
      target: 1,
      progress: 0,
      reward: 'Willpower Champion Badge',
      difficulty: 'hard',
      timeLeft: '8h 42m',
      completed: false
    }
  ]);

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: challenge.target }
          : challenge
      )
    );
    
    setTotalChallengesCompleted(prev => prev + 1);
    
    // Check if all challenges completed for streak
    const updatedChallenges = challenges.map(c => 
      c.id === challengeId ? { ...c, completed: true } : c
    );
    
    if (updatedChallenges.every(c => c.completed) && !todayCompleted) {
      setTodayCompleted(true);
      setCurrentStreak(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spending': return <Coins className="w-4 h-4" />;
      case 'savings': return <Target className="w-4 h-4" />;
      case 'mindful': return <CheckCircle className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const completedToday = challenges.filter(c => c.completed).length;
  const totalToday = challenges.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Smartie and Streak */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ExactSmartieAvatar 
                mood={completedToday === totalToday ? "celebrating" : "thinking"} 
                size="lg" 
                animated={true} 
                animationType={completedToday === totalToday ? "celebration" : "thinking"}
              />
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  Daily Challenges
                </h3>
                <p className="text-sm text-gray-600">
                  Complete challenges to build your streak and earn rewards!
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
          </div>
          
          {/* Progress Bar for Today */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Today's Progress</span>
              <span className="text-sm text-gray-600">{completedToday}/{totalToday}</span>
            </div>
            <Progress value={(completedToday / totalToday) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${
              challenge.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-purple-300'
            } transition-all duration-200`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      challenge.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {getTypeIcon(challenge.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700">
                            {challenge.progress}/{challenge.target}
                          </span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.target) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      {challenge.timeLeft}
                    </div>
                    
                    {challenge.completed ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge(challenge.id)}
                        disabled={challenge.progress >= challenge.target}
                        className={`${
                          challenge.progress >= challenge.target
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-purple-500 hover:bg-purple-600'
                        } text-white`}
                      >
                        {challenge.progress >= challenge.target ? 'Claim' : 'Mark Done'}
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Reward */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Reward:</span>
                  <span className="text-sm text-yellow-600">{challenge.reward}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Streak Celebration */}
      <AnimatePresence>
        {todayCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <Card className="max-w-sm mx-4 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <ExactSmartieAvatar 
                    mood="celebrating" 
                    size="xl" 
                    animated={true} 
                    animationType="celebration"
                  />
                </motion.div>
                
                <h3 className="font-bold text-xl text-gray-800 mt-4 mb-2">
                  Streak Extended!
                </h3>
                <p className="text-gray-600 mb-4">
                  You've completed all today's challenges. Your streak is now {currentStreak} days!
                </p>
                
                <Button
                  onClick={() => setTodayCompleted(false)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Awesome! 🎉
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Challenge Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{currentStreak}</div>
              <div className="text-xs text-gray-600">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalChallengesCompleted}</div>
              <div className="text-xs text-gray-600">Total Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.floor(currentStreak / 7)}</div>
              <div className="text-xs text-gray-600">Weeks Consistent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyChallengeSystem;