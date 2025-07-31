import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import BottomNav from '@/components/BottomNav';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import AdvancedPurchaseDecisionModal from '@/components/AdvancedPurchaseDecisionModal';
import { 
  Brain, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';

interface Decision {
  id: string;
  itemName: string;
  amount: number;
  category: string;
  recommendation: 'yes' | 'think_again' | 'no';
  reasoning: string;
  followed?: boolean;
  regretLevel?: number;
  createdAt: string;
}

export default function SmartPurchase() {
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  // Fetch user's decision history
  const { data: decisions = [], isLoading } = useQuery<Decision[]>({ 
    queryKey: ['/api/decisions'],
  });

  // Fetch user stats using useAuth hook for proper authentication
  const { data: userStats, isLoading: statsLoading } = useQuery({ 
    queryKey: ['/api/user/financial-stats'],
    queryFn: async () => {
      // Get user from Firebase auth and sync with database
      const user = window.auth?.currentUser;
      if (!user?.email) {
        throw new Error('User not authenticated');
      }
      
      // First sync user with database to get user ID
      const syncResponse = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        })
      });
      
      if (!syncResponse.ok) {
        throw new Error('Failed to sync user');
      }
      
      const userData = await syncResponse.json();
      
      // Now fetch financial stats
      const response = await fetch(`/api/user/${userData.id}/financial-stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
    retry: 2,
    enabled: true
  });

  const recentDecisions = decisions.slice(0, 5);

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'yes':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'think_again':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'no':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'yes':
        return 'Go for it!';
      case 'think_again':
        return 'Think again';
      case 'no':
        return 'Skip it';
      default:
        return 'Unknown';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'yes':
        return 'bg-green-100 text-green-800';
      case 'think_again':
        return 'bg-yellow-100 text-yellow-800';
      case 'no':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ResponsiveLayout className="bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pt-4"
      >
        <div className="w-20 h-20 mx-auto mb-4">
          <ExactSmartieAvatar mood="happy" size="xl" animated={true} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Smart Purchase Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Get AI-powered advice on your purchases. Make smarter financial decisions with Smartie's help.
        </p>
      </motion.div>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <CardContent className="p-8 text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Ready to make a purchase?</h2>
            <p className="text-white/90 mb-6">
              Tell Smartie what you want to buy and get personalized advice based on your financial goals and spending patterns.
            </p>
            <Button
              onClick={() => setShowDecisionModal(true)}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Smart Advice Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statsLoading ? '...' : userStats?.totalDecisions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Decisions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              £{statsLoading ? '...' : userStats?.moneySaved || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Money Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {statsLoading ? '...' : userStats?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Smart Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statsLoading ? '...' : userStats?.financialIQ || 45}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Financial IQ</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Advanced AI considers your budget, goals, emotional state, and spending patterns for personalized advice.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-green-600" />
              Context Aware
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Understands utility vs desire, time sensitivity, and your current emotional state to prevent impulse buys.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Learning System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Learns from your decisions and regret levels to provide increasingly accurate recommendations.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Decisions */}
      {recentDecisions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDecisions.map((decision) => (
                  <div key={decision.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{decision.itemName}</h4>
                        <Badge className={getRecommendationColor(decision.recommendation)}>
                          {getRecommendationIcon(decision.recommendation)}
                          <span className="ml-1">{getRecommendationText(decision.recommendation)}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        £{decision.amount} • {decision.category}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {decision.reasoning}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(decision.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <History className="w-4 h-4 mr-2" />
                View All Decisions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Be honest about your emotions</p>
                  <p className="text-gray-600">Smartie uses your mood to detect impulse buying patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Wait 24-48 hours</p>
                  <p className="text-gray-600">For non-urgent items, sleeping on it often reduces desire</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Purchase Decision Modal */}
      <AdvancedPurchaseDecisionModal 
        open={showDecisionModal}
        onOpenChange={setShowDecisionModal}
      />

      <BottomNav currentTab="purchase" />
    </ResponsiveLayout>
  );
}