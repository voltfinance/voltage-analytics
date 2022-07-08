import { getApollo } from "../apollo";
import { dayDataStablesQuery } from "../queries/stableswap";

export async function getDayDataStables(client = getApollo()) {
  const { data } = await client.query({
    query: dayDataStablesQuery,
    context: {
      clientName: "stableswap",
    },
  });

  await client.cache.writeQuery({
    query: dayDataStablesQuery,
    data,
  });

  return await client.cache.readQuery({
    query: dayDataStablesQuery,
  });
}