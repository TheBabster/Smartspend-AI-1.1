import React from 'react';
import { 
  // Financial & Money
  DollarSign, PoundSterling, CreditCard, Wallet, PiggyBank, TrendingUp, TrendingDown,
  // Navigation & Actions
  Home, User, Settings, Plus, Minus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  // Categories
  Coffee, ShoppingBag, Car, Home as House, Gamepad2, Heart, Book, Plane,
  // Status & Feedback
  CheckCircle, AlertCircle, AlertTriangle, Info, X, Check,
  // Analytics & Data
  BarChart3, PieChart, LineChart, Activity, Target, Award,
  // Communication
  MessageCircle, Bell, Mail, Phone,
  // Time & Calendar
  Calendar, Clock, Timer,
  // Media & UI
  Eye, EyeOff, Search, Filter, MoreVertical, MoreHorizontal,
  // Brain & Intelligence
  Brain, Lightbulb, Zap, Star,
  // Emotions (for Smartie states)
  Smile, Frown, Meh, Heart as HeartFull,
  type LucideIcon
} from 'lucide-react';

// Consistent icon system for 10/10 professional design
export const ProfessionalIcons = {
  // Financial categories with consistent style
  categories: {
    'Food & Dining': Coffee,
    'Shopping': ShoppingBag,
    'Transportation': Car,
    'Housing': House,
    'Entertainment': Gamepad2,
    'Healthcare': Heart,
    'Education': Book,
    'Travel': Plane,
    'Other': MoreHorizontal
  },

  // Navigation icons
  navigation: {
    home: Home,
    analytics: BarChart3,
    goals: Target,
    profile: User,
    settings: Settings,
    smartie: Brain
  },

  // Action icons
  actions: {
    add: Plus,
    remove: Minus,
    edit: Settings,
    view: Eye,
    hide: EyeOff,
    search: Search,
    filter: Filter,
    next: ArrowRight,
    previous: ArrowLeft,
    up: ArrowUp,
    down: ArrowDown
  },

  // Status & feedback icons
  status: {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
    close: X,
    check: Check
  },

  // Financial & money icons
  money: {
    currency: PoundSterling,
    dollar: DollarSign,
    card: CreditCard,
    wallet: Wallet,
    savings: PiggyBank,
    profit: TrendingUp,
    loss: TrendingDown
  },

  // Analytics & data icons
  analytics: {
    bar: BarChart3,
    pie: PieChart,
    line: LineChart,
    activity: Activity,
    target: Target,
    award: Award
  },

  // Communication icons
  communication: {
    message: MessageCircle,
    notification: Bell,
    email: Mail,
    phone: Phone
  },

  // Time & scheduling icons
  time: {
    calendar: Calendar,
    clock: Clock,
    timer: Timer
  },

  // Intelligence & AI icons
  intelligence: {
    brain: Brain,
    idea: Lightbulb,
    energy: Zap,
    quality: Star
  },

  // Emotion icons (for Smartie expressions)
  emotions: {
    happy: Smile,
    sad: Frown,
    neutral: Meh,
    love: HeartFull
  }
};

// Professional icon wrapper component
interface ProfessionalIconProps {
  name: keyof typeof ProfessionalIcons | string;
  category?: keyof typeof ProfessionalIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';
}

export const ProfessionalIcon: React.FC<ProfessionalIconProps> = ({
  name,
  category,
  size = 'md',
  className = "",
  color = 'primary'
}) => {
  // Size mapping
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Color mapping
  const colorClasses = {
    primary: 'text-slate-700',
    secondary: 'text-slate-500',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-rose-600',
    muted: 'text-slate-400'
  };

  // Get the icon component
  let IconComponent: LucideIcon;

  if (category && ProfessionalIcons[category] && typeof ProfessionalIcons[category] === 'object') {
    IconComponent = (ProfessionalIcons[category] as any)[name] || MoreHorizontal;
  } else {
    // Try to find the icon in all categories
    IconComponent = MoreHorizontal;
    for (const cat of Object.values(ProfessionalIcons)) {
      if (typeof cat === 'object' && (cat as any)[name]) {
        IconComponent = (cat as any)[name];
        break;
      }
    }
  }

  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

// Convenience components for common icon patterns
export const CategoryIcon: React.FC<{
  category: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ category, size = 'md', className = "" }) => {
  const IconComponent = ProfessionalIcons.categories[category as keyof typeof ProfessionalIcons.categories] || MoreHorizontal;
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <IconComponent className={`${sizeClasses[size]} text-slate-600 ${className}`} />
  );
};

export const StatusIcon: React.FC<{
  status: 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ status, size = 'md', className = "" }) => {
  const IconComponent = ProfessionalIcons.status[status];
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const colorClasses = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-rose-600',
    info: 'text-blue-600'
  };

  return (
    <IconComponent className={`${sizeClasses[size]} ${colorClasses[status]} ${className}`} />
  );
};

export const NavigationIcon: React.FC<{
  nav: 'home' | 'analytics' | 'goals' | 'profile' | 'settings' | 'smartie';
  active?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ nav, active = false, size = 'md', className = "" }) => {
  const IconComponent = ProfessionalIcons.navigation[nav];
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const colorClass = active ? 'text-blue-600' : 'text-slate-500';

  return (
    <IconComponent className={`${sizeClasses[size]} ${colorClass} ${className}`} />
  );
};

// Professional icon badge component
interface IconBadgeProps {
  icon: keyof typeof ProfessionalIcons.categories | keyof typeof ProfessionalIcons.navigation;
  category?: keyof typeof ProfessionalIcons;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  category = 'categories',
  variant = 'primary',
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const variantClasses = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-rose-100 text-rose-600'
  };

  return (
    <div className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full flex items-center justify-center ${className}`}>
      <ProfessionalIcon 
        name={icon} 
        category={category}
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
        color={variant}
      />
    </div>
  );
};