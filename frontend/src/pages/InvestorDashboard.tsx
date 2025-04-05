
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import RetroButton from '@/components/RetroButton';
import VotingSection from '@/components/VotingSection';
import StakeDialog from '@/components/StakeDialog';
import AnalyticsSection from '@/components/AnalyticsSection';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';

const InvestorDashboard = () => {
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  
  const investments = [
    {
      project: 'DeFi Lending Protocol',
      phase: 'PHASE_1',
      staked: '2.5 ETH',
      returnRate: '12.5%',
      activity: '2 days ago',
      positive: true
    },
    {
      project: 'NFT Marketplace',
      phase: 'ESCROW',
      staked: '1.8 ETH',
      returnRate: '8.2%',
      activity: '5 days ago',
      positive: true
    },
    {
      project: 'Cross-chain Bridge',
      phase: 'PHASE_2',
      staked: '3.7 ETH',
      returnRate: '15.1%',
      activity: '1 day ago',
      positive: true
    }
  ];

  const handleOpenStakeDialog = (project: string) => {
    setSelectedProject(project);
    setIsStakeDialogOpen(true);
  };

  const handleStake = (amount: string) => {
    toast({
      title: "Stake Confirmed",
      description: `You have staked ${amount} ETH in ${selectedProject}`,
    });
  };
  
  const handleVote = () => {
    setHasVoted(true);
    toast({
      title: "Vote Cast",
      description: "Your vote has been recorded. Thank you for participating in governance!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar type="investor" />
        
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-8">Investor Dashboard</h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <StatCard 
              title="Total Staked Value" 
              value="8.00 ETH" 
              change="+5.2%" 
              subtitle="Across 3 projects" 
              positive={true}
            />
            <StatCard 
              title="Average Return Rate" 
              value="11.9%" 
              change="+2.1%" 
              subtitle="Monthly average" 
              positive={true}
            />
            <StatCard 
              title="Available to Stake" 
              value="12.45 ETH" 
              subtitle="From connected wallet" 
            />
          </motion.div>
          
          <VotingSection
            projectName="DeFi Lending Protocol"
            currentPhase="PHASE_1"
            nextPhase="PHASE_2"
            votesNeeded={100}
            votesReceived={68}
            hasVoted={hasVoted}
            onVote={handleVote}
          />
          
          <AnalyticsSection className="mb-8" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Active Investments</h2>
                <div className="flex gap-2">
                  <button className="text-gray-500 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Filter size={18} />
                  </button>
                  <select className="text-sm border rounded p-2 bg-white dark:bg-black">
                    <option>Sort by: Recent</option>
                    <option>Sort by: Value</option>
                    <option>Sort by: Return</option>
                  </select>
                </div>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Your current stake in various projects
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                      <th className="pb-3">Project</th>
                      <th className="pb-3">Phase</th>
                      <th className="pb-3">Staked</th>
                      <th className="pb-3">Return Rate</th>
                      <th className="pb-3">Last Activity</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {investments.map((investment, index) => (
                      <tr key={index}>
                        <td className="py-3">{investment.project}</td>
                        <td className="py-3">
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                            {investment.phase}
                          </span>
                        </td>
                        <td className="py-3">{investment.staked}</td>
                        <td className="py-3 text-retro-green">{investment.returnRate}</td>
                        <td className="py-3 text-gray-500">{investment.activity}</td>
                        <td className="py-3">
                          <button 
                            className="text-retro-green hover:text-retro-dark"
                            onClick={() => handleOpenStakeDialog(investment.project)}
                          >
                            <ArrowRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 p-6 card-shadow">
              <h2 className="text-lg font-bold mb-2">Stake in a Project</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Support a project by staking ETH
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Project</label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black">
                    <option>Select a project</option>
                    <option>DeFi Lending Protocol</option>
                    <option>NFT Marketplace</option>
                    <option>Cross-chain Bridge</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Gas Fee</label>
                  <div className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center">
                    <span className="mr-2">~</span>0.0002 ETH
                  </div>
                </div>
                
                <RetroButton 
                  className="w-full mt-4" 
                  onClick={() => handleOpenStakeDialog('Selected Project')}
                >
                  Preview Transaction
                </RetroButton>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      <StakeDialog
        isOpen={isStakeDialogOpen}
        onClose={() => setIsStakeDialogOpen(false)}
        projectName={selectedProject}
        onConfirm={handleStake}
      />
      
      <Footer />
    </div>
  );
};

export default InvestorDashboard;
