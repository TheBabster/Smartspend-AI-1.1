import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

interface EnhancedPieChartProps {
  data: PieChartData[];
  title: string;
  totalAmount: number;
  currency?: string;
}

const EnhancedPieChart: React.FC<EnhancedPieChartProps> = ({
  data,
  title,
  totalAmount,
  currency = "£"
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalAmount) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{data.payload.icon}</span>
            <span className="font-semibold text-high-contrast">{data.payload.name}</span>
          </div>
          <div className="text-sm">
            <p className="text-medium-contrast">Amount: <span className="font-bold text-high-contrast">{currency}{data.value.toFixed(2)}</span></p>
            <p className="text-medium-contrast">Percentage: <span className="font-bold text-high-contrast">{percentage}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    // Only show labels for segments larger than 5%
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const percentage = (percent * 100).toFixed(0);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold drop-shadow-sm"
        style={{ 
          filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.8))",
          stroke: "white",
          strokeWidth: "2px",
          paintOrder: "stroke fill"
        }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  const onPieEnter = (data: any, index: number) => {
    setActiveIndex(index);
    setHoveredSegment(data.name);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredSegment(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-high-contrast flex items-center gap-2">
          <span>📊</span>
          {title}
        </CardTitle>
        <p className="text-sm text-medium-contrast">
          Total: <span className="font-semibold text-high-contrast">{currency}{totalAmount.toFixed(2)}</span>
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart */}
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? "#ffffff" : "transparent"}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? "brightness(1.1)" : "brightness(1)",
                        transform: activeIndex === index ? "scale(1.02)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.2s ease"
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-shrink-0 w-full lg:w-48">
            <h4 className="font-semibold text-high-contrast mb-3 text-sm">Categories</h4>
            <div className="space-y-2">
              {data.map((entry, index) => {
                const percentage = ((entry.value / totalAmount) * 100).toFixed(1);
                const isHovered = hoveredSegment === entry.name;
                
                return (
                  <motion.div
                    key={entry.name}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      isHovered 
                        ? "bg-gray-100 dark:bg-gray-700 shadow-sm" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onMouseEnter={() => setHoveredSegment(entry.name)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-lg flex-shrink-0">{entry.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-high-contrast truncate">
                        {entry.name}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-bold text-high-contrast">
                        {currency}{entry.value.toFixed(0)}
                      </p>
                      <p className="text-xs text-medium-contrast">
                        {percentage}%
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPieChart;