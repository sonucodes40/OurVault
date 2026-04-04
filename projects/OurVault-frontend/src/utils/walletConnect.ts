import { NetworkId, useWallet, WalletId, WalletManager } from '@txnlab/use-wallet-react'

export const walletManager = new WalletManager({
  wallets: [WalletId.PERA],
  defaultNetwork: NetworkId.TESTNET,
})

export function useWalletConnection() {
  const { wallets, activeAddress, activeWallet, transactionSigner } = useWallet()

  const connect = async (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) await wallet.connect()
  }

  const disconnect = async () => {
    await activeWallet?.disconnect()
  }

  return {
    activeAddress,
    transactionSigner,
    connect,
    disconnect,
    wallets,
  }
}