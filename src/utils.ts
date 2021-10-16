import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import {
  OverlayV1UniswapV3Market,
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

import {
    Account,
    Balance,
    BalanceOVL,
    CollateralManager,
    Market,
    MarketManifest,
    MarketMonitor,
    Position,
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

export function loadPosition(
    collateralManager: CollateralManager, 
    id: BigInt, 
    market: string = Address.zero.toString()
): Position {

	let positionId = collateralManager.id.concat('-').concat(id.toString())

	let position = Position.load(positionId)

	if (position == null) {

		position = new Position(positionId)
		position.collateralManager  = collateralManager.address
		position.number             = id
		position.totalSupply        = BigInt.fromI32(0)
        position.save()

        monitorPosition(market, position)

	}

	return position as Position

}

function monitorPosition(market: string, position: Position): void {

  let monitor = MarketMonitor.load(market) as MarketMonitor

  let positions = monitor.positions

  positions.push(position.id)

  monitor.positions = positions

  monitor.save()

}

export function loadBalance(position: Position, account: Account): Balance {

  let balanceid = position.id.concat('-').concat(account.id);
  let balance = Balance.load(balanceid);

  if (balance == null) {

    balance = new Balance(balanceid);
    balance.position = position.number;
    balance.account = account.id;
    balance.shares = BigInt.fromI32(0)

  }

  return balance as Balance

}

export function loadBalanceOVL(account: Address): BalanceOVL {

  let balance = BalanceOVL.load(account.toHexString());

  if (balance == null) {

    balance = new BalanceOVL(account.toHexString());
    balance.account = account.toHexString();
    balance.balance = BigInt.fromI32(0)
    balance.locked = BigInt.fromI32(0)

  }

  return balance as BalanceOVL

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

export function loadAccount(address: Address): Account {

  let accountId = address.toHex()
  
  let account = Account.load(accountId)

  if (account == null) {
    
    account = new Account(accountId)
    account.address = address
    account.save()

  }

  return account

}

export function loadCollateralManager(address: Address): CollateralManager {

  let collateralId = address.toHex()

  let collateralManager = CollateralManager.load(collateralId)

  if (collateralManager == null) {

    collateralManager = new CollateralManager(collateralId)
    collateralManager.address = address
    collateralManager.save()

  }

  return collateralManager

}

export function increment(num: BigInt, amount: BigInt = BigInt.fromI32(1)): BigInt {
    return num.plus(amount)
}

export function decrement(num: BigInt, amount: BigInt = BigInt.fromI32(1)): BigInt {
    return num.minus(amount)
}