import gql from "graphql-tag";

const tradeVolumeFields = gql`
  fragment tradeVolumeFields on TradeVolume {
    id
    timestamp
    volume
  }
`;

export const dailyVolumesQuery = gql`
  query dailyVolumesQuery($first: Int! = 1000) {
    dailyVolumes(first: $first, orderBy: timestamp, orderDirection: desc) {
      ...tradeVolumeFields
    }
  }
  ${tradeVolumeFields}
`;

export const dayDataStablesQuery = gql`
  query dailyDataQuery($first: Int! = 1000) {
    dailyVolumes(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      volume
      timestamp
      swap {
        balances
        tokens {
          id
          decimals
        }
      }
    }
  }
`
