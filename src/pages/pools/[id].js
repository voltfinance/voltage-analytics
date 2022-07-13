import {
  AppShell,
  Chart,
  Curves,
  KPI,
  Link,
  LiquidityProviderList,
  PageHeader,
  PairIcon,
} from "app/components";
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  currencyFormatter,
  fusePriceQuery,
  getApollo,
  getFusePrice,
  getPool,
  getPoolHistories,
  getPoolIds,
  getPools,
  getVoltToken,
  poolHistoryQuery,
  poolQuery,
  tokenQuery,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { deepPurple } from "@material-ui/core/colors";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { VOLT_TOKEN_ADDRESS } from "../../config/index.ts";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function PoolPage() {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const classes = useStyles();

  const theme = useTheme();

  const { id } = router.query;

  const {
    data: { pool },
  } = useQuery(poolQuery, {
    variables: {
      id,
    },
    context: {
      clientName: "masterchef",
    },
  });

  const {
    data: { poolHistories },
  } = useQuery(poolHistoryQuery, {
    variables: {
      id,
    },
    context: {
      clientName: "masterchef",
    },
  });

  const {
    data: { bundles },
  } = useQuery(fusePriceQuery, {
    pollInterval: 1800000,
  });

  const token_address = VOLT_TOKEN_ADDRESS;
  const {
    data: { token },
  } = useQuery(tokenQuery, {
    variables: {
      id: token_address,
    },
  });

  const voltPrice =
    parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

  const {
    flpAge,
    flpAgeRemoved,
    userCount,
    flpDeposited,
    flpWithdrawn,
    flpAgeAverage,
    flpBalance,
    tvl,
  } = poolHistories.reduce(
    (previousValue, currentValue) => {
      const date = currentValue.timestamp * 1000;

      previousValue.flpAge.push({
        date,
        value: currentValue.flpAge,
      });

      const flpAgeAverage =
        parseFloat(currentValue.flpAge) / parseFloat(currentValue.flpBalance);

      previousValue.flpAgeAverage.push({
        date,
        value: !Number.isNaN(flpAgeAverage) ? flpAgeAverage : 0,
      });

      previousValue.flpAgeRemoved.push({
        date,
        value: currentValue.flpAgeRemoved,
      });

      previousValue.flpBalance.push({
        date,
        value: parseFloat(currentValue.flpBalance),
      });

      previousValue.flpDeposited.push({
        date,
        value: parseFloat(currentValue.flpDeposited),
      });

      previousValue.flpWithdrawn.push({
        date,
        value: parseFloat(currentValue.flpWithdrawn),
      });

      previousValue.tvl.push({
        date,
        value:
          (parseFloat(pool?.liquidityPair?.reserveUSD) /
            parseFloat(pool?.liquidityPair?.totalSupply)) *
          parseFloat(currentValue.flpBalance),
      });

      previousValue.userCount.push({
        date,
        value: parseFloat(currentValue.userCount),
      });

      return previousValue;
    },
    {
      entries: [],
      exits: [],
      flpAge: [],
      flpAgeAverage: [],
      flpAgeRemoved: [],
      flpBalance: [],
      flpDeposited: [],
      flpWithdrawn: [],
      tvl: [],
      userCount: [],
    }
  );

  return (
    <AppShell>
      <Head>
        <title>Pool {id} | Voltage Analytics</title>
      </Head>

      <PageHeader mb={3}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          // className={classes.top}
        >
          <Grid item xs={12} sm="auto" className={classes.title}>
            <Box display="flex" alignItems="center">
              <PairIcon
                base={pool?.liquidityPair?.token0?.id}
                quote={pool?.liquidityPair?.token1?.id}
              />
              <Typography variant="h5" component="h1">
                {pool?.liquidityPair?.token0?.symbol}-
                {pool?.liquidityPair?.token1?.symbol} POOL
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm="auto" className={classes.links}>
            <Link
              href={`https://app.voltage.finance/#/pool/${pool?.liquidityPair?.token0?.id}/${pool?.liquidityPair?.token1?.id}`}
              target="_blank"
              variant="body1"
            >
              Stake LP
            </Link>
          </Grid>
        </Grid>

        {/* <Box display="flex" alignItems="center">
          <PairIcon
            base={pool.liquidityPair.token0.id}
            quote={pool.liquidityPair.token1.id}
          />
          <Typography variant="h5" component="h1">
            {pool.liquidityPair.token0.symbol}-
            {pool.liquidityPair.token1.symbol} POOL
          </Typography>
        </Box> */}
      </PageHeader>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <KPI
            title="~ LP Age"
            value={`${(
              parseFloat(pool.flpAge) / parseFloat(pool.balance / 1e18)
            ).toFixed(2)} Days`}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPI title="Users" value={pool.userCount} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPI
            title="Staked"
            value={`${(pool.balance / 1e18).toFixed(4)} LP`}
          />
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <KPI
            title="Fees (24h)"
            value={currencyFormatter.format(
              pool.liquidityPair.volumeUSD * 0.03
            )}
          />
        </Grid> */}
        {/* 
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  title="Profitability"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[pendingJoe]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid> */}

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[flpAge, flpAgeRemoved]}
                  labels={["LP Age", "LP Age Removed"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[flpDeposited, flpWithdrawn]}
                  labels={["LP Deposited", "LP Age Withdrawn"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  title="~ LP Age (Days)"
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[flpAgeAverage]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  title="Users"
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[userCount]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  title="LP Balance"
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[flpBalance]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        {/* <Grid item xs={12}>
          <Chart
            title="Virtual Profit/Loss USD"
            data={profit}
            height={400}
            margin={{ top: 56, right: 24, bottom: 0, left: 56 }}
            tooptip
            brush
          />
        </Grid> */}

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{
              display: "flex",
              position: "relative",
              height: 400,
              flex: 1,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  title="TVL (USD)"
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[tvl]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
      </Grid>

      <LiquidityProviderList
        pool={pool}
        orderBy="amount"
        title="Top Liquidity Providers"
      />
      {/* <pre>{JSON.stringify(pool, null, 2)}</pre> */}
    </AppShell>
  );
}

export async function getStaticProps({ params: { id } }) {
  const client = getApollo();
  await getFusePrice(client);
  await getVoltToken(client);
  await getPool(id, client);
  await getPoolHistories(id, client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export async function getStaticPaths() {
  const client = getApollo();
  const { pools } = await getPoolIds(client);
  const paths = pools.filter(pool => !["24", "66", "67"].includes(pool.id)).map((pool) => ({
    params: { id: pool.id },
  }));

  return { paths, fallback: true };
}

export default PoolPage;
