import { Address, ethereum, log } from "@graphprotocol/graph-ts"

import {
  FundingPaid,
  NewPrice,
  OverlayV1UniswapV3Market,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
  loadMarket,
  loadMarketManifest,
  loadMarketMonitor,
} from "./utils"

export function handleFundingPaid(event: FundingPaid): void { }

export function handleNewPrice(event: NewPrice): void {

  let market = loadMarket(event.address)

}

export function handleBlock(block: ethereum.Block): void {


  let now = block.timestamp

  let manifest = loadMarketManifest()

  let compoundings = manifest.compoundings

  let markets = manifest.markets

  for (let i = 0; i < compoundings.length; i++) {

    let compounding = compoundings[i]
    let marketAddr = markets[i]

    if (compounding.le(now)) {

      let market = loadMarket(Address.fromByteArray(marketAddr) as Address)

      let oi = OverlayV1UniswapV3Market.bind(Address.fromByteArray(marketAddr) as Address).oi()

      let monitor = loadMarketMonitor(Address.fromByteArray(marketAddr) as Address)

      let positions = monitor.positions

      for (let j = 0; j < positions.length; j++) {

      }

    }

  }

  log.info("\n\nhandling the block number {} time {}\n\n", [block.number.toString(), block.timestamp.toString()])

}
