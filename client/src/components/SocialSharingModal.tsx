import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  Share2,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';

interface SocialSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareData: {
    type: 'achievement' | 'weekly_summary' | 'goal_milestone' | 'streak';
    title: string;
    description: string;
    stats: {
      smartnessScore?: number;
      streak?: number;
      goalProgress?: number;
      savings?: number;
      level?: number;
    };
    achievements?: string[];
  };
}

export default function SocialSharingModal({ open, onOpenChange, shareData }: SocialSharingModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  // Generate shareable text based on share type
  const generateShareText = () => {
    const { type, title, description, stats } = shareData;
    
    switch (type) {
      case 'achievement':
        return `🎉 Just unlocked "${title}" in SmartSpend! My financial intelligence is growing. ${description} #SmartSpend #FinancialWellness`;
      
      case 'weekly_summary':
        return `📊 Weekly SmartSpend Report: ${stats.smartnessScore}/100 Smart Score, ${stats.streak}-day streak! ${description} #FinancialGoals #SmartSpending`;
      
      case 'goal_milestone':
        return `🎯 Milestone reached! ${stats.goalProgress}% towards my goal. ${description} Thanks to SmartSpend for keeping me on track! #SavingsGoal #SmartSpend`;
      
      case 'streak':
        return `🔥 ${stats.streak}-day smart spending streak with SmartSpend! ${description} #FinancialDiscipline #SmartSpend`;
      
      default:
        return `Making smarter financial decisions with SmartSpend! ${description} #SmartSpend #FinancialWellness`;
    }
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate downloadable image (simplified implementation)
  const downloadShareImage = async () => {
    setDownloadingImage(true);
    
    // In a real implementation, this would generate an image using Canvas API
    // For now, we'll simulate the download
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = 800;
        canvas.height = 600;
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#3B82F6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shareData.title, 400, 150);
        
        // Stats
        ctx.font = '32px Arial';
        let yPos = 250;
        
        if (shareData.stats.smartnessScore) {
          ctx.fillText(`Smart Score: ${shareData.stats.smartnessScore}/100`, 400, yPos);
          yPos += 60;
        }
        
        if (shareData.stats.streak) {
          ctx.fillText(`${shareData.stats.streak}-day streak`, 400, yPos);
          yPos += 60;
        }
        
        if (shareData.stats.goalProgress) {
          ctx.fillText(`${shareData.stats.goalProgress}% goal progress`, 400, yPos);
          yPos += 60;
        }
        
        // Footer
        ctx.font = '24px Arial';
        ctx.fillText('SmartSpend - AI Financial Coach', 400, 550);
        
        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smartspend-${shareData.type}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
          setDownloadingImage(false);
        });
      } else {
        setDownloadingImage(false);
      }
    }, 1000);
  };

  // Social platform sharing
  const shareOnPlatform = (platform: string) => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(window.location.origin);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'instagram':
        // Instagram doesn't support URL sharing, so we'll copy text for manual posting
        copyToClipboard();
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const getShareIcon = () => {
    switch (shareData.type) {
      case 'achievement': return '🏆';
      case 'weekly_summary': return '📊';
      case 'goal_milestone': return '🎯';
      case 'streak': return '🔥';
      default: return '✨';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Success
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <span className="text-6xl">{getShareIcon()}</span>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {shareData.title}
              </h3>
              
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                {shareData.description}
              </p>
              
              {/* Stats Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {shareData.stats.smartnessScore && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {shareData.stats.smartnessScore}/100
                    </div>
                    <div className="text-sm text-gray-600">Smart Score</div>
                  </div>
                )}
                
                {shareData.stats.streak && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {shareData.stats.streak}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                )}
                
                {shareData.stats.goalProgress && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {shareData.stats.goalProgress}%
                    </div>
                    <div className="text-sm text-gray-600">Goal Progress</div>
                  </div>
                )}
                
                {shareData.stats.level && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {shareData.stats.level}
                    </div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <ModernSmartieAvatar mood="happy" size="sm" />
                <span>SmartSpend - AI Financial Coach</span>
              </div>
            </div>
          </Card>

          {/* Share Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-white">
              Share on Social Media
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                onClick={() => shareOnPlatform('twitter')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Twitter</span>
              </motion.button>
              
              <motion.button
                onClick={() => shareOnPlatform('facebook')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Facebook</span>
              </motion.button>
              
              <motion.button
                onClick={() => shareOnPlatform('linkedin')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-6 h-6 text-blue-700 mb-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">LinkedIn</span>
              </motion.button>
              
              <motion.button
                onClick={() => shareOnPlatform('instagram')}
                className="flex flex-col items-center p-4 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-6 h-6 text-pink-600 mb-2" />
                <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Instagram</span>
              </motion.button>
            </div>
          </div>

          {/* Copy Link and Download Options */}
          <div className="space-y-3">
            <Button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Share Text
                </>
              )}
            </Button>
            
            <Button
              onClick={downloadShareImage}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              disabled={downloadingImage}
            >
              {downloadingImage ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Generating Image...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Share Image
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}