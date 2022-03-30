import React from 'react'
import { useRouter } from 'next/router'
import { Box, makeStyles } from '@material-ui/core'

import { RowFixed } from '../Row';


const useStyles = makeStyles(() => ({
  root: {
    textDecoration: "none",
    zIndex: 10,
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function Title() {
  const classes = useStyles();
  const { push } = useRouter();

  return (
    <div className={classes.root} onClick={() => push('/')}>
      <Box display="flex" alignItems="center">
        <RowFixed>
          <img width="125px" style={{ marginLeft: '8px', paddingTop: '8px' }} src="/voltage-wordmark.svg" alt={process.env.NEXT_PUBLIC_APP_NAME || "logo"} />
        </RowFixed>
      </Box>
    </div>
  )
}
