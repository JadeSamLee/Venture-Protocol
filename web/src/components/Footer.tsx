
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Venture Protocol</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              A decentralized venture capital platform for founders and investors.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-500 hover:text-retro-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link to="#" className="text-gray-500 hover:text-retro-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
              <Link to="#" className="text-gray-500 hover:text-retro-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord">
                  <circle cx="9" cy="12" r="1"></circle>
                  <circle cx="15" cy="12" r="1"></circle>
                  <path d="M7.5 7.2a15.8 15.8 0 0 1 9 0"></path>
                  <path d="M7.5 16.8a15.8 15.8 0 0 0 9 0"></path>
                  <path d="M12 16.8v3.5a2 2 0 0 1-2 2H7.5a4.5 4.5 0 0 1 0-9h2a6.5 6.5 0 0 0-2.5-5.5"></path>
                  <path d="M16.5 16.8v3.5a2 2 0 0 0 2 2h2.5a4.5 4.5 0 0 0 0-9h-2a6.5 6.5 0 0 1 2.5-5.5"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/investor" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Investor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/founder" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Founder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-retro-green">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} Venture Protocol. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-retro-green text-sm">
              Twitter
            </Link>
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-retro-green text-sm">
              Discord
            </Link>
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-retro-green text-sm">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
