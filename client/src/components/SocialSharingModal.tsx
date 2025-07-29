import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Twitter, Facebook, Instagram, Copy, Download, Trophy, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExactSmartieAvatar from './ExactSmartieAvatar';

interface SocialSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareType: 'milestone' | 'streak' | 'goal' | 'savings' | 'badge';
  data: {
    title: string;
    value: string;
    description: string;
    achievement?: string;
  };
}

const SocialSharingModal: React.FC<SocialSharingModalProps> = ({
  open,
  onOpenChange,
  shareType,
  data
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const shareTemplates = {
    milestone: `🎉 Just hit a major milestone in my financial journey! ${data.title} - ${data.value}! SmartSpend is helping me make smarter money decisions every day. #SmartSpend #FinancialWellness`,
    streak: `🔥 ${data.value} day spending streak! ${data.description} Thanks to my AI financial coach Smartie! #SmartSpend #FinancialGoals`,
    goal: `🎯 Goal achieved! ${data.title} - saved ${data.value}! SmartSpend's AI coaching made this possible. Who else is crushing their financial goals? #SmartSpend #SavingsWin`,
    savings: `💰 Total savings update: ${data.value}! ${data.description} My AI coach Smartie keeps me on track. #SmartSpend #SavingsMilestone`,
    badge: `🏆 New achievement unlocked: ${data.achievement}! ${data.description} SmartSpend gamifies financial wellness perfectly! #SmartSpend #FinancialAchievement`
  };

  const getShareIcon = () => {
    switch (shareType) {
      case 'milestone': return <TrendingUp className="w-8 h-8 text-blue-500" />;
      case 'streak': return <Trophy className="w-8 h-8 text-orange-500" />;
      case 'goal': return <Target className="w-8 h-8 text-green-500" />;
      case 'savings': return <TrendingUp className="w-8 h-8 text-purple-500" />;
      case 'badge': return <Trophy className="w-8 h-8 text-yellow-500" />;
      default: return <Share2 className="w-8 h-8 text-gray-500" />;
    }
  };

  const generateShareImage = async () => {
    setIsGenerating(true);
    // Simulate image generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast({
      title: "Share image generated!",
      description: "Your achievement image is ready to download."
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Share text copied successfully."
    });
  };

  const shareToSocial = (platform: string) => {
    const text = shareTemplates[shareType];
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
    };
    
    if (platform === 'instagram') {
      toast({
        title: "Instagram sharing",
        description: "Generate an image and share it on your Instagram story!"
      });
      return;
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getShareIcon()}
            Share Your Achievement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Preview Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <ExactSmartieAvatar 
                  mood="celebrating" 
                  size="lg" 
                  animated={true} 
                  animationType="celebration"
                />
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2">{data.title}</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{data.value}</div>
              <p className="text-sm text-gray-600">{data.description}</p>
              
              {data.achievement && (
                <div className="mt-4 bg-yellow-100 rounded-full px-4 py-2 inline-block">
                  <span className="text-yellow-800 font-medium">🏆 {data.achievement}</span>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Achieved with SmartSpend AI Coach
              </div>
            </CardContent>
          </Card>

          {/* Share Text */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Share Message:</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 relative">
              {shareTemplates[shareType]}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(shareTemplates[shareType])}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Generate Share Image */}
            <Button
              onClick={generateShareImage}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Share Image'}
            </Button>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center py-3 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100"
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center py-3 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100"
                onClick={() => shareToSocial('facebook')}
              >
                <Facebook className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center py-3 h-auto bg-pink-50 border-pink-200 hover:bg-pink-100"
                onClick={() => shareToSocial('instagram')}
              >
                <Instagram className="w-5 h-5 text-pink-600 mb-1" />
                <span className="text-xs">Instagram</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharingModal;