import { WavesOutlined } from "@material-ui/icons";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import {
  TrendingUp,
  List as ListIcon,
  PieChart,
  Disc,
  Zap,
} from "react-feather";
import clsx from "clsx";
import { transparentize } from "polished";
import { useReactiveVar } from "@apollo/client";

import Title from "./Title";
import { AutoColumn } from "./Column";
import { BasicLink } from "./Link";
import { darkModeVar } from "app/core";
import Toggle from "./Toggle";
import SideNavTimer from "./SideNavTimer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: transparentize(0.4, theme.palette.background.default),
    background: "linear-gradient(193.68deg, #1b1c22 0.68%, #000000 100.48%)",
    height: "100vh",
  },
  desktopWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
  },
  list: {
    // "& > *": {
    //   paddingLeft: theme.spacing(3),
    // },
  },
  listItem: {
    color: theme.palette.common.white,
    opacity: 0.6,
    "&.MuiListItem-root": {
      padding: theme.spacing(0, 0),
      backgroundColor: "transparent",
      "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: "transparent",
        opacity: 1,
      },
      "&:hover": {
        opacity: 1,
      },
    },
  },
  nested: {
    marginLeft: theme.spacing(3),
  },
  mt2: { marginTop: theme.spacing(2) },
  mt3: { marginTop: theme.spacing(3) },
  mb8: { marginBottom: theme.spacing(8) },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  title: {
    padding: theme.spacing(1),
  },
  linkText: {
    marginRight: "0.75rem",
    fontSize: "0.825rem",
    fontWeight: 500,
    display: "inline-box",
    opacity: 0.8,
    "&:hover": {
      opacity: 1,
    },
    "& > a": {
      color: "white",
    },
  },
  dialogContent: {
    text: "white",
  },
  dialogField: {
    '& label.Mui-focused': {
      color: theme.palette.text.primary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.text.primary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.text.primary,
      },
    },
  },
}));

export default function AppNavigation() {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [address, setAddress] = React.useState("");

  const darkMode = useReactiveVar(darkModeVar);
  function onToggleDarkMode() {
    const value = !darkModeVar();
    setIsActive(value);
    darkModeVar(value);
    if (!value) {
      document.documentElement.classList.remove(["dark-theme"]);
      // document.documentElement.style.background = "#fafafa";
      document.documentElement.style.color = "rgba(0, 0, 0, 0.87)";
      // document.body.style.background = "#fafafa";
      // document.body.style.color = "rgba(0, 0, 0, 0.87)";
    } else {
      document.documentElement.classList.add(["dark-theme"]);
      // document.documentElement.style.background = "#303030";
      document.documentElement.style.color = "#FFFFFF";
      // document.body.style.background = "#303030";
      // document.body.style.color = "#FFFFFF";
    }
    // Last
    localStorage.setItem("darkMode", value);
  }
  // avoid SSR warnings when differing client to server state
  const [isActive, setIsActive] = useState(darkMode || true);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <div className={classes.root}>
      <div className={classes.desktopWrapper}>
        <AutoColumn gap="1rem" className={clsx(classes.nested, classes.mt3)}>
          <Title />

          <AutoColumn gap="1.25rem" className={classes.mt2}>
            <ListItem
              key="/"
              button
              className={classes.listItem}
              selected={router.pathname === "/"}
              onClick={() => router.push("/")}
            >
              <TrendingUp size={20} style={{ marginRight: ".75rem" }} />
              Overview
            </ListItem>

            <ListItem
              key="/tokens"
              button
              className={classes.listItem}
              selected={router.pathname.includes("tokens")}
              onClick={() => router.push("/tokens")}
            >
              <Disc size={20} style={{ marginRight: ".75rem" }} />
              Tokens
            </ListItem>

            <ListItem
              key="/pairs"
              button
              className={classes.listItem}
              selected={router.pathname === "/pairs"}
              onClick={() => router.push("/pairs")}
            >
              <PieChart size={20} style={{ marginRight: ".75rem" }} />
              Pairs
            </ListItem>

            <ListItem
              key="/pools"
              button
              className={classes.listItem}
              selected={router.pathname === "/pools"}
              onClick={() => router.push("/pools")}
            >
              <WavesOutlined
                style={{
                  marginRight: ".75rem",
                  width: "20px",
                  height: "20px",
                }}
              />
              Pools
            </ListItem>

            <ListItem
              key="/stake"
              button
              className={classes.listItem}
              selected={router.pathname === "/stake"}
              onClick={() => router.push("/stake")}
            >
              <Zap size={20} style={{ marginRight: ".75rem" }} />
              Stake
            </ListItem>

            {/* <ListItem
              button
              className={classes.listItem}
              key="/lending"
              selected={router.pathname.includes("/lending")}
              onClick={() => router.push("/lending")}
            >
              <AccountBalanceOutlined
                style={{
                  marginRight: ".75rem",
                  width: "20px",
                  height: "20px",
                }}
              />
              Lending
            </ListItem> */}

            <ListItem
              button
              className={classes.listItem}
              key="/portfolio"
              selected={router.pathname.includes("/portfolio")}
              onClick={() => {
                const defaultAddress = localStorage.getItem("defaultAddress");
                if (defaultAddress) {
                  router.push("/users/" + defaultAddress);
                } else {
                  handleClickOpen();
                }
              }}
            >
              <ListIcon size={20} style={{ marginRight: ".75rem" }} />
              Portfolio
            </ListItem>
          </AutoColumn>
        </AutoColumn>
        <AutoColumn gap="0.5rem" className={clsx(classes.nested, classes.mb8)}>
          <div className={classes.linkText}>
            <BasicLink href="https://voltage.finance" target="_blank">
              Voltage
            </BasicLink>
          </div>
          <div className={classes.linkText}>
            <BasicLink href="https://docs.voltage.finance" target="_blank">
              Docs
            </BasicLink>
          </div>
          <div className={classes.linkText}>
            <BasicLink
              href="https://discord.com/invite/voltagefinance"
              target="_blank"
            >
              Discord
            </BasicLink>
          </div>
          <div className={classes.linkText}>
            <BasicLink href="https://twitter.com/voltfinance" target="_blank">
              Twitter
            </BasicLink>
          </div>
          <div className={classes.linkText}>
            <BasicLink href="https://t.me/voltage_finance" target="_blank">
              Telegram
            </BasicLink>
          </div>
          <Toggle isActive={isActive} toggle={onToggleDarkMode} />
        </AutoColumn>
      </div>
      <SideNavTimer />
      <Dialog
        maxWidth="sm"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Portfolio</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            Enter an address and click load.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            color="textPrimary"
            className={classes.dialogField}
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="textPrimary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("defaultAddress", address);
              router.push("/users/" + address);
              handleClose();
            }}
            color="textPrimary"
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
