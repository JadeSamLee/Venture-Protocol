
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'default' | 'sm' | 'lg';
  icon?: React.ReactNode;
}

const RetroButton = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  icon,
  ...props
}: RetroButtonProps) => {
  const variants = {
    default: 'bg-retro-green hover:bg-retro-dark text-white',
    outline: 'bg-transparent border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-white',
    subtle: 'bg-retro-light text-retro-dark hover:bg-retro-green hover:text-white',
  };

  const sizes = {
    default: 'px-4 py-2 text-base',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ y: -4, boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)' }}
      whileTap={{ y: 4, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-md font-medium transition-colors shadow-md',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </div>
    </motion.button>
  );
};

export default RetroButton;
