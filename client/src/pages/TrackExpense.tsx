import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

import BottomNav from '@/components/BottomNav';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import SearchFilterSystem from '@/components/SearchFilterSystem';

import { 
  Plus, Receipt, TrendingDown, ArrowLeft, Heart 
} from 'lucide-react';
import EmotionalTrackingButton from '@/components/EmotionalTrackingButton';

import { type Expense, type Budget } from '@shared/schema';
import { useLocation } from 'wouter';

const categories = [
  { name: "Food & Dining", emoji: "🍽️", color: "bg-orange-100 text-orange-800" },
  { name: "Shopping", emoji: "🛍️", color: "bg-pink-100 text-pink-800" },
  { name: "Entertainment", emoji: "🎬", color: "bg-purple-100 text-purple-800" },
  { name: "Transport", emoji: "🚗", color: "bg-blue-100 text-blue-800" },
  { name: "Utilities", emoji: "⚡", color: "bg-yellow-100 text-yellow-800" },
  { name: "Other", emoji: "📦", color: "bg-gray-100 text-gray-800" }
];

const emotionalTags = [
  { label: "Necessity", emoji: "✅", color: "bg-green-100 text-green-800" },
  { label: "Impulse", emoji: "⚡", color: "bg-purple-100 text-purple-800" },
  { label: "Stress", emoji: "😰", color: "bg-red-100 text-red-800" },
  { label: "Celebration", emoji: "🎉", color: "bg-yellow-100 text-yellow-800" },
  { label: "Boredom", emoji: "😴", color: "bg-gray-100 text-gray-800" },
  { label: "Peer Pressure", emoji: "👥", color: "bg-blue-100 text-blue-800" },
  { label: "Reward", emoji: "🏆", color: "bg-orange-100 text-orange-800" }
];

export default function TrackExpense() {
  const { user: firebaseUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    emotionalTag: ''
  });

  // Sync Firebase user with database first
  const { data: syncedUser } = useQuery({
    queryKey: ['sync-user', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      const response = await fetch('/api/auth/firebase-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
        })
      });
      return response.json();
    },
    enabled: !!firebaseUser
  });

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses', syncedUser?.id],
    queryFn: async () => {
      if (!syncedUser?.id) return [];
      const response = await fetch(`/api/expenses/${syncedUser.id}`);
      return response.json();
    },
    enabled: !!syncedUser?.id
  });

  const { data: budgets = [] } = useQuery<Budget[]>({
    queryKey: ['/api/budgets']
  });

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const addExpenseMutation = useMutation({
    mutationFn: (data: any) => {
      return fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses', syncedUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      setShowAddForm(false);
      setFormData({ description: '', amount: '', category: '', emotionalTag: '' });
      toast({
        title: "Expense Added Successfully!",
        description: `Your expense has been tracked with emotional insight: ${formData.emotionalTag || 'No emotion tagged'}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!syncedUser?.id) return;
    
    addExpenseMutation.mutate({
      userId: syncedUser.id,
      description: formData.description,
      amount: parseFloat(formData.amount).toFixed(2),
      category: formData.category,
      emotionalTag: formData.emotionalTag || null
    });
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...expenses];

    if (filters.searchQuery) {
      filtered = filtered.filter(exp =>
        exp.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.emotion !== 'all') {
      filtered = filtered.filter(exp => exp.emotionalTag === filters.emotion);
    }

    if (filters.timeRange !== 'all') {
      const now = new Date();
      const limit = new Date();

      switch (filters.timeRange) {
        case 'today': limit.setHours(0, 0, 0, 0); break;
        case 'week': limit.setDate(now.getDate() - 7); break;
        case 'month': limit.setMonth(now.getMonth() - 1); break;
        case 'year': limit.setFullYear(now.getFullYear() - 1); break;
      }

      filtered = filtered.filter(exp => exp.createdAt && new Date(exp.createdAt) >= limit);
    }

    if (filters.minAmount) {
      filtered = filtered.filter(exp => parseFloat(exp.amount) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(exp => parseFloat(exp.amount) <= parseFloat(filters.maxAmount));
    }

    setFilteredExpenses(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.emoji ?? '📦';
  };

  const getEmotionalIcon = (tag: string) => {
    const emotion = emotionalTags.find(e => e.label === tag);
    return emotion?.emoji ?? '😐';
  };

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <ExactSmartieAvatar mood="happy" size="sm" animated />
              <div className="text-right">
                <div className="text-sm opacity-90">Total Tracked</div>
                <div className="text-xl font-bold">£{totalSpent.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Track Expenses</h1>
            <p className="opacity-90">Monitor your spending and stay on budget</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex gap-3">
            <Button onClick={() => setShowAddForm(true)} className="flex-1 bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <Button variant="outline" onClick={() => navigate('/analytics')} className="flex-1">
              <TrendingDown className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>

          <SearchFilterSystem
            onFiltersChange={handleFiltersChange}
            expenseCategories={categories.map(c => c.name)}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {filteredExpenses.length > 0 ? 'Your Expenses' : 'No Expenses Found'}
                <Badge variant="outline" className="ml-auto">{filteredExpenses.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg" />
                  ))}
                </div>
              ) : filteredExpenses.length > 0 ? (
                <div className="space-y-3">
                  {filteredExpenses.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between p-4 bg-white border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(exp.category)}</span>
                        <div>
                          <div className="font-medium">{exp.description}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>{exp.category}</span>
                            {exp.emotionalTag && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  {getEmotionalIcon(exp.emotionalTag)} {exp.emotionalTag}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(exp.createdAt ?? new Date()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-bold text-red-600">
                        -£{parseFloat(exp.amount).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking your spending to see insights</p>
                  <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Your First Expense
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Add New Expense</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>✕</Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Description *</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What did you spend on?"
                      required
                    />
                  </div>
                  <div>
                    <Label>Amount (£) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.name} value={c.name}>
                            <span className="flex items-center gap-2">{c.emoji} {c.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>How did this purchase make you feel?</Label>
                    <div className="mt-2">
                      <EmotionalTrackingButton
                        onEmotionalTagSelected={(tag) => setFormData(prev => ({ ...prev, emotionalTag: tag }))}
                        selectedTag={formData.emotionalTag}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddForm(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" disabled={addExpenseMutation.isPending} className="flex-1 bg-green-600 text-white">
                      {addExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav currentTab="expenses" />
      </div>
    </ResponsiveLayout>
  );
}