
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, Check, Clock } from 'lucide-react';
import RetroButton from './RetroButton';

interface VoteProps {
  projectName: string;
  currentPhase: string;
  nextPhase: string;
  votesNeeded: number;
  votesReceived: number;
  hasVoted: boolean;
  onVote: () => void;
}

const VotingSection = ({
  projectName,
  currentPhase,
  nextPhase,
  votesNeeded,
  votesReceived,
  hasVoted,
  onVote
}: VoteProps) => {
  const [expanded, setExpanded] = useState(false);
  const percentComplete = (votesReceived / votesNeeded) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 p-6 card-shadow mb-6"
    >
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-lg font-bold flex items-center">
          <Vote size={20} className="mr-2 text-retro-green" />
          Governance Voting
        </h2>
        <div className="text-sm bg-retro-light text-retro-dark px-3 py-1 rounded-full">
          Active
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : '0px', opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Phase Advancement Proposal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Project <span className="font-medium">{projectName}</span> is seeking approval to advance 
              from <span className="font-medium">{currentPhase}</span> to <span className="font-medium">{nextPhase}</span>.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{votesReceived}/{votesNeeded} votes</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-retro-green" style={{ width: `${percentComplete}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Clock size={16} className="mr-1" />
              Voting ends in 3 days
            </div>
            {hasVoted ? (
              <div className="flex items-center text-retro-green">
                <Check size={16} className="mr-1" />
                <span className="text-sm">You voted</span>
              </div>
            ) : (
              <RetroButton onClick={onVote} size="sm">
                Cast Vote
              </RetroButton>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VotingSection;
