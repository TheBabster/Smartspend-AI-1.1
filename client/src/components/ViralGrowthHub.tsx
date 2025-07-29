import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Share2, Trophy, Globe, Zap } from 'lucide-react';
import SocialSharingModal from './SocialSharingModal';
import ReferralSystem from './ReferralSystem';
import DailyChallengeSystem from './DailyChallengeSystem';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface ViralGrowthHubProps {
  className?: string;
}

const ViralGrowthHub: React.FC<ViralGrowthHubProps> = ({ className = "" }) => {
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedShareData, setSelectedShareData] = useState({
    type: 'milestone' as const,
    title: '',
    description: '',
    value: '',
    emoji: '',
    color: ''
  });

  // Sample global stats - would come from API
  const globalStats = {
    totalUsers: 124500,
    smartBuysToday: 3247,
    moneySavedThisWeek: 892340,
    challengesCompleted: 15678
  };

  const achievements = [
    {
      id: '1',
      title: '7-Day Streak Master',
      description: 'Completed 7 days of smart spending',
      value: '7 days',
      type: 'streak' as const,
      canShare: true
    },
    {
      id: '2',
      title: 'First £100 Saved',
      description: 'Reached your first major savings milestone',
      value: '£127.50',
      type: 'savings' as const,
      canShare: true
    },
    {
      id: '3',
      title: 'Budget Master',
      description: 'Stayed within budget for entire month',
      value: 'Monthly Goal',
      type: 'goal' as const,
      canShare: true
    }
  ];

  const handleShareAchievement = (achievement: any) => {
    setSelectedShareData({
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      value: achievement.value,
      emoji: achievement.type === 'streak' ? '🔥' : achievement.type === 'savings' ? '💰' : '🎯',
      color: achievement.type === 'streak' ? '#F59E0B' : achievement.type === 'savings' ? '#10B981' : '#8B5CF6'
    });
    setShowSocialModal(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Global Community Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <ExactSmartieAvatar 
              mood="happy" 
              size="lg" 
              animated={true} 
              animationType="greeting"
            />
            <div>
              <h2 className="font-bold text-xl text-gray-800 mb-1">
                SmartSpend Community
              </h2>
              <p className="text-sm text-gray-600">
                Join thousands of users making smarter financial decisions together!
              </p>
            </div>
          </div>

          {/* Global Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-800">
                {globalStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">SmartSpenders</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <Zap className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-800">
                {globalStats.smartBuysToday.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Smart Buys Today</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-800">
                £{(globalStats.moneySavedThisWeek / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-600">Saved This Week</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-800">
                {globalStats.challengesCompleted.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Challenges Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Invite Friends
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Wins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-6">
          <DailyChallengeSystem />
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <ReferralSystem 
            userCode="SMART2024"
            referralCount={3}
            totalRewards={150}
          />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-6">
            {/* Shareable Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {achievement.value}
                        </Badge>
                      </div>
                    </div>
                    
                    {achievement.canShare && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShareAchievement(achievement)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      >
                        Share
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Community Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah K.", streak: 28, badge: "🏆" },
                    { rank: 2, name: "Mike R.", streak: 24, badge: "🥈" },
                    { rank: 3, name: "Emma L.", streak: 22, badge: "🥉" },
                    { rank: 4, name: "You", streak: 7, badge: "🔥" },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.name === "You" 
                          ? 'bg-purple-50 border border-purple-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 text-center">
                          <span className="text-lg">{user.badge}</span>
                        </div>
                        <div>
                          <div className={`font-medium ${
                            user.name === "You" ? 'text-purple-700' : 'text-gray-800'
                          }`}>
                            #{user.rank} {user.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">{user.streak}</div>
                        <div className="text-xs text-gray-600">day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-700 font-medium">
                    Complete today's challenges to climb the leaderboard! 🚀
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Social Sharing Modal */}
      <SocialSharingModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        shareData={selectedShareData}
        userStats={{
          totalSaved: 1250,
          streakDays: 14,
          smartDecisions: 89,
          goalsAchieved: 3
        }}
      />
    </div>
  );
};

export default ViralGrowthHub;