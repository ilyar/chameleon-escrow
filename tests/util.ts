import { ContractProvider, fromNano } from '@ton/core'
interface Balanced {
  getBalance(): Promise<bigint>
}

export async function spend(prev: bigint, actor: Balanced, fractionDigits = 4) {
  return Number(fromNano(prev - (await actor.getBalance()))).toFixed(fractionDigits)
}
