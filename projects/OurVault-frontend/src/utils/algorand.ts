import {
  AlgorandClient,
  microAlgos,
  algos,
} from "@algorandfoundation/algokit-utils"
import { SavingVaultClient } from "../contracts/SavingVault"

const APP_ID = 758294351n

// Common client setup
const getClient = (sender: string, signer: any) => {
  const algorand = AlgorandClient.testNet()

  // connect wallet signer
  algorand.setSigner(sender, signer)

  const appClient = algorand.client.getTypedAppClientById(
    SavingVaultClient,
    {
      appId: APP_ID,
      defaultSender: sender,
    }
  )

  return { algorand, appClient }
}

export const initUser = async (sender: string, signer: any) => {
  const { appClient } = getClient(sender, signer)

  const result = await appClient.send.initUser()
  return result
}

export const setGoal = async (
  sender: string,
  signer: any,
  goal: number,
  duration: number
) => {
  const { appClient } = getClient(sender, signer)

  const result = await appClient.send.setGoal({
    args: {
      goalAmount: BigInt(goal * 1_000_000), // ALGO → microAlgos
      deadlineDuration: BigInt(duration),   // seconds
    },
  })

  return result
}

export const depositAmount = async (
  sender: string,
  signer: any,
  amount: number
) => {
  const { algorand, appClient } = getClient(sender, signer)

  // Create payment txn
  const payTxn = await algorand.createTransaction.payment({
    sender,
    receiver: appClient.appAddress,
    amount: algos(amount), //  correct conversion
  })

  const result = await appClient.send.deposit({
    args: { payTxn },
    signer,
  })

  return result
}


export const withdrawMoney = async (
  sender: string,
  signer: any,
  amount: number
) => {
  const { appClient } = getClient(sender, signer)

  const result = await appClient.send.withdraw({
    args: {
      amount: BigInt(amount * 1_000_000),
    },
    coverAppCallInnerTransactionFees: true,
    maxFee: microAlgos(2000),
  })

  return result
}


//  GET USER DATA (BOX STORAGE)

export const userBalance = async (address: string) => {
  const algorand = AlgorandClient.testNet()

  const appClient = algorand.client.getTypedAppClientById(
    SavingVaultClient,
    {
      appId: APP_ID,
    }
  )
    const data = await appClient.state.box.depositors.value(address)
    if(!data){
        console.log("no data")
    }
    return {
      deposited: Number(data.deposited) / 1_000_000,
      goal: Number(data.goal) / 1_000_000,
      goalReached: Number(data.goalReached),
      totalSaving: Number(data.totalSaving) / 1_000_000,
      totalGoalsReached: Number(data.totalGoalsReached),
      deadline: Number(data.deadline),
    } 
  
}