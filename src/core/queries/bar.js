import gql from "graphql-tag";
import { BAR_ADDRESS } from "../../config/index.ts";

export const barQuery = gql`
  query barQuery($id: String! = "${BAR_ADDRESS}") {
    bar(id: $id) {
      id
      totalSupply
      ratio
      xVoltMinted
      xVoltBurned
      voltStaked
      voltStakedUSD
      voltHarvested
      voltHarvestedUSD
      xVoltAge
      xVoltAgeDestroyed
    }
  }
`;

// JOE launched on 2021/07/03
// We called first staking around 2021/07/05
// We filter dates to avoid weird numbers
export const barHistoriesQuery = gql`
  query barHistoriesQuery {
    histories(first: 1000, where:{ date_gte: 1625616000}) {
      id
      date
      timeframe
      voltStaked
      voltStakedUSD
      voltHarvested
      voltHarvestedUSD
      xVoltAge
      xVoltAgeDestroyed
      xVoltMinted
      xVoltBurned
      xVoltSupply
      ratio
    }
  }
`;

export const barUserQuery = gql`
  query barUserQuery($id: String!) {
    user(id: $id) {
      id
      volt {
        totalSupply
        voltStaked
      }
      xVolt
      voltStaked
      voltStakedUSD
      voltHarvested
      voltHarvestedUSD
      xVoltIn
      xVoltOut
      xVoltOffset
      xVoltMinted
      xVoltBurned
      voltIn
      voltOut
      usdIn
      usdOut
      updatedAt
      # createdAt
      # createdAtBlock
    }
  }
`;
