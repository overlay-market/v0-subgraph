import { BigInt } from "@graphprotocol/graph-ts"
import {
  OverlayV1UniswapV3Market,
  FundingPaid,
  NewPrice,
  log
} from "../generated/OverlayV1UniswapV3Market/OverlayV1UniswapV3Market"

export function handleFundingPaid(event: FundingPaid): void { }

export function handleNewPrice(event: NewPrice): void {}

export function handlelog(event: log): void {}
