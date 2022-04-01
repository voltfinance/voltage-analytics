import { Box, Paper } from "@material-ui/core";
import Link from "./Link";
import { PAIR_DENY } from "app/core/constants";
import PairIcon from "./PairIcon";
import Percent from "./Percent";
import React from "react";
import SortableTable from "./SortableTable";
import { currencyFormatter } from "app/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {},
  icons: {
    width: "24px",
    height: "24px"
  }
}));

export default function PairTable({ pairs, title, ...rest }) {
  const classes = useStyles();

  const rows = pairs
    .filter((row) => {
      return !PAIR_DENY.includes(row.id);
    })
    .map((pair) => {
      const volumeUSD =
        pair?.volumeUSD === "0" ? pair?.untrackedVolumeUSD : pair?.volumeUSD;

      const oneDayVolumeUSD =
        pair?.oneDay?.volumeUSD === "0"
          ? pair?.oneDay?.untrackedVolumeUSD
          : pair?.oneDay?.volumeUSD;

      const sevenDayVolumeUSD =
        pair?.sevenDay?.volumeUSD === "0"
          ? pair?.sevenDay?.untrackedVolumeUSD
          : pair?.sevenDay?.volumeUSD;

      const FEE_RATE = 0.0025;
      const oneDayVolume = volumeUSD - oneDayVolumeUSD;
      const oneDayFees = oneDayVolume * FEE_RATE;
      const oneYearFeesAPR = (oneDayFees * 365 * 100) / pair.reserveUSD;
      const sevenDayVolume = volumeUSD - sevenDayVolumeUSD;
      const sevenDayFees = sevenDayVolume * FEE_RATE;

      return {
        ...pair,
        displayName: `${pair.token0.symbol}-${pair.token1.symbol}`,
        oneDayVolume: !Number.isNaN(oneDayVolume) ? oneDayVolume : 0,
        sevenDayVolume: !Number.isNaN(sevenDayVolume) ? sevenDayVolume : 0,
        oneDayFees: !Number.isNaN(oneDayFees) ? oneDayFees : 0,
        sevenDayFees: !Number.isNaN(sevenDayFees) ? sevenDayFees : 0,
        oneYearFeesAPR,
      };
    });

  return (
    <Paper variant="outlined" className={classes.root}>
      <SortableTable
        orderBy="reserveUSD"
        {...rest}
        columns={[
          {
            key: "displayName",
            numeric: false,
            render: (row) => (
              <Box display="flex" alignItems="center">
                <PairIcon base={row.token0.symbol} quote={row.token1.symbol} />
                <Link href={`/pairs/${row.id}`} variant="body2" noWrap>
                  {row.displayName}
                </Link>
              </Box>
            ),
            label: "Name",
          },
          {
            key: "reserveUSD",
            render: (row) => currencyFormatter.format(row.reserveUSD),
            align: "right",
            label: "Liquidity",
          },
          {
            key: "oneDayVolume",
            render: (row) => currencyFormatter.format(row.oneDayVolume),
            align: "right",
            label: "Volume (24h)",
          },
          {
            key: "sevenDayVolume",
            render: (row) => currencyFormatter.format(row.sevenDayVolume),
            align: "right",
            label: "Volume (7d)",
          },
          {
            key: "oneDayFees",
            render: (row) => currencyFormatter.format(row.oneDayFees),
            align: "right",
            label: "Fees (24h)",
          },
          {
            key: "sevenDayFees",
            render: (row) => currencyFormatter.format(row.sevenDayFees),
            align: "right",
            label: "Fees (7d)",
          },
          {
            key: "oneYearFees",
            render: (row) => <Percent percent={row.oneYearFeesAPR} />,
            align: "right",
            label: "Fees (Yearly)",
          },
        ]}
        rows={rows}
      />
    </Paper>
  );
}
