import { BigInt } from "@graphprotocol/graph-ts"
import {
  OverlayToken,
  Approval,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/OverlayToken/OverlayToken"
import {
    BalanceOVL
} from "../generated/schema"
import {
    decrement,
    increment,
    isCollateral,
    loadBalanceOVL
} from "./utils"

export function handleTransfer(event: Transfer): void {

    let from = loadBalanceOVL(event.params.from)
    let to = loadBalanceOVL(event.params.to)
    let v = event.params.value

    from.balance = decrement(from.balance, event.params.value)
    to.balance = increment(to.balance, event.params.value)

    if (isCollateral(to.account)) from.locked = increment(from.locked, v)
    if (isCollateral(from.account)) to.locked = decrement(to.locked, v)

    from.save()
    to.save()

}

export function handleApproval(event: Approval): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
