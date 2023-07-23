import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

import orderBy from "lodash/orderBy";

import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from "../types";

import { getCakeVaultEarnings } from "./getCakeVaultEarnings";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "id":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "upVotes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.upVotes), "desc");
    case "downVotes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.downVotes), "desc");
    case "creationTime":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.creationTime), "desc");
    case "claimable":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.claimable), "desc");
    case "gaugeEarned":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.gaugeEarned), "desc");
    case "gaugeWeight":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.gaugeWeight), "desc");
    case "weightPercent":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.weightPercent), "desc");
    default:
      return poolsToSort;
  }
}
