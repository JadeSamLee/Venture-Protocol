
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import RetroButton from '@/components/RetroButton';

const FounderDashboard = () => {
  const projects = [
    {
      project: 'DeFi Lending Protocol',
      description: 'A decentralized lending platform with innovative interest rate models',
      phase: 'PHASE_1',
      fundingGoal: '10 ETH',
      raised: '5.2 ETH',
      progress: 52,
      investors: 12
    },
    {
      project: 'NFT Marketplace',
      description: 'A next-gen marketplace for digital assets and collectibles',
      phase: 'ESCROW',
      fundingGoal: '15 ETH',
      raised: '3.4 ETH',
      progress: 23,
      investors: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar type="founder" />
        
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Founder Dashboard</h1>
            <RetroButton icon={<Plus size={16} />}>
              Create Project
            </RetroButton>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatCard title="Total Projects" value="2" />
            <StatCard title="Total Raised" value="8.60 ETH" />
            <StatCard title="Total Investors" value="17" />
            <StatCard title="Average Funding Rate" value="47%" />
          </motion.div>
          
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button className="border-retro-green text-retro-green pb-3 px-1 border-b-2 font-medium text-sm">
                  Overview
                </button>
                <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pb-3 px-1 border-b-2 font-medium text-sm">
                  Analytics
                </button>
                <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pb-3 px-1 border-b-2 font-medium text-sm">
                  Investors
                </button>
              </nav>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 p-6 card-shadow"
          >
            <h2 className="text-lg font-bold mb-2">My Projects</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Manage your existing projects
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Phase</th>
                    <th className="pb-3">Funding Goal</th>
                    <th className="pb-3">Raised</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3">Investors</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {projects.map((project, index) => (
                    <tr key={index}>
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{project.project}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                          {project.phase}
                        </span>
                      </td>
                      <td className="py-4">{project.fundingGoal}</td>
                      <td className="py-4">{project.raised}</td>
                      <td className="py-4">
                        <div className="w-32">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-retro-green h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{project.investors}</td>
                      <td className="py-4">
                        <button className="text-retro-green hover:text-retro-dark">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FounderDashboard;
