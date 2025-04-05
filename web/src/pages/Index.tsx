
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RetroButton from '@/components/RetroButton';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import DecorativePattern from '@/components/DecorativePattern';

const Index = () => {
  const featuredProjects = [
    {
      title: 'DeFi Lending Protocol',
      phase: 'PHASE_1',
      tag: 'DeFi',
      description: 'A decentralized lending platform with innovative interest rate models.',
      progress: 52,
      fundingGoal: '10 ETH',
      raised: '5.2 ETH',
      investors: 12,
      date: '7/15/2023'
    },
    {
      title: 'NFT Marketplace',
      phase: 'ESCROW',
      tag: 'NFT',
      description: 'A next-gen marketplace for digital collectibles with zero gas fees.',
      progress: 23,
      fundingGoal: '15 ETH',
      raised: '3.4 ETH',
      investors: 5,
      date: '9/23/2023'
    },
    {
      title: 'Cross-chain Bridge',
      phase: 'PHASE_2',
      tag: 'Infrastructure',
      description: 'Seamless asset transfer between major blockchain networks.',
      progress: 84,
      fundingGoal: '20 ETH',
      raised: '16.8 ETH',
      investors: 19,
      date: '5/10/2023'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <header className="relative bg-gradient-to-br from-gray-900 to-black py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <DecorativePattern variant="dots" color="#fff" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Decentralized Venture Capital<br />
              for the Future
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Venture Protocol provides a transparent, secure, and efficient platform for founders and
              investors to connect and grow together in the Web3 ecosystem.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link to="/investor">
                <RetroButton size="lg" icon={<ArrowRight size={18} />}>
                  Start Investing
                </RetroButton>
              </Link>
              <Link to="/founder">
                <RetroButton size="lg" variant="outline">
                  Launch a Project
                </RetroButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-b from-black/0 to-gray-50 dark:to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </header>
      
      <section className="py-20 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <DecorativePattern variant="squares" color="#4CAF50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Discover innovative projects seeking investment on our platform
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/projects">
                <RetroButton>
                  View All Projects
                  <ArrowRight size={16} />
                </RetroButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform connects innovators with investors through a transparent, 
              secure, and efficient process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-retro-light text-retro-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Project Submission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Founders submit their projects with detailed information, 
                funding goals, and roadmap
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-retro-light text-retro-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Investment Process</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Investors browse projects, perform due diligence, and stake 
                funds in promising ventures
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-retro-light text-retro-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Milestone-Based Funding</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Projects advance through phases with investor voting, 
                ensuring accountability and reducing risk
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
