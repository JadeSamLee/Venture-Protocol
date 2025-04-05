
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Wallet } from 'lucide-react';
import RetroButton from './RetroButton';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl">
                Venture Protocol
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:text-retro-green dark:hover:text-retro-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/investor"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:text-retro-green dark:hover:text-retro-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Investor Dashboard
              </Link>
              <Link
                to="/founder"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:text-retro-green dark:hover:text-retro-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Founder Dashboard
              </Link>
              <Link
                to="/projects"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:text-retro-green dark:hover:text-retro-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-retro-green dark:hover:text-retro-green rounded-full"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <RetroButton icon={<Wallet size={16} />}>
              Connect Wallet
            </RetroButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
