import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import {
  OverlayV1OVLCollateral,
  ApprovalForAll,
  Build,
  Liquidate,
  TransferBatch,
  TransferSingle,
  URI,
  Unwind,
  Update,
} from "../generated/OverlayV1OVLCollateral/OverlayV1OVLCollateral"
import {
  OverlayV1UniswapV3Market,
  FundingPaid,
  NewPrice
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import { 
  CollateralManager
} from "../generated/schema"

import {
  constants,
  events,
  integers,
  transactions,
} from '@amxx/graphprotocol-utils';

function getCollateralManager(address: Address): CollateralManager {

  let collateralId = address.toHex()

  let collateralManager = CollateralManager.load(collateralId)

  if (collateralManager == null) {

    collateralManager = new CollateralManager(collateralId)
    collateralManager.address = address
    collateralManager.save()

  }

  return collateralManager

}


export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleBuild(event: Build): void { }

export function handleLiquidate(event: Liquidate): void {}



export function handleTransferBatch(event: TransferBatch): void { 

}

export function handleTransferSingle(event: TransferSingle): void {

  let collateralManager = getCollateralManager(event.address)

}

export function handleURI(event: URI): void {}

export function handleUnwind(event: Unwind): void {}

export function handleUpdate(event: Update): void {}

export function handleFundingPaid(event: FundingPaid): void {}

export function handleNewPrice(event: NewPrice): void {}