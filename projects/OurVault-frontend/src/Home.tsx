import React, { useState } from 'react'
import { useWalletConnection } from './utils/walletConnect'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'


function Home() {
  const [address, setAddress] = useState<string | null>(null)
  return (
    <div>
      {address ? (
        <Dashboard address ={address} setAddress={setAddress} />
      ) : (
        <LandingPage setAddress = {setAddress} />
      )}
    </div>
  )
}

export default Home