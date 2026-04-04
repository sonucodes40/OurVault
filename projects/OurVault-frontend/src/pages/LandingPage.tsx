import React, { useEffect, useState } from 'react'
import { useWalletConnection } from '../utils/walletConnect'
import { Wallet } from 'lucide-react';

function LandingPage({ setAddress}: any) {
   const { wallets, connect, activeAddress } = useWalletConnection();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (wallets.length > 0) {
      try {
        setConnecting(true);
        await connect(wallets[0].id);
      } catch (error) {
        console.error(error);
        setConnecting(false);
      }
    }
  };

  useEffect(() => {
    if (activeAddress) {
      setAddress(activeAddress);
      setConnecting(false);
      setConnected(true);
    }
  }, [activeAddress]);
  return (
    <div className='text-xl fond-bold text-cyan-600'>
      Landing page
       <button
          onClick={handleConnect}
          disabled={connecting || connected}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-60"
        >
          <Wallet size={15} />
          {connected ? "Connected ✓" : connecting ? "Connecting..." : "Connect Wallet"}
        </button>
    </div>
  )
}

export default LandingPage
