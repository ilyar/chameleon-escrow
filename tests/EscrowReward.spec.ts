import { compile } from '@ton/blueprint'
import '@ton/test-utils'
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { Cell, fromNano, toNano } from '@ton/core'
import { Action, ACTION_VALUE, Escrow, Status } from '../wrappers/Escrow'
import { Vault } from '../wrappers/Vault'

const DEPOSIT = toNano(10)

describe('Escrow Reward', () => {
  let escrowCode: Cell
  let vaultCode: Cell
  let blockchain: Blockchain
  let seller: SandboxContract<TreasuryContract>
  let buyer: SandboxContract<TreasuryContract>
  let buyerBalance = 0n
  let guard: SandboxContract<TreasuryContract>
  let escrow: SandboxContract<Escrow>
  let vault: SandboxContract<Vault>

  async function printBalance(info: string) {
    console.log(info, {
      seller: Number(fromNano(await seller.getBalance())),
      buyer: Number(fromNano(await buyer.getBalance())),
      guard: Number(fromNano(await guard.getBalance())),
      escrow: Number(fromNano(await escrow.getBalance())),
      vault: Number(fromNano(await vault.getBalance())),
    })
  }

  async function sumBalance() {
    return (
      Number(fromNano(await seller.getBalance())) +
      Number(fromNano(await buyer.getBalance())) +
      Number(fromNano(await guard.getBalance())) +
      Number(fromNano(await escrow.getBalance())) +
      Number(fromNano(await vault.getBalance()))
    )
  }
  async function diffBalance() {
    return Number(1000000 * 3 - (await sumBalance())).toFixed(3)
  }

  beforeAll(async () => {
    escrowCode = await compile('Escrow')
    vaultCode = await compile('Vault')
    blockchain = await Blockchain.create()

    seller = await blockchain.treasury('seller1')
    buyer = await blockchain.treasury('buyer1')
    guard = await blockchain.treasury('guard1')

    escrow = blockchain.openContract(
      Escrow.from(
        {
          seqno: 1,
          seller: seller.address,
          buyer: buyer.address,
          guard: guard.address,
          deadline: 0,
          description: 'ipfs://bafkreihqece535ceflazlh4d2bg26dis5gp4c2fivp5dutf4cieiy3kgda',
        },
        escrowCode,
      ),
    )
    const escrowResult = await escrow.sendDeploy(seller.getSender())
    expect(escrowResult.transactions).toHaveTransaction({
      from: seller.address,
      to: escrow.address,
      deploy: true,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.draft])

    vault = blockchain.openContract(
      Vault.from(
        {
          amount: DEPOSIT,
          owner: escrow.address,
        },
        vaultCode,
      ),
    )
    const vaultResult = await vault.sendDeploy(seller.getSender())
    expect(vaultResult.transactions).toHaveTransaction({
      from: seller.address,
      to: vault.address,
      deploy: true,
      success: true,
    })
    await printBalance('deploy')

    const bindResult = await escrow.sendBind(seller.getSender(), {
      vault: vault.address,
    })
    expect(bindResult.transactions).toHaveTransaction({
      from: seller.address,
      to: escrow.address,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.proposed])
    const escrowState = await escrow.getState()
    expect(JSON.stringify(escrowState)).toEqual(
      JSON.stringify({
        seqno: 1,
        status: 'proposed',
        startedAt: 0,
        deadline: 0,
        description: 'ipfs://bafkreihqece535ceflazlh4d2bg26dis5gp4c2fivp5dutf4cieiy3kgda',
        seller: seller.address,
        buyer: buyer.address,
        guard: guard.address,
        vault: vault.address,
      }),
    )
    const vaultState = await vault.getState()
    expect(vaultState.deposit).toEqual(DEPOSIT)
    expect(vaultState.owner.toRawString()).toEqual(escrow.address.toRawString())
    expect((await escrow.getState()).status).toEqual(Status[Status.proposed])
    const depositResult = await buyer.send({
      to: vault.address,
      value: DEPOSIT + ACTION_VALUE,
    })
    expect(depositResult.transactions).toHaveTransaction({
      from: buyer.address,
      to: vault.address,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.deposited])
    await printBalance('deposit')
    buyerBalance = await buyer.getBalance()
  })

  it('Case reward success', async () => {
    // Try to get reward
    const claimTryResult = await escrow.sendAction(buyer.getSender(), {
      opcode: Action.claim,
    })
    expect(claimTryResult.transactions).toHaveTransaction({
      from: buyer.address,
      to: escrow.address,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.deposited])
    // disputed
    const performResult = await escrow.sendAction(buyer.getSender(), {
      opcode: Action.dispute,
    })
    expect(performResult.transactions).toHaveTransaction({
      from: buyer.address,
      to: escrow.address,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.disputed])
    // rejected
    const disputeResult = await escrow.sendAction(guard.getSender(), {
      opcode: Action.reject,
    })
    expect(disputeResult.transactions).toHaveTransaction({
      from: guard.address,
      to: escrow.address,
      success: true,
    })
    expect((await escrow.getState()).status).toEqual(Status[Status.rejected])
    // claim
    const claimResult = await escrow.sendAction(buyer.getSender(), {
      opcode: Action.claim,
    })
    expect(claimResult.transactions).toHaveTransaction({
      from: buyer.address,
      to: escrow.address,
      success: true,
    })
    await printBalance('refunded')
    expect((await escrow.getState()).status).toEqual(Status[Status.refunded])
    expect(await escrow.getBalance()).toEqual(0n)
    expect(await vault.getBalance()).toEqual(0n)
    expect(Math.round(Number(fromNano(await buyer.getBalance())))).toBeGreaterThanOrEqual(
      parseInt(fromNano(buyerBalance + DEPOSIT)),
    )
    expect(await diffBalance()).toEqual('0.051')
  })
})
