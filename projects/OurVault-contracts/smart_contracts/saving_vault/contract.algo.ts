
import {
  abimethod,
  Account,
  assert,
  BoxMap,
  clone,
  Contract,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  Uint64,
  uint64,
} from '@algorandfoundation/algorand-typescript'

type UserData = {
  deposited: uint64
  goal: uint64
  goalReached: uint64
  totalSaving: uint64
  totalGoalsReached: uint64
  deadline: uint64
}

export class SavingVault extends Contract {
  depositors = BoxMap<Account, UserData>({ keyPrefix: 'dep' })
  penaltyPercent = GlobalState<uint64>({ initialValue: Uint64(10), key: 'penalty' })

  @abimethod()
  public initUser(): void {
    assert(!this.depositors(Txn.sender).exists, 'User already initialized')
    const initial: UserData = {
      deposited: Uint64(0),
      goal: Uint64(0),
      goalReached: Uint64(0),
      totalSaving: Uint64(0),
      totalGoalsReached: Uint64(0),
      deadline: Uint64(0),
    }
    this.depositors(Txn.sender).value = clone(initial)  
  }

  @abimethod()
  public setGoal(goalAmount: uint64, deadlineDuration: uint64): void {
    assert(this.depositors(Txn.sender).exists, 'User not initialized')
    assert(goalAmount > Uint64(0), 'Goal must be greater than zero')

    const userData = clone(this.depositors(Txn.sender).value)  
    assert(userData.goal === Uint64(0), 'Goal already set')

    const deadline: uint64 = Global.latestTimestamp + deadlineDuration
    this.depositors(Txn.sender).value = {
      deposited: userData.deposited,
      goal: goalAmount,
      goalReached: Uint64(0),
      totalSaving: userData.totalSaving,
      totalGoalsReached: userData.totalGoalsReached,
      deadline: deadline,
    }
  }

  @abimethod()
  public deposit(payTxn: gtxn.PaymentTxn): uint64 {
    assert(payTxn.receiver === Global.currentApplicationAddress, 'Receiver must be the contract address')
    assert(payTxn.amount > Uint64(0), 'Deposit amount must be greater than zero')
    assert(this.depositors(Txn.sender).exists, 'User not initialized')

    const depositAmount: uint64 = payTxn.amount
    const userData = clone(this.depositors(Txn.sender).value)  
    assert(userData.goal > Uint64(0), 'Set a saving goal before depositing')

    const newTotal: uint64 = userData.deposited + depositAmount
    const newTotalSaving: uint64 = userData.totalSaving + depositAmount

    let newGoalReached: uint64 = userData.goalReached
    let newTotalGoalsReached: uint64 = userData.totalGoalsReached
    let newGoal: uint64 = userData.goal
    let newDeadline: uint64 = userData.deadline

    if (newTotal >= userData.goal && userData.goalReached === Uint64(0)) {
      newGoalReached = Uint64(1)
      newTotalGoalsReached = userData.totalGoalsReached + Uint64(1)
      newGoal = Uint64(0)
      newDeadline = Uint64(0)
    }

    this.depositors(Txn.sender).value = {
      deposited: newTotal,
      goal: newGoal,
      goalReached: newGoalReached,
      totalSaving: newTotalSaving,
      totalGoalsReached: newTotalGoalsReached,
      deadline: newDeadline,
    }

    return newTotalGoalsReached
  }

  @abimethod()
  public withdraw(amount: uint64): uint64 {
    assert(this.depositors(Txn.sender).exists, 'User not initialized')
    const userData = clone(this.depositors(Txn.sender).value)  
    assert(userData.deposited > Uint64(0), 'No deposits found for this account')
    assert(amount > Uint64(0), 'Amount must be greater than zero')
    assert(amount <= userData.deposited, 'Amount greater than the deposited amount')

    let payout: uint64 = amount
    if (
      userData.goal > Uint64(0) &&
      userData.goalReached === Uint64(0) &&
      Global.latestTimestamp > userData.deadline &&
      userData.deadline > Uint64(0)
    ) {
      const penalty: uint64 = (amount * this.penaltyPercent.value) / Uint64(100)
      payout = amount - penalty
    }

    const result = itxn
      .payment({
        receiver: Txn.sender,
        amount: payout,
        fee: Uint64(0),
      })
      .submit()

    const remaining: uint64 = userData.deposited - amount

    let newGoalReached: uint64 = userData.goalReached
    if (remaining < userData.goal) {
      newGoalReached = Uint64(0)
    } 

    this.depositors(Txn.sender).value = {
      deposited: remaining,
      goal: userData.goal,
      goalReached: newGoalReached,
      totalSaving: userData.totalSaving,
      totalGoalsReached: userData.totalGoalsReached,
      deadline: userData.deadline,
    }

    return result.amount
  }
}