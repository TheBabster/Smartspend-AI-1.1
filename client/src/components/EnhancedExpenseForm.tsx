import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryIcon, getCategoryColor, getCategoryGradient } from './CategoryIcons';
import ModernSmartieAvatar from './ModernSmartieAvatar';
import { 
  DollarSign, 
  Calendar, 
  Heart, 
  MapPin, 
  Clock,
  User,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface EnhancedExpenseFormProps {
  onSubmit: (expense: {
    description: string;
    amount: number;
    category: string;
    emotion: string;
    whySpent: string;
    location?: string;
    timeOfDay: string;
    companionship: string;
  }) => void;
  categories: string[];
}

export default function EnhancedExpenseForm({ onSubmit, categories }: EnhancedExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    emotion: '',
    whySpent: '',
    location: '',
    timeOfDay: '',
    companionship: ''
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const emotions = [
    { value: 'happy', label: 'Happy 😊', color: 'text-yellow-600' },
    { value: 'stressed', label: 'Stressed 😰', color: 'text-red-600' },
    { value: 'bored', label: 'Bored 😴', color: 'text-gray-600' },
    { value: 'excited', label: 'Excited 🤩', color: 'text-purple-600' },
    { value: 'social', label: 'Social 🎉', color: 'text-pink-600' },
    { value: 'necessity', label: 'Necessity ✅', color: 'text-green-600' },
    { value: 'impulsive', label: 'Impulsive 🛒', color: 'text-orange-600' },
    { value: 'regret', label: 'Regret 😔', color: 'text-red-500' }
  ];

  const whyReasons = [
    'Convenience - it was easy',
    'Boredom - had nothing to do',
    'Peer pressure - others were buying',
    'Necessity - absolutely needed it',
    'Treat myself - deserved a reward',
    'FOMO - fear of missing out',
    'Sale/discount - good deal',
    'Emotional comfort - made me feel better'
  ];

  const timeOptions = [
    'Early morning (6-9 AM)',
    'Mid morning (9 AM-12 PM)',
    'Lunch time (12-2 PM)',
    'Afternoon (2-5 PM)',
    'Evening (5-8 PM)',
    'Night (8-11 PM)',
    'Late night (11 PM+)'
  ];

  const companionshipOptions = [
    'Alone',
    'With friends',
    'With family',
    'With partner',
    'With colleagues',
    'Online/Social media influence'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      emotion: formData.emotion,
      whySpent: formData.whySpent,
      location: formData.location,
      timeOfDay: formData.timeOfDay,
      companionship: formData.companionship
    });
  };

  const getSmartieReaction = () => {
    if (formData.emotion === 'regret') return 'concerned';
    if (formData.emotion === 'happy' || formData.emotion === 'excited') return 'celebrating';
    if (formData.emotion === 'stressed') return 'thinking';
    return 'happy';
  };

  const getSmartieAdvice = () => {
    if (formData.emotion === 'stressed') {
      return "I notice you mentioned feeling stressed. Shopping won't fix that feeling, but a walk or calling a friend might help! 💙";
    }
    if (formData.emotion === 'bored') {
      return "Boredom shopping happens to everyone! Next time try a free activity like reading or exercising 🌟";
    }
    if (formData.emotion === 'impulsive') {
      return "Impulse purchases are normal! The 24-hour rule works great: wait a day before buying anything over £20 ⏰";
    }
    if (formData.whySpent.includes('peer pressure')) {
      return "Peer pressure is real! Remember, your financial goals matter more than keeping up with others 💪";
    }
    return "Thanks for being honest about your spending! Self-awareness is the first step to smarter decisions 🧠";
  };

  // Auto-suggest category based on description
  React.useEffect(() => {
    if (formData.description.length > 3) {
      const desc = formData.description.toLowerCase();
      let suggestedCategory = '';
      
      if (desc.includes('coffee') || desc.includes('restaurant') || desc.includes('food')) {
        suggestedCategory = 'Food & Dining';
      } else if (desc.includes('uber') || desc.includes('taxi') || desc.includes('transport')) {
        suggestedCategory = 'Transport';
      } else if (desc.includes('netflix') || desc.includes('movie') || desc.includes('game')) {
        suggestedCategory = 'Entertainment';
      } else if (desc.includes('shop') || desc.includes('clothes') || desc.includes('amazon')) {
        suggestedCategory = 'Shopping';
      }
      
      if (suggestedCategory && categories.includes(suggestedCategory) && !formData.category) {
        setShowSuggestions(true);
        setFormData(prev => ({ ...prev, category: suggestedCategory }));
      }
    }
  }, [formData.description, categories]);

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header with Smartie */}
        <div className="flex items-center gap-4 mb-6">
          <ModernSmartieAvatar mood={getSmartieReaction()} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Let's track this expense together!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The more details you share, the better I can help you 💙
            </p>
          </div>
        </div>

        {/* Core expense details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              What did you buy?
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Coffee at Starbucks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              How much?
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Category with auto-suggestion */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CategoryIcon category={formData.category} size="sm" />
            Category
          </Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={category} size="sm" />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Smartie auto-suggested this category based on your description!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Emotional state */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            How were you feeling?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {emotions.map((emotion) => (
              <motion.button
                key={emotion.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, emotion: emotion.value }))}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  formData.emotion === emotion.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {emotion.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Why did you spend? */}
        <div className="space-y-2">
          <Label>Why did you spend? (This helps identify patterns)</Label>
          <Select value={formData.whySpent} onValueChange={(value) => setFormData(prev => ({ ...prev, whySpent: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select the main reason" />
            </SelectTrigger>
            <SelectContent>
              {whyReasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Context details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time of day
            </Label>
            <Select value={formData.timeOfDay} onValueChange={(value) => setFormData(prev => ({ ...prev, timeOfDay: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="When?" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Company
            </Label>
            <Select value={formData.companionship} onValueChange={(value) => setFormData(prev => ({ ...prev, companionship: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Who was with you?" />
              </SelectTrigger>
              <SelectContent>
                {companionshipOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location (optional)
            </Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Oxford Street"
            />
          </div>
        </div>

        {/* Smartie's advice */}
        <AnimatePresence>
          {(formData.emotion || formData.whySpent) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-start gap-3">
                <ModernSmartieAvatar mood={getSmartieReaction()} size="sm" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {getSmartieAdvice()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg font-semibold"
            disabled={!formData.description || !formData.amount || !formData.category}
          >
            Track This Expense 📝
          </Button>
        </motion.div>
      </form>
    </Card>
  );
}