import { Address, BigDecimal, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import {
  FundingPaid,
  NewPrice,
  OverlayV1UniswapV3Market,
  OverlayV1UniswapV3Market__oiResult
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
  OverlayV1OVLCollateral
} from "../generated/OverlayV1OVLCollateral/OverlayV1OVLCollateral"

import {
  countPricePoint,
  loadMarket,
  loadMarketManifest,
  loadMarketMonitor,
  loadPricePoint,
  morphd
} from "./utils"

import {
  Position,
  PricePoint
} from "../generated/schema"

export function handleFundingPaid(event: FundingPaid): void { }

export function handleNewPrice(event: NewPrice): void {

  let number = countPricePoint(event.address)

  let pricePoint = loadPricePoint(
    event.address, 
    number,
    false
  ) as PricePoint

  pricePoint.bid = event.params.bid
  pricePoint.ask = event.params.ask
  pricePoint.index = event.params.index

  pricePoint.save()

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

        let position = Position.load(positions[j]) as Position

        let collateralManager = OverlayV1OVLCollateral.bind(Address.fromByteArray(position.collateralManager) as Address)

        let marginMaintenance = morphd(collateralManager.marginMaintenance(Address.fromByteArray(position.market) as Address))

        let pricePoint = loadPricePoint(Address.fromByteArray(position.market) as Address, position.pricePoint, true)

        if (pricePoint == null) continue

        setLiquidationPrice(
          position, 
          pricePoint as PricePoint, 
          oi, 
          marginMaintenance
        ) 

      }

    }

  }

  log.info("\n\nhandling the block number {} time {}\n\n", [block.number.toString(), block.timestamp.toString()])

}


function setLiquidationPrice (
  position: Position, 
  pricePoint: PricePoint,
  openInterest: OverlayV1UniswapV3Market__oiResult,
  marginMaintenance: BigDecimal
): void {

  let oi = position.isLong
    ? morphd(openInterest.value0)
    : morphd(openInterest.value1)
 
  let oiShares = position.isLong
    ? morphd(openInterest.value2)
    : morphd(openInterest.value3)

  let liquidationPrice = _liquidationPrice(
    position, 
    pricePoint,
    oi, 
    oiShares, 
    marginMaintenance
  )

  position.liquidationPrice = liquidationPrice

  position.save()

}

function _liquidationPrice (
  position: Position, 
  pricePoint: PricePoint,
  totalOi: BigDecimal, 
  totalOiShares: BigDecimal,
  marginMaintenance: BigDecimal
): BigDecimal {

  let entryPrice = position.isLong
    ? morphd(pricePoint.ask)
    : morphd(pricePoint.bid)

  let oiShares = morphd(position.oiShares)
  let cost = morphd(position.cost)
  let debt = morphd(position.debt)

  let oi = oiShares * totalOi / totalOiShares;
  let initialOi = cost + debt;

  let _oiFrame = ( ( initialOi * marginMaintenance ) + debt ) / oi

  let liquidationPrice = BigInt.fromI32(0).toBigDecimal()

  if (position.isLong) liquidationPrice = entryPrice * _oiFrame;
  else liquidationPrice = entryPrice * ( BigInt.fromI32(2).toBigDecimal() - _oiFrame );

  return liquidationPrice
            
}