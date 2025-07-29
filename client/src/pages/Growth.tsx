import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ViralGrowthHub from '@/components/ViralGrowthHub';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import BottomNav from '@/components/BottomNav';

const Growth: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 pb-24">
          <ViralGrowthHub />
        </div>
      </div>
      <BottomNav currentTab="growth" />
    </ResponsiveLayout>
  );
};

export default Growth;