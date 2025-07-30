import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Quote, Heart, Lightbulb, Star, Gift, ShoppingBag, Shirt, Glasses, Crown, MessageSquare } from "lucide-react";
import ExactSmartieAvatar from "@/components/ExactSmartieAvatar";
import SmartieIntelligentChat from "@/components/SmartieIntelligentChat";
import { BounceButton, bounceVariants, LiftCard, liftVariants, staggerContainer, staggerItem } from "@/components/MicroAnimations";
import BottomNav from "@/components/BottomNav";
import ResponsiveLayout from "@/components/ResponsiveLayout";

interface SmartieQuote {
  id: string;
  text: string;
  category: "wisdom" | "motivation" | "humor" | "reflection";
  author: "Smartie";
}

interface SmartieOutfit {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
}

interface RegretStory {
  id: string;
  title: string;
  story: string;
  amount: number;
  lesson: string;
  smartieFeedback: string;
  timestamp: Date;
}

export default function SmartieCorner() {
  const [selectedTab, setSelectedTab] = useState<"quotes" | "shop" | "regrets" | "chat">("quotes");
  const [showChat, setShowChat] = useState(false);
  const [userCoins, setUserCoins] = useState(125);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showRegretForm, setShowRegretForm] = useState(false);
  const [newRegret, setNewRegret] = useState({ title: "", story: "", amount: "" });

  const smartieQuotes: SmartieQuote[] = [
    {
      id: "1",
      text: "Money saved is money earned, but wisdom gained is priceless! 💡",
      category: "wisdom",
      author: "Smartie"
    },
    {
      id: "2", 
      text: "Your future self is sending you a thank-you note for every pound you don't spend today! 📝",
      category: "motivation",
      author: "Smartie"
    },
    {
      id: "3",
      text: "I've read 10,000 psychology books and watched you spend on cookies. Trust me, the books were better! 🍪",
      category: "humor", 
      author: "Smartie"
    },
    {
      id: "4",
      text: "Every 'no' to an impulse purchase is a 'yes' to your dreams! ✨",
      category: "motivation",
      author: "Smartie"
    },
    {
      id: "5",
      text: "If you wait 24 hours and still want it, it might be worth it. If you forget about it, it definitely wasn't! ⏰",
      category: "wisdom",
      author: "Smartie"
    },
    {
      id: "6",
      text: "Happiness isn't in your shopping cart - it's in your smart choices! 🛒",
      category: "reflection",
      author: "Smartie"
    },
    {
      id: "7",
      text: "I'm just a brain in sneakers, but even I know that experiences beat things every time! 👟",
      category: "humor",
      author: "Smartie"
    },
    {
      id: "8",
      text: "You're not your bank balance. You're your smart choices! 🌟",
      category: "reflection",
      author: "Smartie"
    }
  ];

  const smartieOutfits: SmartieOutfit[] = [
    {
      id: "glasses",
      name: "Wise Glasses",
      description: "Make Smartie look extra scholarly!",
      icon: Glasses,
      cost: 50,
      unlocked: userCoins >= 50,
      equipped: false
    },
    {
      id: "crown",
      name: "Savings Crown",
      description: "For the ultimate savings royalty!",
      icon: Crown,
      cost: 100,
      unlocked: userCoins >= 100,
      equipped: false
    },
    {
      id: "shirt",
      name: "Money Hero Shirt",
      description: "Smartie's superhero outfit!",
      icon: Shirt,
      cost: 75,
      unlocked: userCoins >= 75,
      equipped: false
    }
  ];

  const regretStories: RegretStory[] = [
    {
      id: "1",
      title: "The Expensive Coffee Addiction",
      story: "I spent £5 every day on fancy coffee for a month. That's £150 I could have saved!",
      amount: 150,
      lesson: "Making coffee at home saves so much money",
      smartieFeedback: "Great insight! Home brewing is both cost-effective and often tastes better once you get the hang of it. Plus, you get to perfect your own recipe! ☕",
      timestamp: new Date()
    }
  ];

  const getCategoryIcon = (category: SmartieQuote["category"]) => {
    switch (category) {
      case "wisdom": return Lightbulb;
      case "motivation": return Star;
      case "humor": return Heart;
      case "reflection": return Quote;
      default: return Quote;
    }
  };

  const getCategoryColor = (category: SmartieQuote["category"]) => {
    switch (category) {
      case "wisdom": return "text-yellow-500";
      case "motivation": return "text-blue-500";
      case "humor": return "text-pink-500";
      case "reflection": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % smartieQuotes.length);
  };

  const purchaseOutfit = (outfit: SmartieOutfit) => {
    if (userCoins >= outfit.cost) {
      setUserCoins(prev => prev - outfit.cost);
      // In a real app, this would update the user's outfit collection
    }
  };

  const submitRegret = () => {
    if (newRegret.title && newRegret.story && newRegret.amount) {
      // In a real app, this would be saved to the database
      setShowRegretForm(false);
      setNewRegret({ title: "", story: "", amount: "" });
    }
  };

  const currentQuote = smartieQuotes[currentQuoteIndex];
  const CategoryIcon = getCategoryIcon(currentQuote.category);

  return (
    <ResponsiveLayout className="bg-gray-50 dark:bg-gray-900 pb-20" maxWidth="lg" padding="md">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 mx-auto mb-4">
          <ExactSmartieAvatar mood="happy" size="xl" animated={true} animationType="greeting" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Smartie's Corner</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal space with your AI financial buddy
        </p>
      </motion.div>

      {/* User Coins Display */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="px-6 py-3">
          <CardContent className="p-0 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-lg">{userCoins}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">SmartCoins</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {[
            { id: "quotes", label: "Quotes", icon: Quote },
            { id: "chat", label: "Chat", icon: MessageSquare },
            { id: "shop", label: "Shop", icon: ShoppingBag },
            { id: "regrets", label: "Regrets", icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <BounceButton
              key={id}
              onClick={() => setSelectedTab(id as any)}
              variants={bounceVariants}
              whileTap="tap"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedTab === id
                  ? 'bg-white dark:bg-gray-700 shadow-md text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </BounceButton>
          ))}
        </div>
      </div>

      {/* Content based on selected tab */}
      <motion.div
        key={selectedTab}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Chat Tab */}
        {selectedTab === "chat" && (
          <motion.div variants={staggerItem}>
            <Card className="h-[600px]">
              <SmartieIntelligentChat initialContext="general" />
            </Card>
          </motion.div>
        )}

        {/* Quotes Tab */}
        {selectedTab === "quotes" && (
          <>
            {/* Daily Quote Card */}
            <motion.div variants={staggerItem}>
              <LiftCard variants={liftVariants} initial="initial" whileHover="hover">
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center`}>
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <blockquote className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                      "{currentQuote.text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="text-gray-600 dark:text-gray-400">— {currentQuote.author}</span>
                      <Badge variant="secondary" className={getCategoryColor(currentQuote.category)}>
                        {currentQuote.category}
                      </Badge>
                    </div>

                    <Button onClick={nextQuote} variant="outline">
                      Next Quote
                    </Button>
                  </CardContent>
                </Card>
              </LiftCard>
            </motion.div>

            {/* Quote Categories */}
            <motion.div variants={staggerItem}>
              <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {["wisdom", "motivation", "humor", "reflection"].map((category) => {
                  const Icon = getCategoryIcon(category as any);
                  return (
                    <LiftCard key={category} variants={liftVariants} initial="initial" whileHover="hover">
                      <Card className="cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${getCategoryColor(category as any)}`} />
                          <h4 className="font-medium capitalize">{category}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {smartieQuotes.filter(q => q.category === category).length} quotes
                          </p>
                        </CardContent>
                      </Card>
                    </LiftCard>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* Shop Tab */}
        {selectedTab === "shop" && (
          <>
            <motion.div variants={staggerItem}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Smartie's Outfit Shop
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Customize Smartie with awesome outfits using your SmartCoins!
              </p>
            </motion.div>

            <div className="grid gap-4">
              {smartieOutfits.map((outfit, index) => (
                <motion.div key={outfit.id} variants={staggerItem}>
                  <LiftCard variants={liftVariants} initial="initial" whileHover="hover">
                    <Card className={`${outfit.unlocked ? 'border-purple-200' : 'border-gray-300 opacity-75'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            outfit.unlocked 
                              ? 'bg-gradient-to-br from-purple-400 to-pink-500' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}>
                            <outfit.icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{outfit.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              {outfit.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{outfit.cost} coins</span>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => purchaseOutfit(outfit)}
                            disabled={!outfit.unlocked}
                            variant={outfit.unlocked ? "default" : "secondary"}
                          >
                            {outfit.unlocked ? "Buy" : "Locked"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </LiftCard>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Regrets Tab */}
        {selectedTab === "regrets" && (
          <>
            <motion.div variants={staggerItem}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Regret Journal</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share your regrets and get Smartie's wisdom
                  </p>
                </div>
                <Button onClick={() => setShowRegretForm(true)}>
                  Add Regret
                </Button>
              </div>
            </motion.div>

            {/* Regret Stories */}
            <div className="space-y-4">
              {regretStories.map((regret, index) => (
                <motion.div key={regret.id} variants={staggerItem}>
                  <LiftCard variants={liftVariants} initial="initial" whileHover="hover">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg">{regret.title}</h4>
                          <Badge variant="destructive">£{regret.amount}</Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {regret.story}
                        </p>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                            What I learned:
                          </h5>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            {regret.lesson}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/30">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8">
                              <ExactSmartieAvatar mood="thinking" size="sm" animated={true} animationType="thinking" />
                            </div>
                            <div>
                              <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-1">
                                Smartie's feedback:
                              </h5>
                              <p className="text-purple-700 dark:text-purple-300 text-sm">
                                {regret.smartieFeedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </LiftCard>
                </motion.div>
              ))}
            </div>

            {/* Add Regret Form Modal */}
            {showRegretForm && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Share Your Regret</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          What did you regret buying?
                        </label>
                        <input
                          type="text"
                          value={newRegret.title}
                          onChange={(e) => setNewRegret({...newRegret, title: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Expensive coffee addiction..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tell your story
                        </label>
                        <Textarea
                          value={newRegret.story}
                          onChange={(e) => setNewRegret({...newRegret, story: e.target.value})}
                          placeholder="I spent way too much on..."
                          className="resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          How much? (£)
                        </label>
                        <input
                          type="number"
                          value={newRegret.amount}
                          onChange={(e) => setNewRegret({...newRegret, amount: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="150"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRegretForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={submitRegret}
                        className="flex-1"
                      >
                        Get Smartie's Wisdom
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      <BottomNav currentTab="smartie" />
    </ResponsiveLayout>
  );
}