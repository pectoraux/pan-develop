import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

import orderBy from "lodash/orderBy";

import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from "../types";

import { getCakeVaultEarnings } from "./getCakeVaultEarnings";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "id":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "likes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.likes), "desc");
    case "dislikes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.dislikes), "desc");
    default:
      return poolsToSort;
  }
}
