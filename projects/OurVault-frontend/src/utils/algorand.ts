import { AlgorandClient, microAlgos } from "@algorandfoundation/algokit-utils"
import { SavingVaultClient } from "../contracts/SavingVaultClient"

const APP_ID = 758061793n
export const depositAmount = async (sender: string, signer: any, amount: Number) => {
  const algorand = AlgorandClient.testNet()
  const appClient = algorand.client.getTypedAppClientById(SavingVaultClient, {
    appId: APP_ID,
    defaultSender: sender,
  })

  const payTxn = await algorand.createTransaction.payment({
    sender: sender,
    receiver: appClient.appAddress,
    amount: Number(amount).algo(),
  })

  const result = await appClient.send.deposit({
    args: { payTxn },
    signer,
  })
  return result
}
// WithDraw
export const withdrawMoney = async (sender: string, signer: any, amount: number) => {
  const algorand = AlgorandClient.testNet()
  algorand.setSigner(sender, signer)
  const appClient = algorand.client.getTypedAppClientById(SavingVaultClient, {
    appId: APP_ID,
    defaultSender: sender,
  })
 
  const result = await appClient.send.withdraw({
    args: {amount: BigInt(amount * 1000000)},
    coverAppCallInnerTransactionFees: true,
    maxFee: microAlgos(2000),
  })
  return result
}

export const userBalance = async (activeAddress: string) => {
  const algorand = AlgorandClient.testNet()

  const appclient = algorand.client.getTypedAppClientById(SavingVaultClient, {
    appId: APP_ID,
  })

  const deposited = await appclient.state.box.depositors.value(activeAddress)
  return deposited
}