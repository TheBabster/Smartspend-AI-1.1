import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Heart, Smile, Meh, Frown, Angry } from 'lucide-react';

interface DailyMoodTrackerProps {
  userId: string;
}

const moodOptions = [
  { emoji: '😊', value: 'happy', icon: Smile, color: 'text-green-500', bgColor: 'bg-green-50' },
  { emoji: '😐', value: 'neutral', icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  { emoji: '😔', value: 'sad', icon: Frown, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { emoji: '😤', value: 'stressed', icon: Angry, color: 'text-red-500', bgColor: 'bg-red-50' },
  { emoji: '😄', value: 'excited', icon: Smile, color: 'text-purple-500', bgColor: 'bg-purple-50' },
];

export default function DailyMoodTracker({ userId }: DailyMoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moodNotes, setMoodNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if mood was already logged today
  const { data: todayMood, isLoading } = useQuery({
    queryKey: ['/api/mood/today', userId],
    queryFn: async () => {
      const response = await fetch(`/api/mood/today/${userId}`);
      if (response.status === 404) return null;
      return response.json();
    },
    enabled: !!userId
  });

  // Submit mood mutation
  const submitMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; notes: string; userId: string }) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood/today', userId] });
      toast({
        title: "Mood Logged!",
        description: "Your daily mood has been recorded. This helps us understand your spending patterns better.",
      });
      setSelectedMood('');
      setMoodNotes('');
    }
  });

  const handleSubmitMood = () => {
    if (!selectedMood) {
      toast({
        title: "Please Select a Mood",
        description: "Choose how you're feeling today to track your emotional spending patterns.",
        variant: "destructive"
      });
      return;
    }

    submitMoodMutation.mutate({
      mood: selectedMood,
      notes: moodNotes,
      userId: userId
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading mood tracker...</div>
        </CardContent>
      </Card>
    );
  }

  if (todayMood) {
    const todayMoodData = moodOptions.find(m => m.value === todayMood.mood);
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Heart className="w-5 h-5" />
            Today's Mood Logged
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">{todayMoodData?.emoji}</div>
            <div>
              <p className="font-semibold capitalize">{todayMood.mood}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Logged at {new Date(todayMood.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          {todayMood.notes && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">"{todayMood.notes}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Daily Mood Check-in
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your daily emotions to understand your spending patterns better
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood Selection */}
          <div>
            <p className="font-medium mb-3">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedMood === mood.value
                      ? `${mood.bgColor} border-current ${mood.color} border-2`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium capitalize">{mood.value}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <p className="font-medium mb-2">Any thoughts? (Optional)</p>
            <Textarea
              placeholder="What's on your mind today? How are you feeling about your finances?"
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitMood}
            disabled={!selectedMood || submitMoodMutation.isPending}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {submitMoodMutation.isPending ? 'Logging...' : 'Log My Mood'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}