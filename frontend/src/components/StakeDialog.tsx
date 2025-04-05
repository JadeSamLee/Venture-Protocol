
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import RetroButton from './RetroButton';

interface StakeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onConfirm: (amount: string) => void;
}

const StakeDialog = ({ isOpen, onClose, projectName, onConfirm }: StakeDialogProps) => {
  const [amount, setAmount] = useState('');
  const gasFee = '~0.002 ETH';
  const tokenPrice = '0.001 ETH';
  
  const handleConfirm = () => {
    onConfirm(amount);
    onClose();
  };
  
  const estimatedTokens = parseFloat(amount) ? Math.floor(parseFloat(amount) / 0.001) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800 shadow-lg max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            Stake in Project
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <X size={18} />
            </button>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            You are about to stake in <span className="font-medium">{projectName}</span>. Staked funds 
            will be locked until the project reaches its next phase or funding goal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Gas Fee</label>
            <div className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center">
              <span className="mr-2">~</span>{gasFee}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">You will receive:</span>
              <span className="font-medium">{estimatedTokens} Tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current token price:</span>
              <span className="font-medium">{tokenPrice}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-4 mt-2">
          <RetroButton variant="outline" className="sm:w-1/2" onClick={onClose}>
            Cancel
          </RetroButton>
          <RetroButton className="sm:w-1/2" onClick={handleConfirm}>
            Confirm Stake
          </RetroButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StakeDialog;
