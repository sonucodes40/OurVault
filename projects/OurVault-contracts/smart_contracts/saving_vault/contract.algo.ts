import { Contract } from '@algorandfoundation/algorand-typescript'

export class SavingVault extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
