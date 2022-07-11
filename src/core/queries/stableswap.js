import gql from "graphql-tag";

const tradeVolumeFields = gql`
  fragment tradeVolumeFields on DailyVolume {
    id
    timestamp
    volume
  }
`;

export const dayDataStablesQuery = gql`
  query dayDataStablesQuery($first: Int! = 1000, $pair: Bytes!) {
    dailyVolumes(first: $first, orderBy: timestamp, orderDirection: desc, where: { swap_contains: $pair }) {
      ...tradeVolumeFields
      swap {
        balances
      }
    }
  }
  ${tradeVolumeFields}
`

export const swapFields = gql`
  fragment swapFields on Swap {
    id
    balances
    dailyVolumes {
      ...tradeVolumeFields
    }
  }
  ${tradeVolumeFields}
`;
