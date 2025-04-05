
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Clock, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  type: 'investor' | 'founder';
}

const Sidebar = ({ type }: SidebarProps) => {
  const location = useLocation();

  const isInvestorNavItems = [
    { icon: Home, label: 'Dashboard', path: '/investor' },
    { icon: BarChart2, label: 'Portfolio', path: '/investor/portfolio' },
    { icon: Clock, label: 'Transactions', path: '/investor/transactions' },
    { icon: BarChart2, label: 'Analytics', path: '/investor/analytics' },
    { icon: Settings, label: 'Settings', path: '/investor/settings' },
  ];

  const founderNavItems = [
    { icon: Home, label: 'Dashboard', path: '/founder' },
    { icon: BarChart2, label: 'My Projects', path: '/founder/projects' },
    { icon: Users, label: 'Investors', path: '/founder/investors' },
    { icon: BarChart2, label: 'Analytics', path: '/founder/analytics' },
    { icon: Settings, label: 'Settings', path: '/founder/settings' },
  ];

  const navItems = type === 'investor' ? isInvestorNavItems : founderNavItems;

  return (
    <div className="w-64 bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Home className="w-6 h-6" />
          <span className="font-bold text-lg">Venture Protocol</span>
        </div>
        
        <div className="uppercase text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
          {type === 'investor' ? 'Investor Portal' : 'Founder Portal'}
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-retro-green text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
