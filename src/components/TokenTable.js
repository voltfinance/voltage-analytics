import { Box, Typography } from "@material-ui/core";
import { Sparklines, SparklinesLine } from "react-sparklines";
import {
  avaxPriceQuery,
  oneDayAvaxPriceQuery,
  sevenDayAvaxPriceQuery,
} from "app/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Link from "./Link";
import Percent from "./Percent";
import React from "react";
import SortableTable from "./SortableTable";
import { TOKEN_DENY } from "app/core/constants";
import TokenIcon from "./TokenIcon";
import { currencyFormatter } from "app/core";
import { useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function TokenTable({ tokens, title }) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    data: { bundles },
  } = useQuery(avaxPriceQuery, {
    pollInterval: 1800000,
  });

  const { data: oneDayAvaxPriceData } = useQuery(oneDayAvaxPriceQuery);
  const { data: sevenDayAvaxPriceData } = useQuery(sevenDayAvaxPriceQuery);
  const rows = tokens
    .filter(({ id }) => {
      return !TOKEN_DENY.includes(id);
    })
    .map((token) => {  
      const price =
        parseFloat(token.derivedETH) * parseFloat(bundles[0]?.ethPrice);

      const priceYesterday =
        parseFloat(token.oneDay?.derivedAVAX) *
        parseFloat(oneDayAvaxPriceData?.ethPrice);

      const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

      const priceLastWeek =
        parseFloat(token.sevenDay?.derivedAVAX) *
        parseFloat(sevenDayAvaxPriceData?.ethPrice);

      const sevenDayPriceChange =
        ((price - priceLastWeek) / priceLastWeek) * 100;

      const liquidityUSD =
        parseFloat(token?.totalLiquidity) *
        parseFloat(token?.derivedETH) *
        parseFloat(bundles[0]?.ethPrice);

      const volumeYesterday = token.tradeVolumeUSD - token.oneDay?.volumeUSD;

      return {
        ...token,
        price,
        priceYesterday: !Number.isNaN(priceYesterday) ? priceYesterday : 0,
        priceChange,
        liquidityUSD: liquidityUSD || 0,
        volumeYesterday: !Number.isNaN(volumeYesterday) ? volumeYesterday : 0,
        sevenDayPriceChange,
      };
    });

  return (
    <div className={classes.root}>
      <SortableTable
        title={title}
        orderBy="liquidityUSD"
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row, index) => (
              <Box display="flex" alignItems="center">
                <TokenIcon id={row.symbol} />
                <Link href={`/tokens/${row.id}`}>
                  <Typography variant="body2" noWrap>
                    {row.name}
                  </Typography>
                </Link>
              </Box>
            ),
          },
          {
            key: "liquidityUSD",
            align: "right",
            label: "Liquidity",
            render: (row) => currencyFormatter.format(row.liquidityUSD),
          },
          {
            key: "volumeYesterday",
            align: "right",
            label: "Volume (24h)",
            render: (row) => currencyFormatter.format(row.volumeYesterday),
          },
          {
            key: "price",
            align: "right",
            label: "Price",
            render: (row) => currencyFormatter.format(row.price),
          },
          {
            key: "priceChange",
            align: "right",
            render: (row) => <Percent percent={row.priceChange} />,
            label: "24h",
          },
          {
            key: "sevenDayPriceChange",
            align: "right",
            render: (row) => <Percent percent={row.sevenDayPriceChange} />,
            label: "7d",
          },
          // {
          //   key: "symbol",
          //   label: "Symbol",
          // },
          {
            key: "lastSevenDays",
            align: "right",
            label: "Last 7 Days",
            render: (row) => (
              <Sparklines
                data={row.tokenDayData.map((d) => d.priceUSD)}
                limit={7}
                svgWidth={160}
                svgHeight={30}
              >
                <SparklinesLine
                  style={{
                    strokeWidth: 3,
                    stroke:
                      row.sevenDayPriceChange > 0
                        ? theme.palette.positive.main
                        : row.sevenDayPriceChange < 0
                        ? theme.palette.negative.main
                        : "currentColor",
                    fill: "none",
                  }}
                />
              </Sparklines>
            ),
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
