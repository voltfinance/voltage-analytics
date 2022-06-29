import { AppShell, TokenTable } from "app/components";
import {
  fusePriceQuery,
  getApollo,
  getOneDayFusePrice,
  getTokens,
  tokensQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

function TokensPage() {
  const {
    data: { tokens },
  } = useQuery(tokensQuery);

  useInterval(async () => {
    await Promise.all([getTokens, getOneDayFusePrice]);
  }, 1800000);

  return (
    <AppShell>
      <Head>
        <title>Tokens | Voltage Analytics</title>
      </Head>
      <TokenTable title="Tokens" tokens={tokens} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  await client.query({
    query: fusePriceQuery,
  });

  await getOneDayFusePrice(client);

  await getTokens(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default TokensPage;
