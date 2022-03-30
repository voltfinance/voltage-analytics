import { AppShell, Curves, KPI, RemittanceTable } from "app/components";
import { Grid, Paper } from "@material-ui/core";
import {
  barQuery,
  barHistoriesQuery,
  dayDatasQuery,
  avaxPriceQuery,
  factoryQuery,
  getApollo,
  getBarHistories,
  getDayData,
  getAvaxPrice,
  getFactory,
  getJoeToken,
  tokenQuery,
  useInterval,
  stableJoeQuery,
  getStableJoe,
  getMoneyMaker,
  moneyMakerQuery,
  getMoneyMakerDayDatas,
  moneyMakerDayDatasQuery,
  getStableJoeDayDatas,
  stableJoeDayDatasQuery,
  getRemittances,
  remittancesQuery,
  getBar,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { useQuery } from "@apollo/client";
import { JOE_TOKEN_ADDDRESS } from "config";
import dayjs from "dayjs";

const FEE_RATE = 0.0005; // 0.05%

function BarPage() {
  const {
    data: { bar },
  } = useQuery(barQuery, {
    context: {
      clientName: "bar",
    },
  });

  const {
    data: { histories },
  } = useQuery(barHistoriesQuery, {
    context: {
      clientName: "bar",
    },
  });

  const {
    data: { uniswapFactory: factory },
  } = useQuery(factoryQuery);

  const {
    data: { token },
  } = useQuery(tokenQuery, {
    variables: {
      id: JOE_TOKEN_ADDDRESS,
    },
  });

  const {
    data: { bundles },
  } = useQuery(avaxPriceQuery);

  const {
    data: { tokenDayDatas: dayDatas },
  } = useQuery(dayDatasQuery);

  // const {
  //   data: { stableJoe },
  // } = useQuery(stableJoeQuery)

  // const {
  //   data: { stableJoeDayDatas },
  // } = useQuery(stableJoeDayDatasQuery)

  // const {
  //   data: { moneyMaker },
  // } = useQuery(moneyMakerQuery)

  // const {
  //   data: { dayDatas: moneyMakerDayDatas },
  // } = useQuery(moneyMakerDayDatasQuery)

  // const {
  //   data: { remits: remittances },
  // } = useQuery(remittancesQuery)

  const voltPrice =
    parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

  useInterval(async () => {
    await Promise.all([
      getFactory,
      getJoeToken,
      getAvaxPrice,
      getBar,
      getBarHistories,
      getDayData,
      // getStableJoe,
      // getMoneyMaker,
      // getMoneyMakerDayDatas,
      // getStableJoeDayDatas,
    ]);
  }, 1800000);

  // APR chart
  // const apr = moneyMakerDayDatas.reduce(
  //   (previousValue, currentValue) => {
  //     const date = currentValue.date;
  //     const stableJoeDayData = stableJoeDayDatas.find((d) => d.date == currentValue.date);
  //     const moneyMakerDayData = moneyMakerDayDatas.find((d) => d.date === currentValue.date);
  //     const usdRemitted = moneyMakerDayData?.usdRemitted ?? 0;
  //     const joeStaked = stableJoeDayData?.totalJoeStaked ?? 0;
  //     const apr = (usdRemitted * 365) / (joeStaked * joePrice);
  //     previousValue.push({
  //       date: date * 1000,
  //       value: parseFloat(apr * 100),
  //     });
  //     return previousValue;
  //   },
  //   []
  // ).reverse();
  
  // Fees chart
  // const fees = histories.reduce(
  //   (previousValue, currentValue) => {
  //     const date = currentValue.date;
  //     const dayData = dayDatas.find((d) => d.date === currentValue.date);
  //     previousValue.push({
  //       date: date * 1000,
  //       value: parseFloat(dayData?.totalVolumeUSD * FEE_RATE),
  //     });
  //     return previousValue;
  //   },
  //   []
  // );

  // Total Staked
  // const totalStakedUSD = stableJoe.joeStaked * joePrice;

  // Fees (24H)
  // const oneDayVolume = factory?.totalVolumeUSD - factory?.oneDay.totalVolumeUSD;
  // const oneDayFees = oneDayVolume * FEE_RATE;

  const {
    voltStakedUSD,
    voltHarvestedUSD,
    xVoltMinted,
    xVoltBurned,
    xVolt,
    apr,
    apy,
    fees,
  } = histories.reduce(
    (previousValue, currentValue) => {
      const date = currentValue.date * 1000;
      const dayData = dayDatas.find((d) => d.date === currentValue.date);
      previousValue["voltStakedUSD"].push({
        date,
        value: parseFloat(currentValue.voltStakedUSD),
      });
      previousValue["voltHarvestedUSD"].push({
        date,
        value: parseFloat(currentValue.voltHarvestedUSD),
      });

      previousValue["xVoltMinted"].push({
        date,
        value: parseFloat(currentValue.xVoltMinted),
      });
      previousValue["xVoltBurned"].push({
        date,
        value: parseFloat(currentValue.xVoltBurned),
      });
      previousValue["xVolt"].push({
        date,
        value: parseFloat(currentValue.xVoltSupply),
      });
      const apr =
        (((dayData?.dailyVolumeUSD * FEE_RATE) / currentValue.xVoltSupply) * 365) /
        (currentValue.ratio * voltPrice);
      previousValue["apr"].push({
        date,
        value: parseFloat(apr * 100),
      });
      previousValue["apy"].push({
        date,
        value: parseFloat((Math.pow(1 + apr / 365, 365) - 1) * 100),
      });
      previousValue["fees"].push({
        date,
        value: parseFloat(dayData?.dailyVolumeUSD * FEE_RATE),
      });
      return previousValue;
    },
    {
      voltStakedUSD: [],
      voltHarvestedUSD: [],
      xVoltMinted: [],
      xVoltBurned: [],
      xVolt: [],
      apr: [],
      apy: [],
      fees: [],
    }
  );

  // average APY of days histories
  const averageApy =
    apy.reduce((prevValue, currValue) => {
      return prevValue + (currValue.value || 0);
    }, 0) / apy.length;

  // get last day volume and APY
  const oneDayVolume = factory?.totalVolumeUSD - factory?.oneDay.totalVolumeUSD;
  const oneDayFees = oneDayVolume * FEE_RATE;
  const totalStakedUSD = bar.voltStaked * voltPrice;

  const APR = (oneDayFees * 365) / totalStakedUSD;
  const APY = Math.pow(1 + APR / 365, 365) - 1;

  return (
    <AppShell>
      <Head>
        <title>Volt Stake | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <KPI
                title="Total Staked"
                value={totalStakedUSD}
                format="currency"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="Fees (24H)" value={oneDayFees} format="currency" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="APY (24H)" value={APY * 100} format="percent" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="APY (Avg)" value={averageApy} format="percent" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[apr, apy]}
                  labels={["APR", "APY"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  title="Fees received (USD)"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[fees]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  data={[voltStakedUSD, voltHarvestedUSD]}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  labels={["Volt Staked (USD)", "Volt Harvested (USD)"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[xVoltMinted, xVoltBurned]}
                  labels={["xVolt Minted", "xVolt Burned"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  title="xVolt Total Supply"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[xVolt]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
      </Grid>
      {/* <RemittanceTable remittances={remittances} orderBy="timestamp" orderDirection="desc" rowsPerPage={10} /> */}
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getBar(client);
  await getBarHistories(client);
  await getFactory(client);
  await getDayData(client);
  await getJoeToken(client);
  await getAvaxPrice(client);
  // await getMoneyMaker(client);
  // await getStableJoe(client);
  // await getMoneyMakerDayDatas(client);
  // await getStableJoeDayDatas(client);
  // await getRemittances(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default BarPage;
