import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

import orderBy from "lodash/orderBy";

import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from "../types";

import { getCakeVaultEarnings } from "./getCakeVaultEarnings";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "fund":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.fund), "desc");
    case "tokenId":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "channel":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.channel), "desc");
    case "createdAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.createdAt), "desc");
    default:
      return poolsToSort;
  }
}
