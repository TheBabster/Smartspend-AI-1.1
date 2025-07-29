import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  Heart, 
  DollarSign, 
  Tag, 
  SortAsc, 
  SortDesc,
  X,
  ChevronDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOptions {
  searchQuery: string;
  timeRange: 'today' | 'week' | 'month' | 'year' | 'all';
  smartnessScore: 'all' | 'smart' | 'okay' | 'regret';
  emotion: 'all' | 'happy' | 'neutral' | 'stressed' | 'excited' | 'regretful';
  category: string;
  minAmount: string;
  maxAmount: string;
  sortBy: 'date' | 'amount' | 'smartness' | 'category';
  sortOrder: 'asc' | 'desc';
}

interface SearchFilterSystemProps {
  onFiltersChange: (filters: FilterOptions) => void;
  expenseCategories: string[];
  className?: string;
}

const SearchFilterSystem: React.FC<SearchFilterSystemProps> = ({
  onFiltersChange,
  expenseCategories,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    timeRange: 'month',
    smartnessScore: 'all',
    emotion: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      searchQuery: '',
      timeRange: 'month',
      smartnessScore: 'all',
      emotion: 'all',
      category: 'all',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.timeRange !== 'month') count++;
    if (filters.smartnessScore !== 'all') count++;
    if (filters.emotion !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.minAmount || filters.maxAmount) count++;
    return count;
  };

  const getSmartScoreColor = (score: string) => {
    switch (score) {
      case 'smart': return 'bg-green-100 text-green-800 border-green-200';
      case 'okay': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'regret': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'stressed': return '😰';
      case 'excited': return '🤩';
      case 'regretful': return '😔';
      default: return '🎭';
    }
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar and Filter Toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search expenses..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
        
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className={`px-4 py-2 rounded-xl border-gray-200 hover:border-purple-300 relative ${
            activeFilterCount > 0 ? 'border-purple-300 bg-purple-50' : ''
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>

        {activeFilterCount > 0 && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {['smart', 'okay', 'regret'].map((score) => (
          <motion.button
            key={score}
            onClick={() => updateFilter('smartnessScore', filters.smartnessScore === score ? 'all' : score)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              filters.smartnessScore === score
                ? getSmartScoreColor(score)
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {score === 'smart' && '💚'} {score === 'okay' && '🟡'} {score === 'regret' && '🔴'}
            <span className="ml-1 capitalize">{score}</span>
          </motion.button>
        ))}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Time Range
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['today', 'week', 'month', 'year', 'all'].map((range) => (
                      <Button
                        key={range}
                        variant={filters.timeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('timeRange', range)}
                        className="capitalize"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Emotion Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Emotion
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['happy', 'neutral', 'stressed', 'excited', 'regretful'].map((emotion) => (
                      <Button
                        key={emotion}
                        variant={filters.emotion === emotion ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('emotion', filters.emotion === emotion ? 'all' : emotion)}
                        className="flex items-center gap-2"
                      >
                        <span>{getEmotionIcon(emotion)}</span>
                        <span className="capitalize">{emotion}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Min amount"
                      value={filters.minAmount}
                      onChange={(e) => updateFilter('minAmount', e.target.value)}
                      type="number"
                    />
                    <Input
                      placeholder="Max amount"
                      value={filters.maxAmount}
                      onChange={(e) => updateFilter('maxAmount', e.target.value)}
                      type="number"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    Sort By
                  </label>
                  <div className="flex gap-3">
                    <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="smartness">Smartness Score</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3"
                    >
                      {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilterSystem;