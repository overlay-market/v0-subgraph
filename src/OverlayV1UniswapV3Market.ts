import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { OverlayV1OVLCollateral__marketInfoResult } from "../generated/OverlayV1OVLCollateral/OverlayV1OVLCollateral"
import {
  OverlayV1UniswapV3Market,
  FundingPaid,
  NewPrice,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"
import {
  Market,
  MarketManifest,
  MarketMonitor
} from "../generated/schema"

function monitorMarket (_market: Address): void {

  let market = OverlayV1UniswapV3Market.bind(_market)

  let manifest = MarketManifest.load('1')
  if (manifest == null) manifest = new MarketManifest('1')

  let markets = manifest.markets
  let compoundings = manifest.compoundings

  let compounded = market.compounded()
  let compoundPeriod = market.compoundingPeriod()

  markets.push(market._address)
  compoundings.push(compounded.plus(compoundPeriod))

  manifest.markets = markets
  manifest.compoundings = compoundings

  manifest.save()


}

function getMarket (address: Address): Market {

  let market = Market.load(address.toHex())

  if (market == null) {

    monitorMarket(address)

    market = new Market(address.toHex())
    market.save()

    let monitor = new MarketMonitor(address.toHex())
    monitor.save()

  }

  return market

}

export function handleFundingPaid(event: FundingPaid): void { }

export function handleNewPrice(event: NewPrice): void {

  let market = getMarket(event.address)

}

export function handleBlock(block: ethereum.Block): void {

  log.info("\n\nhandling the block number {} time {}\n\n", [block.number.toString(), block.timestamp.toString()])

}
