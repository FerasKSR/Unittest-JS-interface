import { deepCopy } from "@ethersproject/properties";
// This is the only file which should instantiate new Providers.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { isPlain } from "@reduxjs/toolkit";
import { ChainId } from "@uniswap/sdk-core";
import { CONFIG } from "lib/config";

import { AVERAGE_L1_BLOCK_TIME } from "./chainInfo";
import {
  CHAIN_IDS_TO_NAMES,
  ChainId_BASE_SEPOLIA,
  ChainId_POLYGON_AMOY,
  SupportedChainsType
} from "./chains";
const RPC_URLS = CONFIG.rpcUrls;

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _blockCache = new Map<string, Promise<any>>();
  get blockCache() {
    // If the blockCache has not yet been initialized this block, do so by
    // setting a listener to clear it on the next block.
    if (!this._blockCache.size) {
      this.once("block", () => this._blockCache.clear());
    }
    return this._blockCache;
  }

  constructor(chainId: SupportedChainsType) {
    // Including networkish allows ethers to skip the initial detectNetwork call.
    super(
      RPC_URLS[chainId][0],
      /* networkish= */ { chainId, name: CHAIN_IDS_TO_NAMES[chainId] }
    );

    // NB: Third-party providers (eg MetaMask) will have their own polling intervals,
    // which should be left as-is to allow operations (eg transaction confirmation) to resolve faster.
    // Network providers (eg AppJsonRpcProvider) need to update less frequently to be considered responsive.
    this.pollingInterval = AVERAGE_L1_BLOCK_TIME;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(method: string, params: Array<any>): Promise<any> {
    // Only cache eth_call's.
    if (method !== "eth_call") return super.send(method, params);

    // Only cache if params are serializable.
    if (!isPlain(params)) return super.send(method, params);

    const key = `call:${JSON.stringify(params)}`;
    const cached = this.blockCache.get(key);
    if (cached) {
      this.emit("debug", {
        action: "request",
        request: deepCopy({ method, params, id: "cache" }),
        provider: this
      });
      return cached;
    }

    const result = super.send(method, params);
    this.blockCache.set(key, result);
    return result;
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: {
  [key: number]: StaticJsonRpcProvider;
} = {
  [ChainId.MAINNET]: new AppJsonRpcProvider(ChainId.MAINNET),
  [ChainId.SEPOLIA]: new AppJsonRpcProvider(ChainId.SEPOLIA),
  [ChainId.OPTIMISM]: new AppJsonRpcProvider(ChainId.OPTIMISM),
  [ChainId.POLYGON]: new AppJsonRpcProvider(ChainId.POLYGON),
  [ChainId.ARBITRUM_ONE]: new AppJsonRpcProvider(ChainId.ARBITRUM_ONE),
  [ChainId_POLYGON_AMOY]: new AppJsonRpcProvider(ChainId_POLYGON_AMOY),
  [ChainId.BASE]: new AppJsonRpcProvider(ChainId.BASE),
  [ChainId_BASE_SEPOLIA]: new AppJsonRpcProvider(ChainId_BASE_SEPOLIA),
  [ChainId.OPTIMISM_SEPOLIA]: new AppJsonRpcProvider(ChainId.OPTIMISM_SEPOLIA),
  [ChainId.ARBITRUM_SEPOLIA]: new AppJsonRpcProvider(ChainId.ARBITRUM_SEPOLIA)
};
