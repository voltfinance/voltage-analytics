import React, { useState, useEffect } from 'react'
// import dayjs from 'dayjs'
// import LocalLoader from '../LocalLoader'
// import utc from 'dayjs/plugin/utc'
import styled from 'styled-components'
import { Box, useMediaQuery, withStyles, makeStyles } from '@material-ui/core';

import { CustomLink } from '../Link'
// import { formattedNum } from '../../utils'
import { TYPE } from '../../theme'
import { RowFixed } from '../Row'
import { PairIcon } from '..';
import { formatCurrency } from 'app/core';

// dayjs.extend(utc)

const useButtonStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    marginBottom: "0.5em",
  }
}));

const PageButtons = ({ children }) => {
  const classes = useButtonStyles();
  return <div className={classes.root}>{children}</div>;
};

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = withStyles(() => ({
  root: {
    "-webkit-overflow-scrolling": "touch"
  }
}))(Box);

const useStyles = makeStyles(theme => ({
  root: {
    display: "grid",
    "grid-gap": "1em",
    "grid-template-columns": "10px 1.5fr 1fr 1fr",
    "grid-template-areas": 'number name pair value',
    padding: theme.spacing(0, 0.5),
    "& > *": {
      "justify-content": "flex-end",
    },
  
    "@media screen and (max-width: 1080px)": {
      "grid-template-columns": "10px 1.5fr 1fr 1fr",
      "grid-template-areas": 'number name pair value',
    },
  
    "@media screen and (max-width: 600px)": {
      "grid-template-columns": "1fr 1fr 1fr",
      "grid-template-areas": 'name pair value',
    }
  }
}))

const DashGrid = ({ children, ...props }) => {
  const classes = useStyles();
  return <div className={classes.root} {...props}>{children}</div>
}

const Flex = ({ children }) => {
  return <Box display="flex">{children}</Box>
}

const Text = withStyles(() => ({
  alignItems: "center",
  textAlign: "center",
  color: "white",
  "& > *": {
    fontSize: "14px",
  },
  "@media screen and (max-width: 600px)": {
    fontSize: "13px",
  }
}))(Flex);

function LPList({ lps, maxItems = 10 }) {
  const below600 = useMediaQuery('(max-width: 600px)')
  const below800 = useMediaQuery('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} focus={true}>
        {!below600 && (
          <Text area="number" fontWeight="500">
            {index}
          </Text>
        )}
        <Text area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink style={{ marginLeft: below600 ? 0 : '1rem', whiteSpace: 'nowrap' }} to={'/account/' + lp.user.id}>
            {below800 ? lp.user.id.slice(0, 4) + '...' + lp.user.id.slice(38, 42) : lp.user.id}
          </CustomLink>
        </Text>

        {/* {!below1080 && (
          <Text area="type" justifyContent="flex-end">
            {lp.type}
          </Text>
        )} */}

        <Text>
          <CustomLink area="pair" to={'/pair/' + lp.pairAddress}>
            <RowFixed>
              {!below600 && <PairIcon base={lp.token0} quote={lp.token1} size={16} margin={true} />}
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </Text>
        <Text area="value">{formatCurrency(lp.usd)}</Text>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp, index) => {
      return (
        <div key={index}>
          <ListItem key={index} index={(page - 1) * 10 + index + 1} lp={lp} />
          <br />
        </div>
      )
    })

  return (
    <div>
      <DashGrid center={true} style={{ height: 'fit-content', padding: ' 0 0 1rem 0' }}>
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TYPE.main area="number">#</TYPE.main>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
          <TYPE.main area="name">Account</TYPE.main>
        </Flex>
        {/* {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <TYPE.main area="type">Type</TYPE.main>
          </Flex>
        )} */}
        <Flex alignItems="center" justifyContent="flexEnd">
          <TYPE.main area="pair">Pair</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <TYPE.main area="value">Value</TYPE.main>
        </Flex>
      </DashGrid>
      <br />
      <List p={0}>{!lpList ? <span>loading...</span> : lpList}</List>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </div>
  )
}

export default LPList;
