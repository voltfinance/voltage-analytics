import React from "react";
import styled from "styled-components";
import { Sun, Moon } from "react-feather";
import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "fit-content",
    cursor: "pointer",
    textDecoration: "none",
    marginTop: theme.spacing(2),
    color: "white",
    "&:hover": {
      textDecoration: "none",
    },
  },
  iconWrapper: {
    color: "inherit",
    opacity: 0.4,
    "&:hover": {
      opacity: 1,
    }
  },
  active: {
    opacity: 0.8,
  }
}));

// export interface ToggleProps {
//   isActive: boolean
//   toggle: () => void
// }

export default function Toggle({ isActive, toggle }) {
  const classes = useStyles();
  return (
    <div className={classes.root} onClick={toggle}>
      <div className={clsx(classes.iconWrapper, { [classes.active]: !isActive })}>
        <Sun size={20} />
      </div>
      <Typography style={{ padding: "0 .5rem" }} color="inherit">
        {" / "}
      </Typography>
      <div className={clsx(classes.iconWrapper, { [classes.active]: isActive })}>
        <Moon size={20} />
      </div>
    </div>
  );
}
