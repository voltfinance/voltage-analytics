import gql from "graphql-tag";

const tradeVolumeFields = gql`
  fragment tradeVolumeFields on DailyVolume {
    id
    timestamp
    volume
  }
`;

export const dayDataStablesQuery = gql`
  query dayDataStablesQuery($first: Int! = 1000) {
    dailyVolumes(first: $first, orderBy: timestamp, orderDirection: desc) {
      ...tradeVolumeFields
      swap {
        id
        balances
      }
    }
  }
  ${tradeVolumeFields}
`;

export const swapFields = gql`
  fragment swapFields on Swap {
    id
    tokens {
      id
      decimals
    }
    balances
    dailyVolumes {
      ...tradeVolumeFields
    }
  }
  ${tradeVolumeFields}
`;

export const stablePairsQuery = gql`
  query stablePairsQuery($first: Int! = 1000) {
    swaps(first: $first) {
      ...swapFields
      oneDay @client
      sevenDay @client
    }
  }
  ${swapFields}
`;

export const stablePairsTimeTravelQuery = gql`
  query stablePairsTimeTravelQuery(
    $first: Int! = 1000
    $block: Block_height!
  ) {
    swaps(first: $first, block: $block) {
      ...swapFields
    }
  }
  ${swapFields}
`;
