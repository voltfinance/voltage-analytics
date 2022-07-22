import { getUnixTime, startOfDay, subDays } from "date-fns";
import { getApollo } from "../apollo";
import { BUSD_USDC_USDT_PAIR } from "../constants";
import { dayDataStablesQuery, stablePairsQuery, stablePairsTimeTravelQuery } from "../queries/stableswap";
import { getOneDayBlock, getSevenDayBlock } from "./blocks";

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

export async function getStablePairs(
  client = getApollo()
) {
  const {
    data: { swaps },
  } = await client.query({
    query: stablePairsQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      pairAddresses: [BUSD_USDC_USDT_PAIR]
    }
  });

  const pairAddresses = swaps.map((pair) => pair.id).sort();

  const oneDayBlock = await getOneDayBlock();

  const sevenDayBlock = await getSevenDayBlock();

  const {
    data: { swaps: oneDayPairs },
  } = await client.query({
    query: stablePairsTimeTravelQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      block: oneDayBlock,
      pairAddresses,
    },
    fetchPolicy: "no-cache",
  });

  const {
    data: { swaps: sevenDayPairs },
  } = await client.query({
    query: stablePairsTimeTravelQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      block: sevenDayBlock,
      pairAddresses,
    },
    fetchPolicy: "no-cache",
  });

  await client.cache.writeQuery({
    query: stablePairsQuery,
    data: {
      swaps: swaps.map((pair) => {
        const oneDayPair = oneDayPairs.find(({ id }) => pair.id === id);
        const sevenDayPair = sevenDayPairs.find(({ id }) => pair.id === id);
        return {
          ...pair,
          oneDay: {
            volumeUSD: String(pair.dailyVolumes[pair.dailyVolumes.length-1].volume),
            reserveUSD: String(oneDayPair.balances[0] / 10 ** 18 + oneDayPair.balances[1] / 10 ** 6 + oneDayPair.balances[2] / 10 ** 6),
            timestamp: pair.dailyVolumes[pair.dailyVolumes.length-1].timestamp
          },
          sevenDay: {
            volumeUSD: String(pair.dailyVolumes[pair.dailyVolumes.length-7].volume),
            reserveUSD: String(sevenDayPair.balances[0] / 10 ** 18 + sevenDayPair.balances[1] / 10 ** 6 + sevenDayPair.balances[2] / 10 ** 6),
            timestamp: pair.dailyVolumes[pair.dailyVolumes.length-7].timestamp
          },
        };
      }),
    },
  });

  return await client.cache.readQuery({
    query: stablePairsQuery,
    context: {
      clientName: "stableswap",
    },
    variables: {
      pairAddresses
    }
  });
}
