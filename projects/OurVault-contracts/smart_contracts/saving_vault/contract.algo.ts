import { 
    abimethod,
    assert,
    Contract,
    Global,
    GlobalState, 
     gtxn, 
     itxn, 
     LocalState, 
     Txn, 
     Uint64, 
     uint64 } from '@algorandfoundation/algorand-typescript'

export class SavingVault extends Contract {
  deposited =    LocalState<uint64>({ key: "dep"}) // total saved
  goal =         LocalState<uint64>({ key: "goal"})
  goalReached =  LocalState<uint64>({ key: "done"}) // 1 if goal reached, 0 otherwise
  // depositCount = LocalState<uint64>({ key: 'cnt'}) // deposite count (history)
  totalSaving =  LocalState<uint64>({ key: "totalS"})
  penaltyPercent = GlobalState<uint64>({ initialValue:Uint64(10), key: "penalty"})
  totalGoalsReached = LocalState<uint64>({key: "goalreached"})
  deadline = LocalState<uint64>({key: "dl"})

  
  @abimethod({allowActions: 'OptIn'})
  public optIn(): void {
    this.deposited(Txn.sender).value = Uint64(0)
    this.goal(Txn.sender).value = Uint64(0)
    this.goalReached(Txn.sender).value = Uint64(0)
    this.totalSaving(Txn.sender).value = Uint64(0)
    this.totalGoalsReached(Txn.sender).value   = Uint64(0) 
  }
  @abimethod()
  public setGoal(goalAmount: uint64, deadlin: uint64): void{
    assert(goalAmount > Uint64(0), "Goal must be greater than zero")
    assert(this.goal(Txn.sender).value === Uint64(0), "Goal already set")
    this.goalReached(Txn.sender).value = Uint64(0)
    this.goal(Txn.sender).value = goalAmount
    const deadline: uint64 = Global.latestTimestamp + deadlin
    this.deadline(Txn.sender).value = deadline
  }
 

  @abimethod()
  public deposit(payTxn: gtxn.PaymentTxn): uint64{
   assert(payTxn.receiver === Global.currentApplicationAddress, "Receiver must be the contract address")
   assert(payTxn.amount > Uint64(0), "Deposit amount must be greater than zero")
   assert(this.goal(Txn.sender). value > Uint64(0), "set a saving goal before depositing")

   const depositAmount: uint64 = payTxn.amount
   const newTotal: uint64 = this.deposited(Txn.sender).value + depositAmount
   const userGoal: uint64 = this.goal(Txn.sender).value

   this.deposited(Txn.sender).value = newTotal
   this.totalSaving(Txn.sender).value =this.totalSaving(Txn.sender).value + depositAmount
   if (newTotal >= userGoal && this.goalReached(Txn.sender).value === Uint64(0)) {
      this.goalReached(Txn.sender).value = Uint64(1)
      this.totalGoalsReached(Txn.sender).value = this.totalGoalsReached(Txn.sender).value + Uint64(1)
      this.goal(Txn.sender).value = Uint64(0)
      this.deadline(Txn.sender).value = Uint64(0)
    }
  return this.totalGoalsReached(Txn.sender).value
  }
// withdraw
  @abimethod()
  public withdraw(amount: uint64): uint64 {
    const depositedAmount = this.deposited(Txn.sender).value
    assert(depositedAmount > 0, "No deposits found for this accout")
    assert(amount > 0, "amount must be greather than zero")
    assert(amount <= depositedAmount, "amount greather than the deposited amount")
    
    // send payout to user
    const result = itxn
      .payment({
        receiver: Txn.sender,
        amount: amount,
        fee: Uint64(0),
      })
      .submit()
    const remaining: uint64 = depositedAmount - amount;
    this.deposited(Txn.sender).value = remaining;

    if(remaining < this.goal(Txn.sender).value){
      this.goalReached(Txn.sender).value = Uint64(0);
    }
    return result.amount
  }
}
