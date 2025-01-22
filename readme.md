# Chameleon Escrow

**Chameleon Escrow** a system separating guarantee logic from asset management across diverse value forms

## Overview

Chameleon Escrow is an escrow solution that separates the guarantee logic from the asset custody mechanism, this modularity allows it to work with different types of assets — tokens, digital assets or other transferable values without changing the underlying `Escrow` contract, interoperating with different `Vault` implementations, the same escrow structure can easily handle multiple forms of value.

<p align="center">
    <img alt="diagram flow" src="https://www.plantuml.com/plantuml/svg/fPLHJzim58NV_IkkseUz36X1soXI9-esYJf1YL8epoQvj16kdSKEXVtwEOuttAYP4Ej3rTnxVFpTOwkvL9gLkjfoyccZTQ4kJauApaHTEKxbzaJXpmf5YaTPpjObsnAYKiOHHby7iCiplI7gAHS5CorG6vR9NIxMyCYuGkArCdna5TUX57h1jWYzERs6cECBB9bGds4XjNG_LrXcJB3UuTNB_1V2y8lNf2nzMfUo4jbKSbb2F_mMZaBgAM8pOPxcXHahPbbM0vuEV0VvygS-zEj_nOIbsZWlaNCitKDKiJ8Zv46-GEzsWt1Je805wfqidthG7mn6vy6456zRm_qIc89UuzBRRqMsPJrx99L6aUfS2WM1IakvsokjwYpsbrExd5QljJ6A30mMSQ2sIiXu33Cik7nrbZ0U4rPfAQhj0vOmF1wIXWoEZhuRrWjeGdWq5Ww26O1dfj5qYHd6o9h61MJMsHKjdrVpXG-vWTlbUkEcoD0thI73d7CJ-c7AKqDPp-CWgG-vbG9VFKPAxgc7eqmiJcChFfL23KepNQcQMgfSOqOSWDidtJ2nnZrUQdaJL98_eyzhpFl3oNGKXZ2zciol2PYFDyMPcQ8kjVEkj88uICARn2tnegcVwoXRr4uUp1o_rJaKv-lGRQSLTnV4BBYQhuBalH1E_XyG_fawXaaS9pUheCL06mRQPd3oRWJQYK0xSt2drv522y1g3-t_TWSzFri0jvTtDG_aWrmXz4zdvsV1598Wl5lC3boehXXdysLyT_lk69tyup7Qlx166pc49FWHJ6zR15534BK9dBgR8EeaYBhkaikzAuBs_dN27pX8-i-3fCJq2Baqt_NBzZS0"/>
</p>

## Key Features

TBD

## How It Works

TBD

## How It Uses

TBD

## Life circle contract/account

```mermaid
stateDiagram
    classDef success fill:#EBF9E7
    classDef info fill:#F0FBFF
    classDef warning fill:#FFFCEA
    classDef danger fill:#FFF0F0

    class ACTIVE success
    class NONEXISTENT info
    class UNINIT warning
    class FROZEN danger

    [*] --> NONEXISTENT
    NONEXISTENT --> UNINIT : send value
    note left of UNINIT    : initial state of the account
    UNINIT --> ACTIVE      : initialize
    ACTIVE --> FROZEN      : due payment
    note left of FROZEN    : unfreeze message only
    FROZEN --> ACTIVE      : unfreeze
    FROZEN --> UNINIT      : unfreeze
    FROZEN --> NONEXISTENT : delete
```

## Escrow contract

```mermaid
stateDiagram
    classDef success fill:#EBF9E7
    classDef info fill:#F0FBFF
    classDef warning fill:#FFFCEA
    classDef danger fill:#FFF0F0

    class DRAFT info
    class PROPOSED success
    class DEPOSITED success
    class PERFORMED success
    class DELIVERED success
    class APPROVED success
    class CLAIMED success
    class DISPUTED warning
    class REJECTED danger
    class REFUNDED danger
    class deadline info

    state "⏳" as deadline

    [*] --> DRAFT
    DRAFT --> PROPOSED      : bind with Vault **Buyer**
    PROPOSED --> DEPOSITED  : deposit <= input from **Vault**

    DEPOSITED --> DISPUTED  : dispute **Buyer**
    DEPOSITED --> PERFORMED : perform **Seller**

    PERFORMED --> deadline  : deadline
    deadline --> DISPUTED   : dispute **Buyer**
    PERFORMED --> DELIVERED : dispute **Seller**

    DELIVERED --> DISPUTED  : dispute **Buyer**
    DELIVERED --> DISPUTED  : dispute **Seller**
    DELIVERED --> APPROVED  : approve **Buyer**

    DISPUTED --> REJECTED   : reject **Guard**
    DISPUTED --> PERFORMED  : perform **Guard**

    REJECTED --> REFUNDED   : claim **Buyer**
    APPROVED --> CLAIMED    : claim **Seller**

    REFUNDED --> [*]        : claim => output to **Vault**
    CLAIMED --> [*]         : claim => output to **Vault**
```

## Vault contract

```mermaid
stateDiagram
    [*] --> FILLED   : deposit => output to **Escrow**
    FILLED --> EMPTY : claim <= input from **Escrow**
    EMPTY --> [*]
```
