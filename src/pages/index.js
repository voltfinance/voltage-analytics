import {
  AppShell,
  TVLAreaChart,
  BarChart,
  PairTable,
  PoolTable,
  Search,
  TokenTable,
} from "app/components";
import { Box, Grid, Paper } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import {
  dayDatasQuery,
  dayDataStablesQuery,
  getApollo,
  getDayData,
  getDayDataStables,
  getFusePrice,
  getOneDayFusePrice,
  getPairs,
  getPools,
  getSevenDayFusePrice,
  getTokens,
  pairsQuery,
  poolsQuery,
  tokensQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { useQuery } from "@apollo/client";

const aggregateChartData = (data) =>
  Object.values(
    data.reduce(
      (acc, current) => ({
        ...acc,
        [current.date]: {
          date: current.date,
          value: acc[current.date]
            ? acc[current.date].value + current.value
            : current.value,
        },
      }),
      {}
    )
  );

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
    data: { dayDatas },
  } = useQuery(dayDatasQuery);

  const {
    data: { dailyVolumes },
  } = useQuery(dayDataStablesQuery, {
    context: {
      clientName: "stableswap",
    },
  });

  useInterval(
    () =>
      Promise.all([
        getPairs,
        getPools,
        getTokens,
        getDayData,
        getDayDataStables,
        getOneDayFusePrice,
        getSevenDayFusePrice,
      ]),
    60000
  );

  const [useUSD, setUseUSD] = useState(true);

  const [liquidity, volume] = dayDatas
    .filter((d) => d.liquidityUSD !== "0")
    .reduce(
      (previousValue, currentValue) => {
        previousValue[0].unshift({
          date: currentValue.date,
          value: parseFloat(
            useUSD ? currentValue.liquidityUSD : currentValue.liquidityETH
          ),
        });
        previousValue[1].unshift({
          date: currentValue.date,
          value: parseFloat(currentValue.volumeUSD),
        });
        return previousValue;
      },
      [[], []]
    );
  const [stablesLiquidity, stablesVolume] = dailyVolumes.reduce(
    (acc, current) => {
      acc[0].unshift({
        date: parseInt(current.timestamp),
        value:
          parseFloat(current.swap.balances[0] / 10 ** 18) +
          parseFloat(current.swap.balances[1] / 10 ** 6) +
          parseFloat(current.swap.balances[2] / 10 ** 6),
      });
      acc[1].unshift({
        date: parseInt(current.timestamp),
        value: parseFloat(current.volume),
      });
      return acc;
    },
    [[], []]
  );

  const aggregatedLiquidity = useMemo(
    () => aggregateChartData([...liquidity, ...stablesLiquidity]),
    [liquidity, stablesLiquidity]
  );
  const aggregatedVolume = useMemo(
    () => aggregateChartData([...volume, ...stablesVolume]),
    [volume, stablesVolume]
  );

  return (
    <AppShell>
      <Head>
        <title>Dashboard | Voltage Analytics</title>
      </Head>
      <Box mb={3}>
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
                  data={aggregatedLiquidity}
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
                  data={aggregatedVolume}
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
            title="Voltage Reward Pools"
            pools={pools}
            orderBy="tvl"
            order="desc"
            rowsPerPage={25}
          />
        </Grid>

        <Grid item xs={12}>
          <PairTable title="Top Voltage Liquidity Pairs" pairs={pairs} />
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

  await getDayDataStables(client);

  await getFusePrice(client);

  await getOneDayFusePrice(client);

  await getSevenDayFusePrice(client);

  await getTokens(client);

  await getPairs(client);

  await getPools(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default IndexPage;
