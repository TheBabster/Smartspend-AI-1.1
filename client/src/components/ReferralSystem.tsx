import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Users, Copy, Share2, Star, Crown, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface ReferralSystemProps {
  userCode: string;
  referralCount: number;
  totalRewards: number;
  className?: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  userCode,
  referralCount,
  totalRewards,
  className = ""
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const referralUrl = `https://smartspend.app/invite/${userCode}`;
  const shareMessage = `🧠 Join me on SmartSpend - the AI financial coach that's transformed my spending habits! Use my code ${userCode} and we both get special Smartie rewards! 💰 Download: https://smartspend.app/invite/${userCode}`;

  const rewards = [
    { threshold: 1, reward: "Golden Smartie Badge", icon: "🏆", achieved: referralCount >= 1 },
    { threshold: 3, reward: "Smartie Crown Avatar", icon: "👑", achieved: referralCount >= 3 },
    { threshold: 5, reward: "Premium Insights Access", icon: "⭐", achieved: referralCount >= 5 },
    { threshold: 10, reward: "Smartie Legendary Status", icon: "🌟", achieved: referralCount >= 10 },
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userCode);
    toast({
      title: "Referral code copied!",
      description: "Share it with friends to earn rewards."
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: "Referral link copied!",
      description: "Send this link to your friends."
    });
  };

  const shareReferral = async () => {
    setIsSharing(true);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SmartSpend - AI Financial Coach',
          text: shareMessage,
          url: referralUrl
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      copyReferralLink();
    }
    
    setIsSharing(false);
  };

  const nextReward = rewards.find(r => !r.achieved);
  const progressToNext = nextReward ? (referralCount / nextReward.threshold) * 100 : 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Smartie */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <ExactSmartieAvatar 
              mood="happy" 
              size="lg" 
              animated={true} 
              animationType="greeting"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                Invite Friends & Earn Rewards!
              </h3>
              <p className="text-sm text-gray-600">
                Help friends discover smart spending with Smartie and unlock exclusive rewards together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{referralCount}</div>
            <div className="text-xs text-gray-600">Friends Invited</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Coins className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{totalRewards}</div>
            <div className="text-xs text-gray-600">Rewards Earned</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Gift className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {nextReward ? nextReward.threshold - referralCount : 0}
            </div>
            <div className="text-xs text-gray-600">To Next Reward</div>
          </CardContent>
        </Card>
      </div>

      {/* Your Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={userCode} 
              readOnly 
              className="font-mono text-center text-lg font-bold bg-gray-50"
            />
            <Button variant="outline" onClick={copyReferralCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={shareReferral} 
              disabled={isSharing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSharing ? 'Sharing...' : 'Share with Friends'}
            </Button>
            <Button variant="outline" onClick={copyReferralLink}>
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reward Progress */}
      {nextReward && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5" />
              Next Reward Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{nextReward.reward}</span>
                <span className="text-sm text-gray-600">
                  {referralCount}/{nextReward.threshold}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-xs text-gray-600">
                {nextReward.threshold - referralCount} more friends to unlock {nextReward.reward}!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Referral Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  reward.achieved 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{reward.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{reward.reward}</div>
                    <div className="text-xs text-gray-600">
                      Invite {reward.threshold} friend{reward.threshold > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {reward.achieved ? (
                  <Badge variant="default" className="bg-green-500">
                    Unlocked!
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {reward.threshold - referralCount} more
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSystem;