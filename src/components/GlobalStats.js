import React from "react";
import { RowFixed, RowBetween } from "./Row";

import { TYPE } from "../theme";
import { makeStyles, useMediaQuery } from "@material-ui/core";
import { formatCurrency, formatDecimal } from "app/core";
import useSupplyStats from "core/hooks/useSupplyStats";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "sticky",
    top: 0,
  },
  medium: {
    fontWeight: 500,
  },
}));

export default function GlobalStats(props) {
  const classes = useStyles();

  const below1295 = useMediaQuery("(max-width: 1295px)");
  const below1180 = useMediaQuery("(max-width: 1180px)");
  const below1024 = useMediaQuery("(max-width: 1024px)");
  const below816 = useMediaQuery("(max-width: 816px)");

  const [{ circSupply, totalSupply }] = useSupplyStats();

  const { oneDay, pairCount, totalVolumeUSD, txCount } = props.factory;
  const { totalVolumeUSD: oneDayVolumeUSD, txCount: oneDayTxCount } = oneDay;
  const oneDayTxns = txCount && oneDayTxCount ? parseFloat(txCount) - parseFloat(oneDayTxCount) : "";
  const oneDayFees = totalVolumeUSD && oneDayVolumeUSD
    ? formatCurrency((parseFloat(totalVolumeUSD) - parseFloat(oneDayVolumeUSD)) * 0.003)
    : "";

  return (
    <div className={classes.root}>
      <RowBetween style={{ padding: below816 ? "0.5rem" : ".5rem" }}>
        <RowFixed>
          {circSupply && totalSupply && (
            <>
              <TYPE.main mr="1rem">
                Circ. Supply:{" "}
                <span className={classes.medium}>{formatDecimal(circSupply)}</span>
              </TYPE.main>
              <TYPE.main mr="1rem">
                Total Supply:{" "}
                <span className={classes.medium}>{formatDecimal(totalSupply)}</span>
              </TYPE.main>
            </>
          )}
          {!below1180 && (
            <TYPE.main mr={"1rem"}>
              Transactions (24H):{" "}
              <span className={classes.medium}>{formatDecimal(oneDayTxns)}</span>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={"1rem"}>
              Pairs:{" "}
              <span className={classes.medium}>{pairCount}</span>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={"1rem"}>
              Fees (24H): <span className={classes.medium}>{oneDayFees}</span>
              &nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </div>
  );
}
