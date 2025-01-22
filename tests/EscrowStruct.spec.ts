import '@ton/test-utils'
import { compile } from '@ton/blueprint'
import { Address, Contract, toNano } from '@ton/core'
import { Escrow } from '../wrappers/Escrow'
import { Vault } from '../wrappers/Vault'

function bocStat(boc: Buffer) {
  return {
    boc: boc.toString('base64'),
    bytes: Array.from(boc).length,
    bits: Array.from(boc).length * 8,
  }
}

function contractStat(contract: Contract) {
  return {
    // @ts-ignore
    data: bocStat(contract.init!.data.toBoc()),
    // @ts-ignore
    code: bocStat(contract.init!.code.toBoc()),
  }
}

describe('Escrow struct', () => {
  it('vault', async () => {
    const code = await compile('Vault')
    const vault = Vault.from(
      {
        deposit: toNano(1),
        owner: new Address(0, Buffer.from('3'.repeat(32))),
      },
      code,
    )
    const out = contractStat(vault)
    console.log(out)
    expect([out.data.bits, out.code.bits]).toEqual([440, 3136])
  })

  it('escrow', async () => {
    const code = await compile('Escrow')
    const escrow = Escrow.from(
      {
        seqno: 0,
        seller: new Address(0, Buffer.from('0'.repeat(32))),
        buyer: new Address(0, Buffer.from('1'.repeat(32))),
        guard: new Address(0, Buffer.from('2'.repeat(32))),
        description: 'ipfs://bafkreihqece535ceflazlh4d2bg26dis5gp4c2fivp5dutf4cieiy3kgda',
      },
      code,
    )
    const out = contractStat(escrow)
    console.log(out)
    expect([out.data.bits, out.code.bits]).toEqual([1736, 7520])
  })
})
