import { ethereum, log } from "@graphprotocol/graph-ts"

import {
  FundingPaid,
  NewPrice,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
  loadMarket
} from "./utils"

export function handleFundingPaid(event: FundingPaid): void { }

export function handleNewPrice(event: NewPrice): void {

  let market = loadMarket(event.address)

}

export function handleBlock(block: ethereum.Block): void {

  log.info("\n\nhandling the block number {} time {}\n\n", [block.number.toString(), block.timestamp.toString()])

}
