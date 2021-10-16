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
    loadBalanceOVL
} from "./utils"

export function handleTransfer(event: Transfer): void {

    let from = loadBalanceOVL(event.params.from)

    let to = loadBalanceOVL(event.params.to)


}

export function handleApproval(event: Approval): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
