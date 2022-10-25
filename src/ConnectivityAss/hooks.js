import React from "react";
import { Contract } from "@ethersproject/contracts";
import stakingAbi from "./stakingAbi.json";
import tokenAbi from "./tokenAbi.json";
import pancakeAbi from "./pancakePairAbi.json";
import {
  stakingAddress,
  tokenAddress,
  pancakePairAddress,
} from "./environment";
import { ethers } from "ethers";
let walletAddress = "0x6dd3b40B3a3d1BaAE3e4d84D19d77Dc7802f4A5c";

const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);

export const voidAccount = new ethers.VoidSigner(walletAddress, provider);
function useContract(address, ABI, signer) {
  return React.useMemo(() => {
    if (signer) {
      return new Contract(address, ABI, signer);
    } else {
      return new Contract(address, ABI, voidAccount);
    }
  }, [address, ABI, signer]);
}

export function useStakingContract(signer) {
  return useContract(stakingAddress, stakingAbi, signer );
}
export function useTokenContract(signer) {
  return useContract(tokenAddress, tokenAbi, signer);
}

export function usePancakePairContract(signer) {
  return useContract(pancakePairAddress, pancakeAbi, signer);
}
