import { AppShell, Curves, KPI } from "app/components";
import { Grid, Paper, useTheme } from "@material-ui/core";
import {
  barHistoriesQuery,
  barQuery,
  dayDatasQuery,
  fusePriceQuery,
  factoryQuery,
  getApollo,
  getBar,
  getBarHistories,
  getDayData,
  getFusePrice,
  getFactory,
  getVoltToken,
  tokenQuery,
  useInterval,
} from "app/core";

import Chart from "../../components/Chart";
import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { VOLT_TOKEN_ADDRESS } from "config";

const FEE_RATE = 0.0005; // 0.05%

const useStyles = makeStyles((theme) => ({
  charts: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function BarPage() {
  const classes = useStyles();

  const theme = useTheme();

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
    data: { factory },
  } = useQuery(factoryQuery);

  const {
    data: { token },
  } = useQuery(tokenQuery, {
    variables: {
      id: VOLT_TOKEN_ADDRESS,
    },
  });

  const {
    data: { bundles },
  } = useQuery(fusePriceQuery);

  const {
    data: { dayDatas },
  } = useQuery(dayDatasQuery);

  const voltPrice =
    parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

  useInterval(async () => {
    await Promise.all([
      getBar,
      getBarHistories,
      getDayData,
      getFactory,
      getVoltToken,
      getFusePrice,
    ]);
  }, 1800000);

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
        (((dayData?.volumeUSD * FEE_RATE) / currentValue.xVoltSupply) * 365) /
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
        value: parseFloat(dayData?.volumeUSD * FEE_RATE),
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

  console.log(apy)

  // average APY of days histories
  const apyAverageDuration = 10
  const averageApy =
    apy.slice(-apyAverageDuration).reduce((prevValue, currValue) => {
      return prevValue + (currValue.value || 0);
    }, 0) / apyAverageDuration;

  // get last day volume and APY
  const oneDayVolume = factory?.volumeUSD - factory?.oneDay.volumeUSD;
  const oneDayFees = oneDayVolume * FEE_RATE;
  const totalStakedUSD = bar.voltStaked * voltPrice;

  const APR = (oneDayFees * 365) / totalStakedUSD;
  const APY = Math.pow(1 + APR / 365, 365) - 1;

  return (
    <AppShell>
      <Head>
        <title>Volt Stake | Voltage Analytics</title>
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
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getBar(client);
  await getBarHistories(client);
  await getFactory(client);
  await getDayData(client);
  await getVoltToken(client);
  await getFusePrice(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default BarPage;
