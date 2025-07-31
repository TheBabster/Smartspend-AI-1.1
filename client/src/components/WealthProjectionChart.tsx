import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface WealthProjectionProps {
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number; // percentage 0-100
  years: number;
}

const WealthProjectionChart: React.FC<WealthProjectionProps> = ({
  currentSavings,
  monthlyIncome,
  monthlyExpenses,
  savingsRate,
  years = 10
}) => {
  // Calculate projections
  const monthlySavings = (monthlyIncome - monthlyExpenses) * (savingsRate / 100);
  const monthlySpending = monthlyIncome - monthlySavings;
  
  // Generate yearly projection data
  const projectionData = [];
  
  for (let year = 0; year <= years; year++) {
    const withSavings = currentSavings + (monthlySavings * 12 * year);
    const withoutSavings = currentSavings; // Stays the same if no savings
    
    projectionData.push({
      year: year === 0 ? 'Now' : `Year ${year}`,
      withSavings: Math.round(withSavings),
      withoutSavings: Math.round(withoutSavings),
      savingsGap: Math.round(withSavings - withoutSavings)
    });
  }

  const finalWealth = projectionData[projectionData.length - 1].withSavings;
  const totalSaved = finalWealth - currentSavings;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Savings</p>
                <p className="text-xl font-bold text-green-600">£{monthlySavings.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Wealth</p>
                <p className="text-xl font-bold text-purple-600">£{finalWealth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Savings Rate</p>
                <p className="text-xl font-bold text-orange-600">{savingsRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Wealth Projection: Saving vs Not Saving
          </CardTitle>
          <p className="text-sm text-gray-600">
            See how your financial future changes based on your saving habits
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={(value) => `£${(value / 1000)}k`}
              />
              <Tooltip 
                formatter={(value, name) => [`£${value.toLocaleString()}`, name === 'withSavings' ? 'With Savings' : 'Without Savings']}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="withSavings" 
                stroke="#10B981" 
                strokeWidth={3}
                name="With Savings"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="withoutSavings" 
                stroke="#EF4444" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Without Savings"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total saved over {years} years:</span>
              <span className="font-semibold text-green-600">£{totalSaved.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly savings goal:</span>
              <span className="font-semibold">£{monthlySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Savings as % of income:</span>
              <span className="font-semibold">{((monthlySavings / monthlyIncome) * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          {savingsRate < 10 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">Low Savings Rate</p>
                  <p className="text-sm text-orange-700">
                    Financial experts recommend saving at least 10-20% of your income. 
                    Consider reviewing your expenses to increase your savings rate.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {savingsRate >= 20 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Excellent Savings Rate!</p>
                  <p className="text-sm text-green-700">
                    You're saving {savingsRate}% of your income - this puts you on track for financial freedom!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WealthProjectionChart;