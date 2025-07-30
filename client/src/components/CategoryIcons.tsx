import React from 'react';
import { 
  ShoppingCart, 
  Utensils, 
  Car, 
  GamepadIcon, 
  Home, 
  Heart, 
  GraduationCap,
  Plane,
  Coffee,
  Smartphone,
  Shirt,
  Dumbbell,
  Palette,
  Music,
  Camera,
  Book
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ category, size = 'md', className = '' }: CategoryIconProps) {
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-5 h-5';
    }
  };

  const getIconComponent = () => {
    const iconClass = `${getIconSize()} ${className}`;
    
    switch (category.toLowerCase()) {
      case 'food & dining':
      case 'food':
      case 'dining':
        return <Utensils className={iconClass} />;
      
      case 'shopping':
      case 'retail':
        return <ShoppingCart className={iconClass} />;
      
      case 'transport':
      case 'transportation':
      case 'travel':
        return <Car className={iconClass} />;
      
      case 'entertainment':
      case 'games':
        return <GamepadIcon className={iconClass} />;
      
      case 'utilities':
      case 'bills':
      case 'home':
        return <Home className={iconClass} />;
      
      case 'health':
      case 'healthcare':
      case 'medical':
        return <Heart className={iconClass} />;
      
      case 'education':
      case 'learning':
        return <GraduationCap className={iconClass} />;
      
      case 'vacation':
      case 'holidays':
        return <Plane className={iconClass} />;
      
      case 'coffee':
      case 'drinks':
        return <Coffee className={iconClass} />;
      
      case 'technology':
      case 'electronics':
        return <Smartphone className={iconClass} />;
      
      case 'clothing':
      case 'fashion':
        return <Shirt className={iconClass} />;
      
      case 'fitness':
      case 'gym':
        return <Dumbbell className={iconClass} />;
      
      case 'hobbies':
      case 'art':
        return <Palette className={iconClass} />;
      
      case 'music':
      case 'streaming':
        return <Music className={iconClass} />;
      
      case 'photography':
        return <Camera className={iconClass} />;
      
      case 'books':
      case 'reading':
        return <Book className={iconClass} />;
      
      default:
        return <ShoppingCart className={iconClass} />;
    }
  };

  return getIconComponent();
}

// Category color mapping for consistent theming
export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food & dining':
    case 'food':
    case 'dining':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    
    case 'shopping':
    case 'retail':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    
    case 'transport':
    case 'transportation':
    case 'travel':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    
    case 'entertainment':
    case 'games':
      return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
    
    case 'utilities':
    case 'bills':
    case 'home':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    
    case 'health':
    case 'healthcare':
    case 'medical':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    
    case 'education':
    case 'learning':
      return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20';
    
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  }
};

// Get category gradient for premium styling
export const getCategoryGradient = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food & dining':
    case 'food':
    case 'dining':
      return 'from-orange-400 to-red-400';
    
    case 'shopping':
    case 'retail':
      return 'from-blue-400 to-indigo-400';
    
    case 'transport':
    case 'transportation':
    case 'travel':
      return 'from-green-400 to-teal-400';
    
    case 'entertainment':
    case 'games':
      return 'from-purple-400 to-pink-400';
    
    case 'utilities':
    case 'bills':
    case 'home':
      return 'from-yellow-400 to-orange-400';
    
    case 'health':
    case 'healthcare':
    case 'medical':
      return 'from-red-400 to-pink-400';
    
    case 'education':
    case 'learning':
      return 'from-indigo-400 to-purple-400';
    
    default:
      return 'from-gray-400 to-gray-500';
  }
};