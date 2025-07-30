import React, { useState } from 'react';
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
import BottomNav from '@/components/BottomNav';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import ExactSmartieAvatar from '@/components/ExactSmartieAvatar';
import SearchFilterSystem from '@/components/SearchFilterSystem';
import { 
  Plus, 
  Receipt, 
  TrendingDown, 
  Search,
  Calendar,
  DollarSign,
  Tag,
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
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
  const [, navigate] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    emotionalTag: ''
  });

  // Fetch expenses and budgets
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({ 
    queryKey: ['/api/expenses']
  });

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const { data: budgets = [] } = useQuery<Budget[]>({ 
    queryKey: ['/api/budgets'] 
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/expenses', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      setShowAddForm(false);
      setFormData({ description: '', amount: '', category: '', emotionalTag: '' });
      toast({
        title: "Expense Added Successfully!",
        description: "Your expense has been tracked and budgets updated.",
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

    addExpenseMutation.mutate({
      description: formData.description,
      amount: parseFloat(formData.amount).toFixed(2),
      category: formData.category,
      emotionalTag: formData.emotionalTag,
      date: new Date().toISOString()
    });
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...expenses];

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Apply emotion filter
    if (filters.emotion !== 'all') {
      filtered = filtered.filter(expense => expense.emotionalTag === filters.emotion);
    }

    // Apply time range filter
    const now = new Date();
    if (filters.timeRange !== 'all') {
      const timeLimit = new Date();
      switch (filters.timeRange) {
        case 'today':
          timeLimit.setHours(0, 0, 0, 0);
          break;
        case 'week':
          timeLimit.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeLimit.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          timeLimit.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(expense => 
        new Date(expense.date) >= timeLimit
      );
    }

    // Apply amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(expense => 
        parseFloat(expense.amount) >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(expense => 
        parseFloat(expense.amount) <= parseFloat(filters.maxAmount)
      );
    }

    setFilteredExpenses(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.emoji : '📦';
  };

  const getEmotionalIcon = (tag: string) => {
    const emotion = emotionalTags.find(e => e.label === tag);
    return emotion ? emotion.emoji : '😐';
  };

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

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
              <ExactSmartieAvatar mood="happy" size="sm" animated={true} />
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

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="flex-1"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>

          {/* Search and Filter */}
          <SearchFilterSystem
            onFiltersChange={handleFiltersChange}
            expenseCategories={categories.map(c => c.name)}
          />

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {filteredExpenses.length > 0 ? 'Your Expenses' : 'No Expenses Found'}
                <Badge variant="outline" className="ml-auto">
                  {filteredExpenses.length} items
                </Badge>
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
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {expense.description}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{expense.category}</span>
                            {expense.emotionalTag && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  {getEmotionalIcon(expense.emotionalTag)}
                                  {expense.emotionalTag}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(expense.createdAt || new Date()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          -£{parseFloat(expense.amount).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No expenses yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking your spending to see insights</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Expense
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Modal */}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Add New Expense</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    ✕
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What did you spend on?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (£) *</Label>
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

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center gap-2">
                              <span>{category.emoji}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="emotional">Emotional Tag</Label>
                    <Select
                      value={formData.emotionalTag}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, emotionalTag: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How did you feel?" />
                      </SelectTrigger>
                      <SelectContent>
                        {emotionalTags.map(tag => (
                          <SelectItem key={tag.label} value={tag.label}>
                            <div className="flex items-center gap-2">
                              <span>{tag.emoji}</span>
                              <span>{tag.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addExpenseMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    >
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