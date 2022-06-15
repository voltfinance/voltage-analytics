import { AppShell, PairTable, Search } from "app/components";
import { getApollo, getPairs, pairsQuery, useInterval } from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

import { TYPE } from "../../theme";
import { Box, Grid } from "@material-ui/core";

function PairsPage() {
  const {
    data: { pairs },
  } = useQuery(pairsQuery);
  useInterval(getPairs, 1800000);
  return (
    <AppShell>
      <Head>
        <title>Pairs | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Grid container>
        <Grid item xs>
          <Box pb={3}>
            <TYPE.largeHeader>Top Pairs</TYPE.largeHeader>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Search placeholder="" pairs={pairs} />
        </Grid>
      </Grid>
      <PairTable title="Pairs" pairs={pairs} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  // Pairs
  await getPairs(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default PairsPage;
