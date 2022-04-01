import { AppShell, TokenTable } from "app/components";
import {
  avaxPriceQuery,
  getApollo,
  getOneDayAvaxPrice,
  getTokens,
  tokensQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

import { TYPE } from "../../theme";
import { Box } from "@material-ui/core";

function TokensPage() {
  const {
    data: { tokens },
  } = useQuery(tokensQuery);

  useInterval(async () => {
    await Promise.all([getTokens, getOneDayAvaxPrice]);
  }, 1800000);

  return (
    <AppShell>
      <Head>
        <title>Tokens | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box pb={3}>
        <TYPE.largeHeader>Top Tokens</TYPE.largeHeader>
      </Box>
      <TokenTable title="Tokens" tokens={tokens} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  await client.query({
    query: avaxPriceQuery,
  });

  await getOneDayAvaxPrice(client);

  await getTokens(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default TokensPage;
