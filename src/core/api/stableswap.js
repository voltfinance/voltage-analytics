import { getApollo } from "../apollo";
import { BUSD_USDC_USDT_PAIR } from "../constants";
import { dayDataStablesQuery, stablePairsQuery, stablePairsTimeTravelQuery } from "../queries/stableswap";

export async function getDayDataStables(
  client = getApollo(),
  pair = BUSD_USDC_USDT_PAIR
) {
  const { data } = await client.query({
    query: dayDataStablesQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      pair,
    },
  });

  await client.cache.writeQuery({
    query: dayDataStablesQuery,
    data,
    context: {
      clientName: "stableswap",
    }
  });

  return await client.cache.readQuery({
    query: dayDataStablesQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      pair,
    },
  });
}