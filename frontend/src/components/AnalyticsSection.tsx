
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsSectionProps {
  className?: string;
}

const AnalyticsSection = ({ className }: AnalyticsSectionProps) => {
  const projectData = [
    { name: 'Jan', value: 3 },
    { name: 'Feb', value: 5 },
    { name: 'Mar', value: 7 },
    { name: 'Apr', value: 9 },
    { name: 'May', value: 12 },
    { name: 'Jun', value: 14 },
  ];

  const performanceData = [
    { name: 'DeFi', value: 35 },
    { name: 'NFT', value: 25 },
    { name: 'Infrastructure', value: 20 },
    { name: 'DAO', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#4CAF50', '#81C784', '#C8E6C9', '#A5D6A7', '#2E7D32'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 p-6 card-shadow ${className}`}
    >
      <h2 className="text-xl font-bold mb-6">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Projects Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#4CAF50" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Portfolio Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Invested</h3>
          <p className="text-xl font-bold">35.7 ETH</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average ROI</h3>
          <p className="text-xl font-bold text-retro-green">+18.3%</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Projects</h3>
          <p className="text-xl font-bold">14</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsSection;
