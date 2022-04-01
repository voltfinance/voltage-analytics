import {
  dayDatasQuery,
  factoryQuery,
  factoryTimeTravelQuery,
  tokenQuery,
  tokenTimeTravelQuery,
  tokensQuery,
  tokensTimeTravelQuery,
  userQuery,
  userIdsQuery,
  ALL_TRANSACTIONS
} from "../queries/exchange";
import {
  getOneDayBlock,
  getSevenDayBlock,
  getTwoDayBlock,
} from "../api/blocks";

import { getApollo } from "../apollo";
import { FACTORY_ADDRESS, JOE_TOKEN_ADDDRESS } from "../../config/index.ts";

export async function getFactory(client = getApollo()) {
  const {
    data: { uniswapFactory },
  } = await client.query({
    query: factoryQuery,
  });

  const {
    data: { uniswapFactory: oneDay },
  } = await client.query({
    query: factoryTimeTravelQuery,
    variables: {
      block: await getOneDayBlock(),
    },
  });

  const {
    data: { uniswapFactory: twoDay },
  } = await client.query({
    query: factoryTimeTravelQuery,
    variables: {
      block: await getTwoDayBlock(),
    },
  });

  await client.cache.writeQuery({
    query: factoryQuery,
    data: {
      uniswapFactory: {
        ...uniswapFactory,
        oneDay: {
          ...oneDay,
          totalVolumeUSD: oneDay.totalVolumeUSD
        },
        twoDay: {
          ...twoDay,
          totalVolumeUSD: twoDay.totalVolumeUSD
        },
      },
    },
  });

  return await client.cache.readQuery({
    query: factoryQuery,
  });
}

export async function getJoeToken(client = getApollo()) {
  return await getToken(JOE_TOKEN_ADDDRESS, client);
}

export async function getDayData(client = getApollo()) {
  const { data } = await client.query({
    query: dayDatasQuery,
  });

  await client.cache.writeQuery({
    query: dayDatasQuery,
    data,
  });

  return await client.cache.readQuery({
    query: dayDatasQuery,
  });
}

// Tokens

export async function getToken(id, client = getApollo()) {
  const {
    data: { token },
  } = await client.query({
    query: tokenQuery,
    variables: { id },
  });

  const oneDayBlock = await getOneDayBlock();
  const twoDayBlock = await getTwoDayBlock();

  const {
    data: { token: oneDayToken },
  } = await client.query({
    query: tokenTimeTravelQuery,
    variables: {
      id,
      block: oneDayBlock,
    },
    fetchPolicy: "no-cache",
  });

  const {
    data: { token: twoDayToken },
  } = await client.query({
    query: tokenTimeTravelQuery,
    variables: {
      id,
      block: twoDayBlock,
    },
    fetchPolicy: "no-cache",
  });

  await client.cache.writeQuery({
    query: tokenQuery,
    variables: {
      id,
    },
    data: {
      token: {
        ...token,
        oneDay: {
          tradeVolumeUSD: String(oneDayToken?.tradeVolumeUSD),
          derivedETH: String(oneDayToken?.derivedETH),
          totalLiquidity: String(oneDayToken?.totalLiquidity),
          txCount: String(oneDayToken?.txCount),
        },
        twoDay: {
          tradeVolumeUSD: String(twoDayToken?.tradeVolumeUSD),
          derivedETH: String(twoDayToken?.derivedETH),
          totalLiquidity: String(twoDayToken?.totalLiquidity),
          txCount: String(twoDayToken?.txCount),
        },
      },
    },
  });

  return await client.cache.readQuery({
    query: tokenQuery,
    variables: { id },
  });
}

export async function getTokens(client = getApollo()) {
  const {
    data: { tokens },
  } = await client.query({
    query: tokensQuery,
  });

  const block = await getOneDayBlock();

  const {
    data: { tokens: oneDayTokens },
  } = await client.query({
    query: tokensTimeTravelQuery,
    variables: {
      block,
    },
    fetchPolicy: "no-cache",
  });

  const {
    data: { tokens: sevenDayTokens },
  } = await client.query({
    query: tokensTimeTravelQuery,
    variables: {
      block: await getSevenDayBlock(),
    },
    fetchPolicy: "no-cache",
  });

  await client.writeQuery({
    query: tokensQuery,
    data: {
      tokens: tokens.map((token) => {
        const oneDayToken = oneDayTokens.find(({ id }) => token.id === id);
        const sevenDayToken = sevenDayTokens.find(({ id }) => token.id === id);
        return {
          ...token,
          oneDay: {
            volumeUSD: String(oneDayToken?.tradeVolumeUSD),
            derivedAVAX: String(oneDayToken?.derivedETH),
            liquidity: String(oneDayToken?.totalLiquidity),
          },
          sevenDay: {
            volumeUSD: String(sevenDayToken?.tradeVolumeUSD),
            derivedAVAX: String(sevenDayToken?.derivedETH),
            liquidity: String(sevenDayToken?.totalLiquidity),
          },
        };
      }),
    },
  });

  return await client.cache.readQuery({
    query: tokensQuery,
  });
}

export async function getTransactions(client = getApollo()) {
  const { data: transactions } = await client.query({ query: ALL_TRANSACTIONS });
  const { swaps, mints, burns } = transactions;
  
  await client.cache.writeQuery({
    query: ALL_TRANSACTIONS,
    data: {
      swaps,
      mints,
      burns,
    }
  });

  return await client.cache.readQuery({
    query: ALL_TRANSACTIONS,
  });
}

// Users

export async function getUser(id, client = getApollo()) {
  const {
    data: { user },
  } = await client.query({
    query: userQuery,
    variables: { id },
  });

  await client.cache.writeQuery({
    query: userQuery,
    variables: {
      id,
    },
    data: {
      user: {
        id
      }
    }
  });

  return await client.cache.readQuery({
    query: userQuery,
    variables: { id },
  });
}

export async function getUsers(client = getApollo()) {
  const {
    data: { users },
  } = await client.query({
    query: userIdsQuery
  });

  await client.writeQuery({
    query: userIdsQuery,
    data: {
      users: users.map(user => {
        return {
          ...user
        };
      }),
    },
  });

  return await client.cache.readQuery({
    query: userIdsQuery
  });
}
