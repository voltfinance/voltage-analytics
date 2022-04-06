import React from 'react'
import { RowFixed, RowBetween } from './Row'

import { TYPE } from '../theme'
import { makeStyles, useMediaQuery } from '@material-ui/core'

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  let num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0), true)
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  // if (num > 1000) {
  //   return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num).toFixed(0)).toLocaleString()
  // }

  // if (usd) {
  //   if (num < 0.1) {
  //     return formatDollarAmount(num, 6)
  //   } else {
  //     return formatDollarAmount(num, 2)
  //   }
  // }

  return Number(parseFloat(num).toFixed(5)).toLocaleString()
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    position: "sticky",
    top: 0,
  },
  medium: {
    fontWeight: 500,
  }
}));
const localNumber = num => num;

export default function GlobalStats(props) {
  const classes = useStyles();

  const below1295 = useMediaQuery('(max-width: 1295px)')
  const below1180 = useMediaQuery('(max-width: 1180px)')
  const below1024 = useMediaQuery('(max-width: 1024px)')
  const below400 = useMediaQuery('(max-width: 400px)')
  const below816 = useMediaQuery('(max-width: 816px)')

  // const [showPriceCard, setShowPriceCard] = useState(false)

  const { oneDay, pairCount } = props.factory;
  const { totalVolumeUSD: oneDayVolumeUSD, txCount: oneDayTxns } = oneDay;
  const oneDayFees = oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD * 0.003, true) : ''

  return (
    <div className={classes.root}>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>

          {!below1180 && (
            <TYPE.main mr={'1rem'}>
              Transactions (24H): <div className={classes.medium}>{localNumber(oneDayTxns)}</div>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={'1rem'}>
              Pairs: <div className={classes.medium}>{localNumber(pairCount)}</div>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={'1rem'}>
              Fees (24H): <div className={classes.medium}>{oneDayFees}</div>&nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </div>
  )
}
