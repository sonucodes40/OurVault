import { WalletProvider } from "@txnlab/use-wallet-react";
import { walletManager } from "./utils/walletConnect";
import Home from "./Home";


export default function App() {
  return (
      <WalletProvider manager={walletManager}>
        <Home />
      </WalletProvider>
  )
}
