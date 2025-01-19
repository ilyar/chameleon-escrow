import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/core'

export type VaultConfig = {
  amount: bigint
  owner: Address
}

export function vaultState(config: VaultConfig): Cell {
  return beginCell().storeCoins(config.amount).storeAddress(config.owner).endCell()
}

export class Vault implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static from(config: VaultConfig, code: Cell, workchain = 0) {
    const data = vaultState(config)
    const init = { code, data }
    return new Vault(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value = toNano('0.01')) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async getBalance(provider: ContractProvider): Promise<bigint> {
    return (await provider.getState()).balance
  }

  async getState(provider: ContractProvider) {
    const result = await provider.get('get_state', [])
    const deposit = result.stack.readBigNumber()
    const owner = result.stack.readAddress()
    return {
      deposit,
      owner,
    }
  }
}
