import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Star, Lock } from "lucide-react";
import SmartieAvatarSystem from "./SmartieAvatarSystem";

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  unlocked: boolean;
  requirement?: string;
  category: "hats" | "glasses" | "shoes" | "special";
}

interface SmartieAccessoryShopProps {
  userCoins: number;
  userStreak: number;
  unlockedAccessories: string[];
  onPurchase: (accessoryId: string) => void;
}

const SmartieAccessoryShop: React.FC<SmartieAccessoryShopProps> = ({
  userCoins = 0,
  userStreak = 0,
  unlockedAccessories = [],
  onPurchase
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"hats" | "glasses" | "shoes" | "special">("hats");
  const [previewAccessories, setPreviewAccessories] = useState<string[]>([]);

  const accessories: Accessory[] = [
    // Hats
    {
      id: "wizard-hat",
      name: "Wizard Hat",
      emoji: "🧙‍♂️",
      cost: 50,
      description: "For the wisest financial decisions",
      unlocked: unlockedAccessories.includes("wizard-hat"),
      category: "hats"
    },
    {
      id: "crown",
      name: "Golden Crown",
      emoji: "👑",
      cost: 100,
      description: "You're the ruler of your budget!",
      unlocked: unlockedAccessories.includes("crown"),
      requirement: "7-day streak",
      category: "hats"
    },
    {
      id: "graduation-cap",
      name: "Graduation Cap",
      emoji: "🎓",
      cost: 75,
      description: "Graduate-level financial intelligence",
      unlocked: unlockedAccessories.includes("graduation-cap"),
      category: "hats"
    },
    
    // Glasses
    {
      id: "sunglasses",
      name: "Cool Sunglasses",
      emoji: "😎",
      cost: 30,
      description: "Looking cool while saving money",
      unlocked: unlockedAccessories.includes("sunglasses"),
      category: "glasses"
    },
    {
      id: "smart-glasses",
      name: "Smart Glasses",
      emoji: "🤓",
      cost: 60,
      description: "See through unnecessary expenses",
      unlocked: unlockedAccessories.includes("smart-glasses"),
      category: "glasses"
    },
    
    // Shoes
    {
      id: "sneakers",
      name: "Running Sneakers",
      emoji: "👟",
      cost: 40,
      description: "Running toward your financial goals",
      unlocked: unlockedAccessories.includes("sneakers"),
      category: "shoes"
    },
    {
      id: "dress-shoes",
      name: "Business Shoes",
      emoji: "👞",
      cost: 80,
      description: "Professional money management",
      unlocked: unlockedAccessories.includes("dress-shoes"),
      category: "shoes"
    },
    
    // Special
    {
      id: "money-wings",
      name: "Money Wings",
      emoji: "💸",
      cost: 150,
      description: "Your savings are flying high!",
      unlocked: unlockedAccessories.includes("money-wings"),
      requirement: "14-day streak",
      category: "special"
    },
    {
      id: "sparkle-aura",
      name: "Sparkle Aura",
      emoji: "✨",
      cost: 200,
      description: "Radiating financial wisdom",
      unlocked: unlockedAccessories.includes("sparkle-aura"),
      requirement: "30-day streak",
      category: "special"
    }
  ];

  const categories = [
    { id: "hats", name: "Hats", icon: "🎩" },
    { id: "glasses", name: "Glasses", icon: "👓" },
    { id: "shoes", name: "Shoes", icon: "👟" },
    { id: "special", name: "Special", icon: "✨" }
  ];

  const filteredAccessories = accessories.filter(acc => acc.category === selectedCategory);

  const canUnlock = (accessory: Accessory) => {
    if (accessory.unlocked) return false;
    if (userCoins < accessory.cost) return false;
    
    if (accessory.requirement) {
      const requiredDays = parseInt(accessory.requirement.split("-")[0]);
      if (userStreak < requiredDays) return false;
    }
    
    return true;
  };

  const getRequirementStatus = (accessory: Accessory) => {
    if (accessory.unlocked) return "unlocked";
    if (!accessory.requirement) return userCoins >= accessory.cost ? "affordable" : "expensive";
    
    const requiredDays = parseInt(accessory.requirement.split("-")[0]);
    if (userStreak < requiredDays) return "locked";
    return userCoins >= accessory.cost ? "affordable" : "expensive";
  };

  const handlePreview = (accessoryEmoji: string) => {
    setPreviewAccessories([accessoryEmoji]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-high-contrast mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Smartie's Style Shop
        </h2>
        <p className="text-medium-contrast">Dress up Smartie with your earned coins!</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🪙 {userCoins} Coins
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            🔥 {userStreak} Day Streak
          </Badge>
        </div>
      </div>

      {/* Smartie Preview */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-high-contrast mb-4">Preview</h3>
          <div className="flex justify-center mb-4">
            <SmartieAvatarSystem
              mood="happy"
              size="xl"
              animated={true}
              showAccessories={previewAccessories.length > 0}
              accessories={previewAccessories}
            />
          </div>
          <p className="text-medium-contrast">
            {previewAccessories.length > 0 
              ? "Looking good, Smartie!" 
              : "Select an accessory to preview"
            }
          </p>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id as any)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span>{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {filteredAccessories.map((accessory) => {
            const status = getRequirementStatus(accessory);
            const isUnlocked = accessory.unlocked;
            const isAffordable = status === "affordable";
            const isLocked = status === "locked";
            
            return (
              <motion.div
                key={accessory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`cursor-pointer transition-all duration-200 ${
                  isUnlocked 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                    : isAffordable
                    ? "hover:shadow-lg hover:scale-105"
                    : isLocked
                    ? "opacity-60 bg-gray-50 dark:bg-gray-800"
                    : "opacity-75"
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{accessory.emoji}</span>
                        <span className="text-high-contrast">{accessory.name}</span>
                      </div>
                      {isUnlocked && (
                        <Badge variant="default" className="bg-green-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Owned
                        </Badge>
                      )}
                      {isLocked && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-medium-contrast text-sm mb-3">
                      {accessory.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-high-contrast">
                            🪙 {accessory.cost}
                          </span>
                          {accessory.requirement && (
                            <Badge variant="outline" className="text-xs">
                              {accessory.requirement}
                            </Badge>
                          )}
                        </div>
                        {isLocked && accessory.requirement && (
                          <p className="text-xs text-red-500">
                            Need {parseInt(accessory.requirement.split("-")[0]) - userStreak} more streak days
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(accessory.emoji)}
                          disabled={isLocked}
                        >
                          Preview
                        </Button>
                        
                        {!isUnlocked && (
                          <Button
                            onClick={() => onPurchase(accessory.id)}
                            disabled={!canUnlock(accessory)}
                            size="sm"
                            className={
                              canUnlock(accessory)
                                ? "bg-purple-500 hover:bg-purple-600 text-white"
                                : ""
                            }
                          >
                            {isAffordable ? "Buy" : isLocked ? "Locked" : "Can't Afford"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* How to Earn Coins */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-lg text-high-contrast flex items-center gap-2">
            <Crown className="w-5 h-5 text-blue-500" />
            How to Earn Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span className="text-medium-contrast">Daily budget adherence: 5 coins</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span className="text-medium-contrast">Smart purchase decisions: 10 coins</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span className="text-medium-contrast">Streak milestones: 25+ coins</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎉</span>
              <span className="text-medium-contrast">Goal completions: 50+ coins</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartieAccessoryShop;