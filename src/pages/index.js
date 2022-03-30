import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { useQuery } from "@apollo/client";
import { Box, Grid, Paper } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { transparentize } from "polished";

import {
  dayDatasQuery,
  getApollo,
  getDayData,
  getAvaxPrice,
  getOneDayAvaxPrice,
  getPairs,
  getPools,
  getSevenDayAvaxPrice,
  getTokens,
  pairsQuery,
  poolsQuery,
  tokensQuery,
  useInterval,
} from "app/core";
import {
  AppShell,
  TVLAreaChart,
  BarChart,
  PairTable,
  PoolTable,
  Search,
  TokenTable,
} from "app/components";

import { TYPE, ThemedBackground } from "../theme";

function IndexPage() {
  const {
    data: { tokens },
  } = useQuery(tokensQuery);

  const {
    data: { pairs },
  } = useQuery(pairsQuery);

  const {
    data: { pools },
  } = useQuery(poolsQuery, {
    context: {
      clientName: "masterchef",
    },
  });

  const {
    data: { tokenDayDatas: dayDatas },
  } = useQuery(dayDatasQuery);

  useInterval(
    () =>
      Promise.all([
        getPairs,
        getPools,
        getTokens,
        getAvaxPrice,
        getDayData,
        getOneDayAvaxPrice,
        getSevenDayAvaxPrice,
      ]),
    1800000
  );

  const [useUSD, setUseUSD] = useState(true);

  const liquidity = useMemo(() => {
    let liquidityByDay = {};
    for (const day of dayDatas) {
      const value = parseFloat(
        useUSD ? day.totalLiquidityUSD : day.totalLiquidityETH
      );
      if (liquidityByDay.hasOwnProperty(day.date)) {
        liquidityByDay[day.date] = liquidityByDay[day.date] + value;
      } else {
        liquidityByDay[day.date] = value;
      }
    }

    let result = [];
    for (const date in liquidityByDay) {
      result.push({ date: parseInt(date), value: liquidityByDay[date] });
    }
    return result.sort((a, b) => b > a);
  }, [dayDatas, useUSD]);

  const volume = useMemo(() => {
    let volumeByDay = {};
    for (const day of dayDatas) {
      if (volumeByDay.hasOwnProperty(day.date)) {
        volumeByDay[day.date] =
          volumeByDay[day.date] + parseFloat(day.dailyVolumeUSD);
      } else {
        volumeByDay[day.date] = parseFloat(day.dailyVolumeUSD);
      }
    }

    let result = [];
    for (const date in volumeByDay) {
      result.push({ date: parseInt(date), value: volumeByDay[date] });
    }
    return result.sort((a, b) => b > a);
  }, [dayDatas]);

  return (
    <AppShell>
      <Head>
        <title>Dashboard | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <ThemedBackground backgroundColor={transparentize(0.8, '#f3fc1f')} />
      <TYPE.largeHeader>{process.env.NEXT_PUBLIC_APP_NAME}</TYPE.largeHeader>
      <Box mt={3} mb={3}>
        <Search pairs={pairs} tokens={tokens} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper variant="outlined" style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <TVLAreaChart
                  title="Liquidity"
                  width={width}
                  height={height}
                  data={liquidity}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                  useUSD={useUSD}
                  setUseUSD={setUseUSD}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, position: "relative" }}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  title="Volume"
                  width={width}
                  height={height}
                  data={volume}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <PoolTable
            title="Joe Reward Pools"
            pools={pools}
            orderBy="tvl"
            order="desc"
            rowsPerPage={25}
          />
        </Grid>

        <Grid item xs={12}>
          <PairTable title="Top Joe Liquidity Pairs" pairs={pairs} />
        </Grid>

        <Grid item xs={12}>
          <TokenTable title="Top Tokens" tokens={tokens} />
        </Grid>
      </Grid>
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  await getDayData(client);

  await getAvaxPrice(client);

  await getOneDayAvaxPrice(client);

  await getSevenDayAvaxPrice(client);

  await getTokens(client);

  await getPairs(client);

  await getPools(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default IndexPage;
