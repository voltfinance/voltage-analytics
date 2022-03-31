import React, { useState, useEffect } from 'react';
import { makeStyles, useMediaQuery } from '@material-ui/core';
import styled from 'styled-components';

import { TYPE } from '../../theme';
import { Link } from '..';

const Polling = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  background-color: green;
`

const useStyles = makeStyles((theme) => ({
  polling: {
    position: "fixed",
    display: "flex",
    left: 0,
    bottom: 0,
    padding: "1rem",
    marginLeft: theme.spacing(1),
    color: "white",
    opacity: 0.4,
    transition: "opacity 0.25s ease",
    "&:hover": {
      opacity: 1,
    }
  },
  dot: {
    width: "8px",
    height: "8px",
    minHeight: "8px",
    minWidth: "8px",
    marginRight: "0.5rem",
    marginTop: "3px",
    borderRadius: "50%",
    backgroundColor: "green",
  },
}));

function SideNavTimer() {
  const classes = useStyles();

  const below1180 = useMediaQuery('(max-width: 1180px)')
  const seconds = useSessionStart()

  return (
    !below1180 && (
      <div className={classes.polling}>
        <div className={classes.dot} />
        <Link href="/" color="inherit">
          <TYPE.small style={{ color: "white"}}>
            Updated {!!seconds ? seconds + 's' : '-'} ago <br />
          </TYPE.small>
        </Link>
      </div>
    )
  )
}

function useSessionStart() {
  const [sessionStart, ] = useState(Date.now());
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds(seconds => seconds === 5 ? 0 : seconds + 1);
    }, 1000);

    return () => clearInterval(interval)
  }, []);

  return seconds;
}

export default SideNavTimer
