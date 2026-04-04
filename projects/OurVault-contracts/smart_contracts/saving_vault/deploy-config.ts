import 'dotenv/config';
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { SavingVaultFactory } from '../artifacts/saving_vault/SavingVaultClient'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying SavingVault ===')

  // const algorand = AlgorandClient.fromEnvironment()
  // const deployer = await algorand.account.fromEnvironment('DEPLOYER')
  const algorand = AlgorandClient.testNet()

  const deployer = algorand.account.fromMnemonic(process.env.DISPENSER_MNEMONIC!)

  const factory = algorand.client.getTypedAppFactory(SavingVaultFactory, {
    defaultSender: deployer.addr,
  })


console.log('\n', `Depolying ${factory.appName} Application...`,"n")


  const { appClient, result } = await factory.deploy({ onUpdate: 'append', onSchemaBreak: 'append' })

  // If app was just created fund the app account
  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    })
  }

  
  const {appId, appAddress, appName} = appClient
  console.table({
    ['name']: appName,
    ['id']: appId.toString(),
    ['address']: appAddress.toString(),
    ['deployer']: deployer.addr.toString(),
})
}