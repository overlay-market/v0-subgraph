import { BigInt } from "@graphprotocol/graph-ts"
import {
  OverlayToken,
  Approval,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/OverlayToken/OverlayToken"

export function handleApproval(event: Approval): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}