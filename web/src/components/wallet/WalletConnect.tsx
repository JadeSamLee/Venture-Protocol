import { useCallback, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useConnect, useDisconnect, useBalance, useEnsName, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Check, ChevronDown, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletConnectProps {
  isMobile?: boolean;
}

export function WalletConnect({ isMobile = false }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  
  // Network checking - adjust chainId as needed
  useEffect(() => {
    if (isConnected) {
      setIsWrongNetwork(chainId !== 1); // 1 is Ethereum mainnet
    }
  }, [chainId, isConnected]);

  // Connect to wallet
  const handleConnect = useCallback(() => {
    connect({ connector: injected() });
  }, [connect]);

  // Format address for display
  const formatAddress = (addr: string | undefined): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Wallet dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Wallet details modal toggle
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  // If not connected, show connect button
  if (!isConnected) {
    // Full width button for mobile menu
    if (isMobile) {
      return (
        <Button 
          onClick={handleConnect} 
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 border-2 border-amber-500/60 hover:border-amber-500 text-amber-500"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      );
    }
    
    // Regular button for navbar
    return (
      <Button 
        onClick={handleConnect} 
        variant="outline"
        size="sm"
        className="h-9 sm:h-10 px-3 flex items-center gap-2 text-xs sm:text-sm border-2 border-amber-500/60 hover:border-amber-500 text-amber-500"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  // If connected but wrong network
  if (isWrongNetwork) {
    if (isMobile) {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // Ethereum mainnet
          })}
          className="w-full flex items-center justify-center gap-2 border-2 border-destructive/60 hover:border-destructive text-destructive"
        >
          <span>Switch Network</span>
        </Button>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }], // Ethereum mainnet
        })}
        className="h-9 sm:h-10 px-3 border-2 border-destructive/60 hover:border-destructive text-destructive"
      >
        <span>Switch Network</span>
      </Button>
    );
  }

  // Connected state with dropdown
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between gap-2 py-2 px-3 border-2 border-green-500/60 hover:border-green-500 text-green-500"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{ensName || formatAddress(address)}</span>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
        
        {isDropdownOpen && (
          <div className="mt-1 rounded-md shadow-lg bg-background border">
            <div className="p-2 border-b">
              <p className="text-sm font-medium">{ensName || formatAddress(address)}</p>
              <p className="text-xs text-muted-foreground">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "Loading..."}
              </p>
            </div>
            <div className="py-1">
              <button
                onClick={toggleModal}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent rounded-md"
              >
                Wallet Details
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center rounded-md text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Disconnect
              </button>
            </div>
          </div>
        )}
        
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          title="Wallet Details"
        >
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ENS Name</p>
              <p className="text-sm">{ensName || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className="text-sm">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "Loading..."}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={toggleModal}>Close</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  // Connected state with dropdown (desktop)
  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDropdown}
          className="h-9 sm:h-10 px-3 flex items-center gap-2 text-xs sm:text-sm border-2 border-green-500/60 hover:border-green-500 text-green-500"
        >
          <Check className="h-4 w-4" />
          <span className="hidden xs:inline">
            {ensName || formatAddress(address)}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border z-50">
            <div className="p-2 border-b">
              <p className="text-sm font-medium">{ensName || formatAddress(address)}</p>
              <p className="text-xs text-muted-foreground">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "Loading..."}
              </p>
            </div>
            <div className="py-1">
              <button
                onClick={toggleModal}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent rounded-md"
              >
                Wallet Details
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center rounded-md text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title="Wallet Details"
      >
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="font-mono text-sm break-all">{address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ENS Name</p>
            <p className="text-sm">{ensName || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Balance</p>
            <p className="text-sm">
              {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "Loading..."}
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={toggleModal}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
} 