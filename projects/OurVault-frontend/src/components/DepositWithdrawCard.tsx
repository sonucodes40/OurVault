import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import clsx from "clsx";
import { depositAmount, userBalance, withdrawMoney } from "../utils/algorand";
import { useWalletConnection } from "../utils/walletConnect";

export default function DepositWithdraw() {
    const quickAmounts = [0.5, 1, 5, 10];
    const{activeAddress, transactionSigner} = useWalletConnection();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if(!amount || Number(amount)<= 0 || !activeAddress || !transactionSigner){
        alert("Please enter a valid amount"    
        )
        return;
    }
    try {
        setLoading(true);
        if(activeTab === "deposit"){
            console.log("Deposit clicked:", amount);
            // call deposit logic
           const res=  await depositAmount(activeAddress, transactionSigner, Number(amount));
           console.log("depost: ", res)
           window.location.reload();
        } else {
           console.log("Withdraw clicked:", amount);
           await withdrawMoney(activeAddress, transactionSigner, Number(amount))
           window.location.reload();
        }
    } catch (error) {
        console.log(error);
        alert('payment failed')
    } finally{
        setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-slate-800 bg-linear-to-br from-[#0f172a] to-[#020617] shadow-xl">
      
      {/* Tabs */}
      <div className="flex bg-[#020617] rounded-xl p-1 mb-20 border border-slate-800">
        <button
          onClick={() => setActiveTab("deposit")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition",
            activeTab === "deposit"
              ? "bg-cyan-600 text-white"
              : "text-slate-400"
          )}
        >
          <ArrowDown size={16} />
          Deposit
        </button>

        <button
          onClick={() => setActiveTab("withdraw")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition",
            activeTab === "withdraw"
              ? "bg-cyan-600 text-white"
              : "text-slate-400"
          )}
        >
          <ArrowUp size={16} />
          Withdraw
        </button>
      </div>

      {/* Label */}
      <p className="text-sm text-slate-400 mb-2 tracking-wide">
        {activeTab === "deposit" ? "DEPOSIT AMOUNT" : "WITHDRAW AMOUNT"}
      </p>

      {/* Input */}
      <div className="flex items-center justify-between bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 mb-24">
        <input
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent outline-none text-white text-lg w-full"
        />
        <span className="text-slate-400 text-sm">ALGO</span>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quickAmounts.map((val) => (
          <button
            key={val}
            onClick={() => setAmount(val.toString())}
            className="border border-slate-700 text-slate-300 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            {val}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <button
      onClick={handlePayment}
        className={clsx(
          "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition",
          activeTab === "deposit"
            ? "bg-cyan-600 hover:bg-cyan-500 text-white"
            : "bg-yellow-500 hover:bg-yellow-400 text-black"
        )}
      > {loading ? (
        <Loader2 className="animate-spin w-4 h-4"/>
      ): activeTab === "deposit" ? (
          <>
            <ArrowDown size={18} />
            Deposit ALGO
          </>
        ) : (
          <>
            <ArrowUp size={18} />
            Withdraw ALGO
          </>
        )}
      </button>
    </div>
  );
}