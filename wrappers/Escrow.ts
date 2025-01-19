import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Dictionary,
  Sender,
  SendMode,
  toNano,
} from '@ton/core'

export const ACTION_VALUE = toNano(0.02)

export enum Status {
  draft = 0,
  proposed = 1,
  deposited = 2,
  performed = 3,
  delivered = 4,
  approved = 5,
  claimed = 6,
  disputed = 7,
  rejected = 8,
  refunded = 9,
  completed = 10,
}

export enum Action {
  send = 0x0,
  bind = 0x42494e44, // BIND
  deposit = 0x44455053, // DEPS
  perform = 0x50455246, // PERF
  deliver = 0x444c5652, // DLVR
  approve = 0x41505256, // APRV
  claim = 0x434c494d, // CLIM
  dispute = 0x44535054, // DSPT
  settle = 0x5354544c, // STTL
  reject = 0x524a4354, // RJCT
  tick = 0x5449434b, // TICK
}

export enum Actor {
  seller = 0x0,
  buyer = 0x1,
  guard = 0x2,
  vault = 0x3,
}

export type EscrowConfig = {
  seqno: number
  seller: Address
  buyer: Address
  guard: Address
  deadline?: number
  description?: string
}

export function escrowState(config: EscrowConfig): Cell {
  const cast = Dictionary.empty(Dictionary.Keys.Uint(2), Dictionary.Values.Address())
  cast.set(Actor.seller, config.seller)
  cast.set(Actor.buyer, config.buyer)
  cast.set(Actor.guard, config.guard)
  return beginCell()
    .storeUint(config.seqno, 32)
    .storeUint(0, 4) // status
    .storeUint(0, 32) // started_at
    .storeUint(config.deadline ?? 24 * 3600, 22)
    .storeStringRefTail(config.description ?? '')
    .storeDict(cast)
    .endCell()
}

export class Escrow implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new Escrow(address)
  }

  static from(config: EscrowConfig, code: Cell, workchain = 0) {
    const data = escrowState(config)
    const init = { code, data }
    return new Escrow(contractAddress(workchain, init), init)
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

  async sendBind(
    provider: ContractProvider,
    via: Sender,
    prop: {
      vault: Address
      value?: bigint
      queryID?: number
    },
  ) {
    await provider.internal(via, {
      value: prop.value ?? ACTION_VALUE,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Action.bind, 32)
        .storeUint(prop.queryID ?? 0, 64)
        .storeAddress(prop.vault)
        .endCell(),
    })
  }

  async sendAction(
    provider: ContractProvider,
    via: Sender,
    prop: {
      opcode: number
      value?: bigint
      queryID?: number
    },
  ) {
    await provider.internal(via, {
      value: prop.value ?? ACTION_VALUE,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(prop.opcode, 32)
        .storeUint(prop.queryID ?? 0, 64)
        .endCell(),
    })
  }

  async getState(provider: ContractProvider) {
    const result = await provider.get('get_state', [])
    const seqno = result.stack.readNumber()
    const status = Status[result.stack.readNumber()]
    const startedAt = result.stack.readNumber()
    const deadline = result.stack.readNumber()
    const description = result.stack.readString()
    const dict: Dictionary<bigint, Address> = Dictionary.loadDirect(
      Dictionary.Keys.BigUint(2),
      Dictionary.Values.Address(),
      result.stack.readCell(),
    )
    const cast: Record<string, Address> = {}
    for (let key of dict.keys()) {
      const actorName = Actor[Number(key)]
      const address = dict.get(key)
      if (actorName !== undefined && address) {
        cast[actorName] = address
      }
    }
    return {
      seqno,
      status,
      startedAt,
      deadline,
      description,
      ...cast,
    }
  }
}
