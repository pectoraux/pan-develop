import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

import orderBy from "lodash/orderBy";

import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from "../types";

import { getCakeVaultEarnings } from "./getCakeVaultEarnings";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "id":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "creationTime":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.creationTime), "desc");
    case "pricePerMinutes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.pricePerMinutes), "desc");
    case "creatorShare":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.creatorShare), "desc");
    case "teamShare":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.teamShare), "desc");
    default:
      return poolsToSort;
  }
}
