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
    loadBalanceOVL
} from "./utils"

export function handleTransfer(event: Transfer): void {

    let from = loadBalanceOVL(event.params.from)
    from.balance = decrement(from.balance, event.params.value)
    from.save()

    let to = loadBalanceOVL(event.params.to)
    to.balance = increment(to.balance, event.params.value)
    to.save()

}

export function handleApproval(event: Approval): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
