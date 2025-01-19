import { Address, toNano } from '@ton/core'
import { Escrow } from '../wrappers/Escrow'
import { compile, NetworkProvider } from '@ton/blueprint'
import { Vault } from '../wrappers/Vault'

export async function run(provider: NetworkProvider) {
  const ui = provider.ui()
  const sender = provider.sender()
  const seller = sender.address ?? Address.parse(await ui.input('seller'))
  console.log({ seller })
  const seqno = Number(await ui.input('seqno'))
  const deposit = toNano(await ui.input('deposit'))
  const buyer = Address.parse(await ui.input('buyer'))
  const guard = Address.parse(await ui.input('guard'))
  const deadline = Number(await ui.input('deadline'))
  const description = await ui.input('description')
  const escrow = provider.open(
    Escrow.from(
      {
        seqno,
        guard,
        deadline,
        seller,
        buyer,
        description,
      },
      await compile('Escrow'),
    ),
  )
  await escrow.sendDeploy(provider.sender())
  await provider.waitForDeploy(escrow.address)
  const vault = provider.open(
    Vault.from(
      {
        deposit,
        owner: escrow.address,
      },
      await compile('Vault'),
    ),
  )
  await provider.waitForDeploy(vault.address)
  await escrow.sendBind(sender, {
    vault: vault.address,
  })
  console.log('escrow', escrow.address.toString())
  console.log('state', await escrow.getState())
}
