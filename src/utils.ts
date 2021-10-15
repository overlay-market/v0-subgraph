import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import {
  OverlayV1UniswapV3Market,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
    Market,
    MarketManifest,
    MarketMonitor,
    PricePoint,
    PricePointCount
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

export function countPricePoint (market: Address): string {

    let count = PricePointCount.load(market.toHexString())

    if (count == null) count = new PricePointCount(market.toHexString())

    let number = count.count;

    count.count = number.plus(BigInt.fromI32(1));

    count.save()

    return number.toString()

}


export function loadPricePoint (
    _market: Address, 
    _pricePoint: string, 
    _forLiquidationPrice: boolean
): PricePoint|null {

    let pricePointId = _market.toHexString().concat('-').concat(_pricePoint)

    let pricePoint = PricePoint.load(pricePointId)

    if (pricePoint == null) {

        if (_forLiquidationPrice) {

            let market = OverlayV1UniswapV3Market.bind(_market)

            let tryPricePoint = market.try_pricePoints(BigInt.fromString(_pricePoint))

            if (!tryPricePoint.reverted) {

                pricePoint = new PricePoint(pricePointId)
                pricePoint.bid = tryPricePoint.value.bid
                pricePoint.ask = tryPricePoint.value.ask
                pricePoint.index = tryPricePoint.value.index
                pricePoint.number = BigInt.fromString(_pricePoint)
                pricePoint.save()
                countPricePoint(_market)

            }

        } else {

            pricePoint = new PricePoint(pricePointId)
            pricePoint.number = BigInt.fromString(_pricePoint)

        }

    }

    return pricePoint

}


const decimals = BigInt.fromI32(10**18).toBigDecimal()

export function morphd (val: BigInt): BigDecimal {

    let decimal = val.toBigDecimal()
  
    return decimal / decimals
  
}


