import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp } from 'lucide-react';

const emotionalTags = [
  { label: "Necessity", emoji: "✅", color: "bg-green-100 text-green-800", description: "Essential purchase" },
  { label: "Impulse", emoji: "⚡", color: "bg-purple-100 text-purple-800", description: "Bought on a whim" },
  { label: "Stress", emoji: "😰", color: "bg-red-100 text-red-800", description: "Stress-induced purchase" },
  { label: "Celebration", emoji: "🎉", color: "bg-yellow-100 text-yellow-800", description: "Celebratory spending" },
  { label: "Boredom", emoji: "😴", color: "bg-gray-100 text-gray-800", description: "Boredom shopping" },
  { label: "Peer Pressure", emoji: "👥", color: "bg-blue-100 text-blue-800", description: "Social influence" },
  { label: "Reward", emoji: "🏆", color: "bg-orange-100 text-orange-800", description: "Self-reward purchase" },
];

interface EmotionalTrackingButtonProps {
  onEmotionalTagSelected: (tag: string) => void;
  selectedTag?: string;
  showDescription?: boolean;
}

const EmotionalTrackingButton: React.FC<EmotionalTrackingButtonProps> = ({
  onEmotionalTagSelected,
  selectedTag,
  showDescription = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const handleTagSelect = (tagLabel: string) => {
    onEmotionalTagSelected(tagLabel);
    setIsOpen(false);
  };

  const selectedEmotionData = emotionalTags.find(tag => tag.label === selectedTag);

  return (
    <div className="relative">
      {/* Main Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={selectedTag ? "default" : "outline"}
        className={`flex items-center gap-2 ${
          selectedTag 
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
            : "border-2 border-dashed border-pink-300 hover:border-pink-500"
        }`}
      >
        <Heart className="w-4 h-4" />
        {selectedTag ? (
          <>
            {selectedEmotionData?.emoji} {selectedTag}
          </>
        ) : (
          "Add Emotional Context"
        )}
      </Button>

      {/* Emotional Tags Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 w-80"
          >
            <Card className="shadow-xl border-2 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  How are you feeling about this purchase?
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Understanding your emotions helps identify spending patterns
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {emotionalTags.map((tag) => (
                    <motion.div
                      key={tag.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge
                        className={`${tag.color} cursor-pointer w-full justify-start p-3 text-left hover:shadow-md transition-shadow`}
                        onMouseEnter={() => setHoveredTag(tag.label)}
                        onMouseLeave={() => setHoveredTag(null)}
                        onClick={() => handleTagSelect(tag.label)}
                      >
                        <span className="text-lg mr-2">{tag.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium">{tag.label}</div>
                          <AnimatePresence>
                            {(hoveredTag === tag.label || !showDescription) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs mt-1 text-gray-600"
                              >
                                {tag.description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Why Track Emotions Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Why track emotions?</p>
                      <p className="text-xs text-blue-700">
                        Emotional awareness helps you make smarter financial decisions and identify triggers that lead to overspending.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EmotionalTrackingButton;