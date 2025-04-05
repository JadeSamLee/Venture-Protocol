
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import DecorativePattern from '@/components/DecorativePattern';

type ProjectPhase = 'PHASE_1' | 'PHASE_2' | 'ESCROW';
type ProjectTag = 'DeFi' | 'NFT' | 'Infrastructure' | 'Identity' | 'DAO';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>([]);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  
  const allProjects = [
    {
      title: 'DAO Governance Tool',
      phase: 'ESCROW' as ProjectPhase,
      tag: 'DAO' as ProjectTag,
      description: 'Simplified governance platform for decentralized organizations.',
      progress: 23,
      fundingGoal: '12 ETH',
      raised: '2.8 ETH',
      investors: 7,
      date: '10/12/2023'
    },
    {
      title: 'NFT Marketplace',
      phase: 'ESCROW' as ProjectPhase,
      tag: 'NFT' as ProjectTag,
      description: 'A next-gen marketplace for digital collectibles with zero gas fees.',
      progress: 23,
      fundingGoal: '15 ETH',
      raised: '3.4 ETH',
      investors: 5,
      date: '9/23/2023'
    },
    {
      title: 'Decentralized Identity',
      phase: 'PHASE_1' as ProjectPhase,
      tag: 'Identity' as ProjectTag,
      description: 'Self-sovereign identity solution using zero-knowledge proofs.',
      progress: 39,
      fundingGoal: '8 ETH',
      raised: '3.1 ETH',
      investors: 9,
      date: '8/5/2023'
    },
    {
      title: 'DeFi Yield Aggregator',
      phase: 'PHASE_1' as ProjectPhase,
      tag: 'DeFi' as ProjectTag,
      description: 'Optimized yield farming across multiple protocols.',
      progress: 40,
      fundingGoal: '18 ETH',
      raised: '7.2 ETH',
      investors: 14,
      date: '6/15/2023'
    },
    {
      title: 'DeFi Lending Protocol',
      phase: 'PHASE_1' as ProjectPhase,
      tag: 'DeFi' as ProjectTag,
      description: 'A decentralized lending platform with innovative interest rate models.',
      progress: 52,
      fundingGoal: '10 ETH',
      raised: '5.2 ETH',
      investors: 12,
      date: '7/15/2023'
    },
    {
      title: 'Cross-chain Bridge',
      phase: 'PHASE_2' as ProjectPhase,
      tag: 'Infrastructure' as ProjectTag,
      description: 'Seamless asset transfer between major blockchain networks.',
      progress: 84,
      fundingGoal: '20 ETH',
      raised: '16.8 ETH',
      investors: 19,
      date: '5/10/2023'
    }
  ];
  
  // Filter projects based on search query, selected phases, and tags
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPhase = selectedPhases.length === 0 || selectedPhases.includes(project.phase);
    const matchesTag = selectedTags.length === 0 || selectedTags.includes(project.tag);
    
    return matchesSearch && matchesPhase && matchesTag;
  });
  
  // Sort projects based on selected option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOption) {
      case 'most-funded':
        return parseFloat(b.raised.split(' ')[0]) - parseFloat(a.raised.split(' ')[0]);
      case 'least-funded':
        return parseFloat(a.raised.split(' ')[0]) - parseFloat(b.raised.split(' ')[0]);
      case 'progress':
        return b.progress - a.progress;
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  const handlePhaseToggle = (phase: ProjectPhase) => {
    setSelectedPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase) 
        : [...prev, phase]
    );
  };
  
  const handleTagToggle = (tag: ProjectTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <DecorativePattern variant="squares" color="#4CAF50" />
        </div>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Discover and invest in innovative blockchain projects
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-2 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black"
                />
              </div>
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
                      <Filter size={18} />
                      <span>Filters</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Project Phase</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPhases.includes('ESCROW')}
                              onChange={() => handlePhaseToggle('ESCROW')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>ESCROW</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPhases.includes('PHASE_1')}
                              onChange={() => handlePhaseToggle('PHASE_1')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>PHASE_1</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPhases.includes('PHASE_2')}
                              onChange={() => handlePhaseToggle('PHASE_2')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>PHASE_2</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Project Category</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes('DeFi')}
                              onChange={() => handleTagToggle('DeFi')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>DeFi</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes('NFT')}
                              onChange={() => handleTagToggle('NFT')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>NFT</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes('Infrastructure')}
                              onChange={() => handleTagToggle('Infrastructure')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>Infrastructure</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes('Identity')}
                              onChange={() => handleTagToggle('Identity')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>Identity</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes('DAO')}
                              onChange={() => handleTagToggle('DAO')}
                              className="mr-2 h-4 w-4 accent-retro-green"
                            />
                            <span>DAO</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <select 
                  className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="most-funded">Most Funded</option>
                  <option value="least-funded">Least Funded</option>
                  <option value="progress">Progress</option>
                </select>
              </div>
            </div>
            
            {sortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProjects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-black rounded-lg p-8 text-center card-shadow">
                <h3 className="text-xl font-medium mb-2">No Projects Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Projects;
