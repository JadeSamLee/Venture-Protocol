
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  className?: string;
  positive?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  className,
  positive = true 
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("stat-card", className)}
    >
      <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </div>
      <div className="flex items-end gap-2 mb-1">
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div className={`text-sm font-medium ${positive ? 'text-retro-green' : 'text-red-500'}`}>
            {change}
          </div>
        )}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
