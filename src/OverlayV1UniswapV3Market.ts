import { BigInt } from "@graphprotocol/graph-ts"
import {
  OverlayV1UniswapV3Market,
  FundingPaid,
  NewPrice,
  log
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"
import { ExampleEntity } from "../generated/schema"

export function handleFundingPaid(event: FundingPaid): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.oiLong = event.params.oiLong
  entity.oiShort = event.params.oiShort

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.MAX_FUNDING_COMPOUND(...)
  // - contract.MIN_COLLAT(...)
  // - contract.base(...)
  // - contract.brrrrdAccumulatooor(...)
  // - contract.brrrrdCycloid(...)
  // - contract.brrrrdExpected(...)
  // - contract.brrrrdFiling(...)
  // - contract.brrrrdRollers(...)
  // - contract.brrrrdWindowMacro(...)
  // - contract.brrrrdWindowMicro(...)
  // - contract.compounded(...)
  // - contract.compoundingPeriod(...)
  // - contract.enterOI(...)
  // - contract.epochs(...)
  // - contract.exitData(...)
  // - contract.impactCycloid(...)
  // - contract.impactRollers(...)
  // - contract.impactWindow(...)
  // - contract.isCollateral(...)
  // - contract.k(...)
  // - contract.leverageMax(...)
  // - contract.lmbda(...)
  // - contract.macroWindow(...)
  // - contract.marketFeed(...)
  // - contract.microWindow(...)
  // - contract.mothership(...)
  // - contract.oi(...)
  // - contract.oiCap(...)
  // - contract.oiLong(...)
  // - contract.oiLongShares(...)
  // - contract.oiShort(...)
  // - contract.oiShortShares(...)
  // - contract.ovl(...)
  // - contract.ovlFeed(...)
  // - contract.pbnj(...)
  // - contract.positionInfo(...)
  // - contract.price(...)
  // - contract.priceFrameCap(...)
  // - contract.pricePointCurrentIndex(...)
  // - contract.pricePoints(...)
  // - contract.queuedOiLong(...)
  // - contract.queuedOiShort(...)
  // - contract.quote(...)
  // - contract.toUpdate(...)
  // - contract.updatePeriod(...)
  // - contract.updated(...)
}

export function handleNewPrice(event: NewPrice): void {}

export function handlelog(event: log): void {}
