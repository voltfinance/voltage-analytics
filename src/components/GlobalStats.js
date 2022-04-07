import React from 'react'
import { RowFixed, RowBetween } from './Row'

import { TYPE } from '../theme'
import { makeStyles, useMediaQuery } from '@material-ui/core'
import { formatCurrency } from 'app/core'

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
  const below816 = useMediaQuery('(max-width: 816px)')

  // const [showPriceCard, setShowPriceCard] = useState(false)

  const { oneDay, pairCount } = props.factory;
  const { totalVolumeUSD: oneDayVolumeUSD, txCount: oneDayTxns } = oneDay;
  const oneDayFees = oneDayVolumeUSD ? formatCurrency(oneDayVolumeUSD * 0.003) : ''

  return (
    <div className={classes.root}>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>
          {!below1180 && (
            <TYPE.main mr={'1rem'}>
              Transactions (24H): <span className={classes.medium}>{localNumber(oneDayTxns)}</span>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={'1rem'}>
              Pairs: <span className={classes.medium}>{localNumber(pairCount)}</span>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={'1rem'}>
              Fees (24H): <span className={classes.medium}>{oneDayFees}</span>&nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </div>
  )
}
