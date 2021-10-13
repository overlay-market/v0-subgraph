import { BigInt } from "@graphprotocol/graph-ts"
import {
  OverlayV1Mothership,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/OverlayV1Mothership/OverlayV1Mothership"

export function handleRoleAdminChanged(event: RoleAdminChanged): void { }

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}