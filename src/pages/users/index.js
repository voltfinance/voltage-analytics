import {
  AppShell,
  KPI,
  Link,
  Loading,
  PageHeader,
  PairIcon,
  Search
} from "app/components";
import {
  Avatar,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import {
  barUserQuery,
  currencyFormatter,
  decimalFormatter,
  avaxPriceQuery,
  formatCurrency,
  getApollo,
  getBarUser,
  getAvaxPrice,
  getLatestBlock,
  getPairs,
  getPoolUser,
  getJoeToken,
  latestBlockQuery,
  pairsQuery,
  poolUserQuery,
  tokenQuery,
  TOP_LPS_PER_PAIRS,
  useApollo
} from "app/core";

import Head from "next/head";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { VOLT_TOKEN_ADDRESS } from "config";
import LPList from "components/LPList";
import { useEffect, useMemo, useState } from "react";
import { TYPE } from "app/theme";
import { RowBetween } from "components/Row";
import AccountSearch from "components/AccountSearch";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontSize: 14,
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function UsersPage(props) {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }
  const classes = useStyles();

  const {
    data: { pairs },
  } = useQuery(pairsQuery);
  const allPairs = useMemo(() => {
    return pairs.reduce((acc, pair) => ({
      ...acc,
      [pair.id]: pair,
    }), {});
  });
  const client = useApollo();

  const [topLps, setTopLps] = useState();
  useEffect(() => {
    async function fetchData() {
      // get top 20 by reserves
      let topPairs = Object.keys(allPairs)
        ?.sort((a, b) => parseFloat(allPairs[a].reserveUSD > allPairs[b].reserveUSD ? -1 : 1))
        .map((pair) => pair);

      let topLpLists = await Promise.all(
        topPairs.map(async (pair) => {
          // for each one, fetch top LPs
          try {
            const { data: results } = await client.query({
              query: TOP_LPS_PER_PAIRS,
              variables: {
                pair: pair.toString(),
              },
              fetchPolicy: 'cache-first',
            })
            if (results) {
              return results.liquidityPositions
            }
          } catch (e) {}
        })
      );

      // get the top lps from the results formatted
      const lps = []
      topLpLists
        .filter((i) => !!i) // check for ones not fetched correctly
        .map((list) => {
          return list.map((entry) => {
            const pairData = allPairs[entry.pair.id]
            return lps.push({
              user: entry.user,
              pairName: pairData.token0.symbol + '-' + pairData.token1.symbol,
              pairAddress: entry.pair.id,
              token0: pairData.token0.id,
              token1: pairData.token1.id,
              usd:
                (parseFloat(entry.liquidityTokenBalance) / parseFloat(pairData.totalSupply)) *
                parseFloat(pairData.reserveUSD),
            })
          })
        });
      
      // TODO: workaround to handle duplicated LP entries, needs to be optimized
      const userPositions = lps.reduce((acc, entry) => {
        if (acc[`${entry.user.id}-${entry.pairName}`]) return acc;
        acc[`${entry.user.id}-${entry.pairName}`] = entry;
        return acc;
      }, {});

      const sorted = Object.values(userPositions).sort((a, b) => (a.usd > b.usd ? -1 : 1))
      const shorter = sorted.splice(0, 100)
      setTopLps(shorter)
    }

    if (!topLps && allPairs && Object.keys(allPairs).length > 0) {
      fetchData()
    }
  }, [topLps, allPairs]);

  // Global

  // const originalInvestments =
  //   parseFloat(barData?.user?.joeStakedUSD) + parseFloat(poolEntriesUSD);

  return (
    <AppShell>
      <Head>
        <title>Accounts | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      <PageHeader>
        <Box mb={4}>
          <TYPE.largeHeader>Wallet analytics</TYPE.largeHeader>
        </Box>
        <AccountSearch />
      
      </PageHeader>
      <PageHeader>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          Top Liquidity Positions
        </Typography>
        <Box padding={1}>
          <LPList lps={topLps} maxItems={100} />
        </Box>
      </PageHeader>
    </AppShell>
  );
}

export async function getStaticProps({ params }) {
  const client = getApollo();


  await getAvaxPrice(client);

  await getJoeToken(client);

  await getPairs(client);

  await getLatestBlock(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export async function getStaticPaths() {
  // const client = getApollo();

  // const { data: { users } } = await client.query({
  //   query: userIdsQuery,
  // });

  // const paths = users.map(user => ({
  //   params: { id: user.id }
  // }));

  return { paths: [], fallback: true };
}

export default UsersPage;
