# Change Log

All notable changes to the Chameleon Escrow project will be documented in this file.

## [1.0.0-alpha.1] - 2025-??-??

- [x] The basic algorithm of interaction between three participants in the transaction: the supplier (seller), the recipient (buyer) and the arbitrator (guard) who will make decisions in favor of one of the parties if the parties have a dispute
- [x] Implementation of a Vault to secure a contract for managing a native token
- [x] Creation of TLB schemas for the contract
- [X] I think the `COMPLETED` status should be excluded from the process, it does not provide benefits, and the presence of two unambiguous `REFUNDED` and `CLAIMED` statuses for the protocol will be useful
- [X] Add a sequence diagram to [readme.md](readme.md), you will need to rework the [current diagram](docs/flow-draft-v1.puml) and take into account the current changes in the simpleton
- [ ] Implementation of an application for user interaction
- [ ] Add tests to cover the system operation via ASCII codes transmitted in comments of a regular wallet
- [ ] Need to rework the [current diagram](docs/flow-draft-v2.puml) in a format `mermaid`
- [ ] Use TLB schemas for codegen
- [ ] Add more detailed descriptions of the protocol to the documentation
- [ ] Add more detailed descriptions the interface for implementing Vault to manage assets of a different type to the documentation