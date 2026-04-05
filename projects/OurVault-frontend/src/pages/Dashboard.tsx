import React, { useEffect, useState } from 'react'
import { useWalletConnection } from '../utils/walletConnect'
import TransactionHistoryUI from '../components/TranscationCard'
import DepositWithdraw from '../components/DepositWithdrawCard'
import { Card } from '../components/card'
import { Landmark, Sprout, Trophy, Vault, Wallet } from 'lucide-react'
import {initUser, setGoalb, userBalance } from '../utils/algorand'
import algosdk from 'algosdk'
import MilestoneCard from '../components/MilestoneProgress'
import GraphCard from '../components/Graph'
import { GoalCard } from '../components/goalcard'
import ProgressBar from '../components/ProgressBar'
import { AppState } from '@algorandfoundation/algokit-utils/types/app'

type UserData = {
    deposited: number;
    goal: number;
    goalReached: number;
    totalSaving: number;
    totalGoalsReached: number;
    deadline: number;
}
function Dashboard({ address, setAddress }: any) {
  const { disconnect, activeAddress, transactionSigner } = useWalletConnection()
  const [balance, setBalance] = useState<bigint | null>(null)
  const[userData, setUserData] = useState<UserData | null>(null)
  const [peraBalance, setPeraBalance] = useState<bigint | null>(null)

  const shortAddress = address.slice(0, 6) + '...' + address.slice(-4)

  const handleDisconnect = async () => {
    await disconnect()
    setAddress(null)
  }

  const [goal, setGoal] = useState(5)
  const [goalAmount, setGoalAmount] = useState<number>(goal)
  const [deadlineDays, setDeadlineDays] = useState<number | "">("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // goal logic
  const handleSaveGoal = async (goalValue: number, duration: number) => {
  if (!activeAddress || !transactionSigner) {
    alert("Connect wallet first");
    return;
  }

  try {
    await setGoalb(activeAddress, transactionSigner, goalValue, duration);

    alert("Goal + Deadline set 🎯");
    await fetchBalances();
  } catch (error) {
    console.error(error);
    alert("Error setting goal");
  }
};
// initialize account
  const initialize = async () => {
    if (!activeAddress) return
    try {
        await initUser(activeAddress, transactionSigner);
        alert("initialize done")
    } catch (error) {
        console.log(error)
    }
  }
  const fetchBalances = async () => {
  if (!activeAddress) return

  try {
    const data = await userBalance(activeAddress)

    console.log('User data:', data)

    setUserData(data)
    setBalance(data ? BigInt(data.deposited * 1_000_000) : 0n)

  } catch (error) {
    console.error('Error fetching balance: ', error)
    setUserData(null)
  }
}

  useEffect(() => {
    fetchBalances()
  }, [activeAddress])

  const fetchBalancespera = async () => {
    if (!activeAddress) {
      alert('connect wallet first')
      return
    }
    try {
      const client = new algosdk.Algodv2(
        '',
        'https://testnet-api.algonode.cloud',
        ''
      )
      const res = await client.accountInformation(activeAddress).do()
      console.log('User balance pera:', res)
      setPeraBalance(res.amount ?? 0n)
    } catch (error) {
      console.error('Error fetching balance: ', error)
    }
  }

  useEffect(() => {
    fetchBalancespera()
  }, [activeAddress])

  return (
    <div className="min-h-screen bg-gray-900 pl-20 pr-20 pb-10">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600">
            <Vault size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">OurVault</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <h2 className="text-xl text-white font-bold">Dashboard</h2>
        
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
          <p className="text-white text-sm">{shortAddress}</p>
          <button
            onClick={initialize}
            className="bg-cyan-600 text-white px-4 py-2 rounded-xl"
          >
            Inatalize
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-cyan-600 text-white px-4 py-2 rounded-xl"
          >
            Disconnect Wallet
          </button>
        </div>
      </nav>

      {/* ── Row 1: 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card
          title="Vault Balance"
          value={balance ? (Number(balance) / 1000000).toFixed(6) : '0'}
          subtitle="Vault saving"
          icon={<Landmark size={20} />}
        />
        <Card
          title="Wallet Balance"
          value={peraBalance ? (Number(peraBalance) / 1000000).toFixed(6) : '0'}
          subtitle="Vault saving"
          icon={<Wallet size={20} />}
        />
        
        <ProgressBar currentCount={userData?.deposited ||0} totalCount={ userData?.goal} />

        <GoalCard
          title="Goal"
          value={`${userData?.goal} ALGO`}
          subtitle=""
          icon={<Sprout size={20} />}
          onEditClick={() => setIsModalOpen(true)}
          deadline={userData?.deadline}
          goal={userData?.goal}
          goalReached={userData?.goalReached}
        />
      </div>

      {/* ── Row 2: Milestone Progress + Deposit/Withdraw ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <MilestoneCard />
        <DepositWithdraw />
      </div>

      {/* ── Row 3: Graph ── */}
      <div className="mt-6">
        <GraphCard />
      </div>

      {/* ── Row 4: Transaction History ── */}
      <div className="mt-6 mb-10">
        <TransactionHistoryUI />
      </div>

      {/* ── Goal Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal box */}
          <div className="relative bg-[#020617] p-6 rounded-2xl border border-slate-800 w-80">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-white">Set Goal</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Input */}
            {/* Amount */}
            <label className="text-white">Amount:</label>
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white mb-4"
            />

            {/* Deadline */}
            <label className="text-white">Deadline in Days:</label>
            <input
              type="number"
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(Number(e.target.value))}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white mb-4"
            />

            {/* Save */}
            <button
              onClick={() => {
                if (!goalAmount || !deadlineDays) {
                  alert("Fill all fields")
                  return
                }

                const deadlineInSeconds = deadlineDays * 24 * 60 * 60

                handleSaveGoal(goalAmount, deadlineInSeconds)
                setGoal(goalAmount) // optional (for UI sync)
                setIsModalOpen(false)
              }}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400"
            >
              Save Goal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
