import { Address } from "@graphprotocol/graph-ts"

import {
  OverlayV1UniswapV3Market,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
    Market,
    MarketManifest,
    MarketMonitor,
} from "../generated/schema"

export function loadMarketManifest(): MarketManifest {

    let manifest = MarketManifest.load('1') 
    if (manifest == null) manifest = new MarketManifest('1')
    return manifest as MarketManifest
  
}
  
export function loadMarketMonitor (market: Address): MarketMonitor {
  
    let monitor = MarketMonitor.load(market.toHexString()) 
    if (monitor == null) monitor = new MarketMonitor(market.toHexString())
    return monitor as MarketMonitor
  
}

export function loadMarket (address: Address): Market {

  let market = Market.load(address.toHexString())

  if (market == null) {

    monitorMarket(address)

    market = new Market(address.toHexString())
    market.save()

    let monitor = new MarketMonitor(address.toHexString())
    monitor.save()

  }

  return market as Market

}

function monitorMarket (_market: Address): void {

  let market = OverlayV1UniswapV3Market.bind(_market)

  let manifest = loadMarketManifest()

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