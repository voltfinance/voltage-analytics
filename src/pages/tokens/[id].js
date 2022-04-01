import { useMemo } from "react";
import {
  AppShell,
  AreaChart,
  BarChart,
  BasicTable,
  KPI,
  Link,
  PageHeader,
  PairTable,
  Percent,
  TokenIcon,
  Transactions,
} from "app/components";
import { Box, Grid, Paper, Typography } from "@material-ui/core";
import {
  currencyFormatter,
  avaxPriceQuery,
  getApollo,
  getOneDayBlock,
  getOneDayAvaxPrice,
  getToken,
  getTokenPairs,
  oneDayAvaxPriceQuery,
  sevenDayAvaxPriceQuery,
  tokenDayDatasQuery,
  tokenIdsQuery,
  tokenPairsQuery,
  tokenQuery,
  transactionsQuery,
  useInterval,
} from "app/core";
import { AutoRow } from "components/Row";
import NextLink from "components/Link";
import { TYPE } from "app/theme";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    flexDirection: "column",
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 0,
      "& > div:first-of-type": {
        marginRight: theme.spacing(1),
      },
    },
  },
  backgroundColor: {
    color: "rgb(120, 134, 134)",
  },
  links: {
    "& > a:first-of-type": {
      marginRight: theme.spacing(4),
    },
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  price: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.up("sm")]: {
      margin: 0,
    },
  },
  kpi: {
    height: "95px"
  }
}));

function TokenPage() {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const classes = useStyles();

  const id = router.query.id.toLowerCase();

  const FEE_RATE = 0.0025; // 0.25% of volume are fees

  const {
    data: { token },
  } = useQuery(tokenQuery, {
    variables: { id },
  });

  const {
    data: { bundles },
  } = useQuery(avaxPriceQuery, {
    pollInterval: 1800000,
  });

  const { data: oneDayAvaxPriceData } = useQuery(oneDayAvaxPriceQuery);

  useInterval(async () => {
    await getToken(id);
    await getOneDayAvaxPrice();
  }, 1800000);

  const {
    data: { tokenDayDatas },
  } = useQuery(tokenDayDatasQuery, {
    variables: {
      tokens: [id],
    },
    pollInterval: 1800000,
  });

  const {
    data: { pairs0, pairs1 },
  } = useQuery(tokenPairsQuery, {
    variables: { id },
  });

  const pairs = [...pairs0, ...pairs1];

  const { data: transactions } = useQuery(transactionsQuery, {
    variables: {
      pairAddresses: pairs.map((pair) => pair.id).sort(),
    },
    pollInterval: 1800000,
  });

  const liquidityDayData = useMemo(() => {
    let liquidityByDay = {};
    for (const day of tokenDayDatas) {
      const value = parseFloat(day.totalLiquidityUSD);
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
  }, [tokenDayDatas]);

  // const volumeDayData = useMemo(() => {
  //   let volumeByDay = {};
  //   for (const day of tokenDayDatas) {
  //     if (volumeByDay.hasOwnProperty(day.date)) {
  //       volumeByDay[day.date] =
  //         volumeByDay[day.date] + parseFloat(day.dailyVolumeUSD);
  //     } else {
  //       volumeByDay[day.date] = parseFloat(day.dailyVolumeUSD);
  //     }
  //   }

  //   let result = [];
  //   for (const date in volumeByDay) {
  //     result.push({ date: parseInt(date), value: volumeByDay[date] });
  //   }
  //   return result.sort((a, b) => b > a);
  // }, [tokenDayDatas]);

  const totalLiquidityUSD =
    parseFloat(token?.totalLiquidity) *
    parseFloat(token?.derivedETH) *
    parseFloat(bundles[0].ethPrice);

  const totalLiquidityUSDYesterday =
    parseFloat(token.oneDay?.totalLiquidity) *
    parseFloat(token.oneDay?.derivedETH) *
    parseFloat(oneDayAvaxPriceData?.ethPrice);

  const price = parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

  const priceYesterday =
    parseFloat(token.oneDay?.derivedETH) *
    parseFloat(oneDayAvaxPriceData?.ethPrice);

  const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

  const volume = token?.tradeVolumeUSD - token?.oneDay?.tradeVolumeUSD;
  const volumeYesterday =
    token?.oneDay?.tradeVolumeUSD - token?.twoDay?.tradeVolumeUSD;

  const txCount = token?.txCount - token?.oneDay?.txCount;
  const txCountYesterday = token?.oneDay?.txCount - token?.twoDay?.txCount;

  const fees = volume * FEE_RATE;
  const feesYesterday = volumeYesterday * FEE_RATE;

  return (
    <AppShell>
      <Head>
        <title>
          {currencyFormatter.format(price || 0)} | {token.symbol} |{" "}
          {process.env.NEXT_PUBLIC_APP_NAME}
          Analytics
        </title>
      </Head>
      <PageHeader>
        <AutoRow align="flex-end" pb={3} style={{ width: 'fit-content' }}>
          <TYPE.body>
            <NextLink href="/tokens">{'Tokens '}</NextLink>→ {token.symbol}
            {'  '}
          </TYPE.body>
          <Link
            style={{ width: 'fit-content', color: "rgb(120, 134, 134)" }}
            external
            href={'https://explorer.fuse.io/address/' + id}
          >
            <Typography style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
              ({token.id.slice(0, 8) + '...' + token.id.slice(36, 42)})
            </Typography>
          </Link>
        </AutoRow>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm="auto" className={classes.title}>
            <Box display="flex" alignItems="center" mt={2}>
              <TokenIcon id={token.symbol} width="40px" height="40px" />
              <Typography variant="h4" component="h1" noWrap>
                {token.name} ({token.symbol}){" "}
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-end" className={classes.price}>
              <Typography variant="h5" component="div">
                {currencyFormatter.format(price || 0)}
              </Typography>
              <Percent percent={priceChange} ml={1} />
            </Box>
          </Grid>
          <Grid item xs={12} sm="auto" className={classes.links}>
            <Link
              href={`https://app.voltage.finance/#/add/${token.id}/FUSE`}
              target="_blank"
              variant="body1"
            >
              Add Liquidity
            </Link>
            <Link
              href={`https://app.voltage.finance/trade`}
              target="_blank"
              variant="body1"
            >
              Trade
            </Link>
          </Grid>
        </Grid>
      </PageHeader>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container alignItems="stretch" spacing={1}>
            <Grid item xs={12}>
              <KPI
                className={classes.kpi}
                title="Total Liquidity"
                value={currencyFormatter.format(totalLiquidityUSD || 0)}
                difference={
                  ((totalLiquidityUSD - totalLiquidityUSDYesterday) /
                    totalLiquidityUSDYesterday) *
                  100
                }
              />
            </Grid>
            <Grid item xs={12}>
              <KPI
                className={classes.kpi}
                title="Volume (24hrs)"
                value={currencyFormatter.format(volume || 0)}
                difference={
                  ((volume - volumeYesterday) / volumeYesterday) * 100
                }
              />
            </Grid>
            <Grid item xs={12}>
              <KPI
                className={classes.kpi}
                title="Transactions (24hrs)"
                value={txCount}
                difference={((txCount - txCountYesterday) / txCountYesterday) * 100}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Paper
            variant="outlined"
            style={{ height: 300, position: "relative" }}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Liquidity"
                  data={liquidityDayData}
                  width={width}
                  height={height}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, position: "relative" }}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  title="Volume"
                  data={volumeDayData}
                  width={width}
                  height={height}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid> */}

        
      </Grid>
      <Box my={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          Top Pairs
        </Typography>
        <PairTable title="Pairs" pairs={pairs} />
      </Box>
      <Box my={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          Transactions
        </Typography>
        <Transactions transactions={transactions} txCount={token.dailyTxns} />
      </Box>

      <Box my={4}>
        <BasicTable
          title="Information"
          headCells={[
            { key: "name", label: "Name" },
            { key: "symbol", label: "Symbol" },
            { key: "address", label: "Address" },
            { key: "explorer", label: "Explorer", align: "right" },
          ]}
          bodyCells={[
            token.name,
            token.symbol,
            token.id,
            <Link href={`https://explorer.fuse.io/address/${token.id}`}>
              View
            </Link>,
          ]}
        />
      </Box>
    </AppShell>
  );
}

export async function getStaticProps({ params }) {
  const client = getApollo();

  const id = params.id.toLowerCase();

  await client.query({
    query: avaxPriceQuery,
  });

  await getToken(id, client);

  await client.query({
    query: tokenDayDatasQuery,
    variables: {
      tokens: [id],
    },
  });

  const { pairs0, pairs1 } = await getTokenPairs(id, client);

  const pairAddresses = [
    ...pairs0.map((pair) => pair.id),
    ...pairs1.map((pair) => pair.id),
  ].sort();

  // Transactions
  await client.query({
    query: transactionsQuery,
    variables: {
      pairAddresses,
    },
  });

  await getOneDayAvaxPrice(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export async function getStaticPaths() {
  const apollo = getApollo();

  const { data } = await apollo.query({
    query: tokenIdsQuery,
    variables: {
      first: 100,
    },
  });

  const paths = data.tokens.map(({ id }) => ({
    params: { id },
  }));

  return { paths, fallback: true };
}

export default TokenPage;
