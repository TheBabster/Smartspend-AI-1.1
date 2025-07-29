import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Link2, 
  Download, 
  Camera,
  Sparkles,
  Trophy,
  Target,
  TrendingUp,
  X,
  Copy,
  Check
} from 'lucide-react';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import ExactSmartSpendLogo from '@/components/ExactSmartSpendLogo';

interface ShareData {
  type: 'achievement' | 'streak' | 'milestone' | 'savings' | 'smart_decision';
  title: string;
  description: string;
  value: string;
  emoji: string;
  color: string;
}

interface SocialSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
  userStats?: {
    totalSaved: number;
    streakDays: number;
    smartDecisions: number;
    goalsAchieved: number;
  };
}

const SocialSharingModal: React.FC<SocialSharingModalProps> = ({
  isOpen,
  onClose,
  shareData,
  userStats = {
    totalSaved: 1250,
    streakDays: 14,
    smartDecisions: 89,
    goalsAchieved: 3
  }
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shareTemplates = [
    {
      id: 'achievement',
      title: 'Achievement Post',
      content: `🎉 Just hit a new milestone with SmartSpend! ${shareData.emoji}\n\n${shareData.title}: ${shareData.value}\n\n${shareData.description}\n\n💡 Ready to take control of your finances? Join me on SmartSpend!\n\n#SmartSpend #FinancialWellness #MoneyGoals #PersonalFinance`
    },
    {
      id: 'stats',
      title: 'Progress Update',
      content: `📊 My SmartSpend Progress Update:\n\n💰 Total Saved: £${userStats.totalSaved}\n🔥 Current Streak: ${userStats.streakDays} days\n🧠 Smart Decisions: ${userStats.smartDecisions}\n🎯 Goals Achieved: ${userStats.goalsAchieved}\n\n${shareData.description}\n\n#SmartSpend #FinancialGoals #MoneyWins`
    },
    {
      id: 'inspirational',
      title: 'Motivational Share',
      content: `✨ Financial wisdom from my SmartSpend journey:\n\n"${shareData.description}"\n\n${shareData.emoji} Latest achievement: ${shareData.title}\n\nEvery smart decision counts! What's your next financial goal?\n\n#SmartSpend #FinancialWisdom #MoneyMindset`
    }
  ];

  const socialPlatforms = [
    { name: 'Twitter', icon: Twitter, color: 'bg-blue-500', shareUrl: 'https://twitter.com/intent/tweet?text=' },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=' },
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 to-pink-600', shareUrl: '' }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateShareableImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Add logo area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(20, 20, 120, 40);

    // Add main content area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(50, 80, 500, 240, 20);
    ctx.fill();

    // Add text content
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(shareData.title, 80, 130);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(shareData.description, 80, 160);

    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = shareData.color;
    ctx.fillText(shareData.value, 80, 210);

    // Add SmartSpend branding
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#8B5CF6';
    ctx.fillText('SmartSpend - AI Financial Assistant', 80, 280);

    // Download the image
    const link = document.createElement('a');
    link.download = `smartspend-${shareData.type}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToSocial = (platform: typeof socialPlatforms[0]) => {
    const text = encodeURIComponent(shareTemplates[selectedTemplate].content);
    const url = encodeURIComponent(window.location.origin);
    
    switch (platform.name) {
      case 'Twitter':
        window.open(`${platform.shareUrl}${text}`, '_blank');
        break;
      case 'Facebook':
        window.open(`${platform.shareUrl}${url}`, '_blank');
        break;
      case 'LinkedIn':
        window.open(`${platform.shareUrl}${url}`, '_blank');
        break;
      case 'Instagram':
        // Instagram doesn't support direct text sharing, so generate image
        generateShareableImage();
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            Share Your Success
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Preview Card */}
          <motion.div
            className={`relative rounded-2xl p-6 text-white overflow-hidden`}
            style={{ background: `linear-gradient(135deg, ${shareData.color}, ${shareData.color}dd)` }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">{shareData.emoji}</div>
              <Sparkles className="absolute bottom-4 left-4 w-8 h-8" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <ExactSmartSpendLogo size="sm" animated={false} showText={true} />
                </div>
                <ExactSmartieAvatar mood="celebrating" size="md" animated={true} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{shareData.title}</h3>
                <p className="text-3xl font-bold">{shareData.value}</p>
                <p className="text-white/90">{shareData.description}</p>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">{userStats.goalsAchieved} Goals</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">£{userStats.totalSaved} Saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">{userStats.streakDays} Day Streak</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Share Template Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Choose Your Message Style</h4>
            <div className="grid gap-3">
              {shareTemplates.map((template, index) => (
                <motion.button
                  key={template.id}
                  onClick={() => setSelectedTemplate(index)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTemplate === index
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h5 className="font-medium mb-2">{template.title}</h5>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {template.content}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Share Content Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Your Share Message</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(shareTemplates[selectedTemplate].content)}
                className="flex items-center gap-2"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {shareTemplates[selectedTemplate].content}
              </p>
            </div>
          </div>

          {/* Social Platform Buttons */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Share On</h4>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <motion.button
                    key={platform.name}
                    onClick={() => shareToSocial(platform)}
                    className={`flex items-center gap-3 p-4 rounded-xl text-white font-medium ${platform.color} hover:shadow-lg transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>Share on {platform.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex gap-3">
            <Button
              onClick={generateShareableImage}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
            <Button
              onClick={() => copyToClipboard(window.location.origin)}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Copy App Link
            </Button>
          </div>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharingModal;