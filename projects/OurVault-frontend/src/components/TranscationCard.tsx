import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import algosdk from "algosdk";
import { useWalletConnection } from "../utils/walletConnect";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  time: string;
  address: string;
  balance: number;
};

export default function TransactionHistory() {
  const APP_ID = 758061793n
  const [history, setHistory] = useState<any[]>([])
  const { activeAddress } = useWalletConnection()
  const appAddress = algosdk.getApplicationAddress(APP_ID);

  const fetchHistory = async () => {
    if (!activeAddress) {
      alert("Wallet not connected")
      return
    }

    try {
      const algorand = AlgorandClient.testNet()

      const txns = await algorand.client.indexer
        .lookupAccountTransactions(activeAddress).limit(100)
        .do()

      const transactions = txns.transactions ?? []
      const result: any = []

      transactions.forEach((txn) => {
        const time = txn.roundTime
          ? new Date((txn.roundTime) * 1000).toLocaleString()
          : "N/A"

        // Deposit
        if (txn['txType'] === 'pay' && txn.sender === activeAddress) {
          result.push({
            type: 'Deposit',
            sender: txn.sender,
            receiver: txn.paymentTransaction?.receiver,
            time: time,
            txId: txn.id,
            amount: Number(txn.paymentTransaction?.amount || 0) / 1e6,
          })
        }

        // Withdraw
        if (txn['innerTxns']) {
          txn['innerTxns'].forEach((inner) => {
            if (
              inner['txType'] === 'pay' &&
              inner.paymentTransaction?.receiver === activeAddress
            ) {
              const innerTime = inner.roundTime
                ? new Date(inner.roundTime * 1000).toLocaleString()
                : "N/A"
              result.push({
                type: 'Withdraw',
                sender: appAddress,
                receiver: activeAddress,
                time: innerTime,
                txId: txn.id,
                amount: Number(inner.paymentTransaction?.amount || 0) / 1e6,
              })
            }
          })
        }
      })

      const latest10 = result
        .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10)

      setHistory(latest10)
      console.log("result", latest10)

    } catch (error) {
      console.error("fetching transaction", error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [activeAddress])

  return (
    <div className="bg-linear-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-slate-800 shadow-xl w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg font-semibold">
          Transaction History
        </h2>
      </div>

      {/* Scrollbar styles */}
      <style>{`
        .tx-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .tx-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tx-scroll::-webkit-scrollbar-thumb {
          background: #1e3a4a;
          border-radius: 999px;
        }
        .tx-scroll::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>

      {/* List */}
      <div className="tx-scroll space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {history.map((tx) => {
          const isDeposit = tx.type === "Deposit";

          return (
            <div
              key={tx.txId}
              className="flex items-center justify-between bg-[#020617] border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
            >
              {/* Left */}
              <div className="flex items-center gap-4">

                {/* Icon */}
                <div
                  className={clsx(
                    "w-10 h-10 flex items-center justify-center rounded-full",
                    isDeposit
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  )}
                >
                  {isDeposit ? (
                    <ArrowDownLeft size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </div>

                {/* Info */}
                <div>
                  <p
                    className={clsx(
                      "font-medium",
                      isDeposit ? "text-cyan-400" : "text-yellow-400"
                    )}
                  >
                    {isDeposit ? "Deposit" : "Withdraw"}{" "}
                    <span className="text-slate-400 text-sm">
                      {tx.time}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500">
                    {tx.address}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p
                  className={clsx(
                    "font-semibold",
                    isDeposit ? "text-cyan-400" : "text-yellow-400"
                  )}
                >
                  {isDeposit ? "+" : "-"}
                  {tx.amount}
                </p>

                <p className="text-xs text-slate-500">
                  ALGO
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}