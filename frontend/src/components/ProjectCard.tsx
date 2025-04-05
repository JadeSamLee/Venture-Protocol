
import React from 'react';
import { motion } from 'framer-motion';
import RetroButton from './RetroButton';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  phase: string;
  tag: string;
  description: string;
  progress: number;
  fundingGoal: string;
  raised: string;
  investors: number;
  date?: string;
}

const ProjectCard = ({
  title,
  phase,
  tag,
  description,
  progress,
  fundingGoal,
  raised,
  investors,
  date
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden card-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
            {phase}
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-block bg-retro-light text-retro-dark text-xs px-2 py-1 rounded mb-3">
            {tag}
          </span>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">{progress}% Funded</span>
            <span className="font-medium">
              {raised} / {fundingGoal}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-retro-green" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between mb-5 text-xs text-gray-500 dark:text-gray-400">
          <div>{investors} investors</div>
          {date && <div>Created {date}</div>}
        </div>
        
        <RetroButton className="w-full">
          <span>View Project</span>
          <ArrowRight size={16} />
        </RetroButton>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
