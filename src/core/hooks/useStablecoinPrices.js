import { useQuery } from "@apollo/client";
import {
  FUSE_BUSD,
  FUSE_FUSD,
  FUSE_USDC,
  FUSE_USDT,
  FUSE_UST,
} from "../constants";
import { fusePriceQuery, tokenPriceQuery } from "../queries";

export function useStablecoinPrices() {
  // Stablecoin prices for the stable pool
  const fusd = useTokenPrice(tokenPriceQuery, {
    id: FUSE_FUSD.address.toLowerCase(),
  });
  const usdt = useTokenPrice(tokenPriceQuery, {
    id: FUSE_USDT.address.toLowerCase(),
  });
  const usdc = useTokenPrice(tokenPriceQuery, {
    id: FUSE_USDC.address.toLowerCase(),
  });
  const busd = useTokenPrice(tokenPriceQuery, {
    id: FUSE_BUSD.address.toLowerCase(),
  });
  const ust = useTokenPrice(tokenPriceQuery, {
    id: FUSE_UST.address.toLowerCase(),
  });

  return {
    [FUSE_FUSD.address]: fusd,
    [FUSE_USDT.address]: usdt,
    [FUSE_USDC.address]: usdc,
    [FUSE_BUSD.address]: busd,
    [FUSE_UST.address]: ust,
  };
}

export const useBundle = (query = fusePriceQuery, variables = { id: 1 }) => {
  const result = useQuery(query, {
    variables,
  });

  return result.data?.bundles ? result.data?.bundles[0]?.ethPrice : null;
};

export const useTokenPrice = (query, variables) => {
  const nativePrice = useBundle();

  const result = useQuery(query, {
    variables,
  });

  return nativePrice && result.data?.token
    ? result.data?.token?.derivedETH * nativePrice
    : 0;
};
