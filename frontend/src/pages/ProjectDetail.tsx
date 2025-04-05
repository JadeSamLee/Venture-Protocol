
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share, Check, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RetroButton from '@/components/RetroButton';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // This would typically come from an API call using the ID
  const project = {
    title: 'DeFi Lending Protocol',
    phase: 'PHASE_1',
    createdDate: '7/15/2023',
    description: 'A decentralized lending platform with innovative interest rate models. Our protocol allows users to borrow and lend cryptocurrencies without intermediaries, providing competitive rates and high security. The platform features automated interest rate adjustment based on supply and demand dynamics, liquidation protection mechanisms, and multi-chain support.',
    progress: 52,
    raised: '5.2 ETH',
    goal: '10 ETH',
    timeline: [
      {
        title: 'Initial Development',
        phase: 'ESCROW',
        description: 'Core protocol development and security testing',
        status: 'completed',
        date: '9/10/2023'
      },
      {
        title: 'Testnet Launch',
        phase: 'PHASE_1',
        description: 'Deployment on Ethereum testnet and public testing',
        status: 'current',
        date: ''
      },
      {
        title: 'Mainnet Launch',
        phase: 'PHASE_2',
        description: 'Full production deployment and marketing',
        status: 'upcoming',
        date: ''
      }
    ],
    team: [
      {
        name: 'Alex Rivers',
        role: 'Lead Developer',
        initial: 'A'
      },
      {
        name: 'Sarah Chen',
        role: 'Smart Contract Engineer',
        initial: 'S'
      },
      {
        name: 'Michael Kim',
        role: 'Product Manager',
        initial: 'M'
      }
    ],
    tokenSupply: '1,000,000',
    tokenDistribution: [
      { group: 'Founders', percentage: '15%' },
      { group: 'Investors', percentage: '50%' },
      { group: 'Community', percentage: '20%' },
      { group: 'Reserve', percentage: '15%' }
    ],
    founderAddress: '0x8a34F12dc73A3Fd51d4596f2B3e8eD4c532cDb67'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/projects" className="inline-flex items-center text-gray-500 hover:text-retro-green mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {project.phase}
                    </span>
                    <span>Created on {project.createdDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <Share size={18} />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mb-8 mt-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button className="border-retro-green text-retro-green pb-3 px-1 border-b-2 font-medium">
                    Overview
                  </button>
                  <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pb-3 px-1 border-b-2 font-medium">
                    Updates
                  </button>
                  <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pb-3 px-1 border-b-2 font-medium">
                    Investors
                  </button>
                </nav>
              </div>
              
              <div className="bg-white dark:bg-black rounded-lg p-6 card-shadow mb-8">
                <h2 className="text-xl font-bold mb-4">Project Description</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {project.description}
                </p>
              </div>
              
              <div className="bg-white dark:bg-black rounded-lg p-6 card-shadow mb-8">
                <h2 className="text-xl font-bold mb-6">Project Timeline</h2>
                <div className="space-y-6">
                  {project.timeline.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        {item.status === 'completed' ? (
                          <div className="w-8 h-8 bg-retro-green rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        ) : item.status === 'current' ? (
                          <div className="w-8 h-8 border-2 border-retro-green rounded-full flex items-center justify-center">
                            <Clock size={16} className="text-retro-green" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-start mb-1">
                          <h3 className="font-bold mr-2">{item.title}</h3>
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                            {item.phase}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                          {item.description}
                        </p>
                        {item.status === 'completed' && (
                          <p className="text-green-500 text-xs">Completed on {item.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-black rounded-lg p-6 card-shadow">
                <h2 className="text-xl font-bold mb-6">Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.team.map((member, index) => (
                    <div key={index} className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mr-3">
                          <span className="font-bold">{member.initial}</span>
                        </div>
                        <div>
                          <h3 className="font-bold">{member.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-black rounded-lg p-6 card-shadow mb-8 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Funding Progress</h2>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {project.phase}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className="bg-retro-green h-3 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Raised</div>
                      <div className="text-xl font-bold">{project.raised}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 dark:text-gray-400">Goal</div>
                      <div className="text-xl font-bold">{project.goal}</div>
                    </div>
                  </div>
                </div>
                
                <RetroButton className="w-full mb-6">
                  Stake in this Project
                </RetroButton>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Current Phase
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-retro-green text-white text-xs px-3 py-1 rounded-full">
                          {project.phase}
                        </span>
                        <button className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                          Advance Phase
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Token Supply
                      </div>
                      <div>{project.tokenSupply}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Token Distribution
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {project.tokenDistribution.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.group}:</span>
                            <span className="font-medium">{item.percentage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Founder
                      </div>
                      <div className="text-xs font-mono break-all">
                        {project.founderAddress}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 p-4 rounded-lg text-sm">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <Check size={16} />
                    <span className="font-medium">This project has been verified by the Venture Protocol team.</span>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1 text-xs">
                    Always do your own research before investing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
