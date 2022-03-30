import {
  AccountTreeOutlined,
  AppsOutlined,
  Brightness4,
  Brightness4Outlined,
  Brightness7,
  Brightness7Outlined,
  CloseOutlined,
  DashboardOutlined,
  DetailsOutlined,
  ExpandLess,
  ExpandMore,
  FastfoodOutlined,
  FiberNewOutlined,
  HistoryOutlined,
  LinkOutlined,
  ListAltOutlined,
  Menu,
  MoneyOutlined,
  RadioButtonUncheckedOutlined,
  ReorderOutlined,
  SettingsEthernetOutlined,
  StarBorder,
  TrendingDownOutlined,
  TrendingUpOutlined,
  ViewStreamOutlined,
  WavesOutlined,
  AccountBalanceOutlined,
} from "@material-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  TrendingUp,
  List as ListIcon,
  PieChart,
  Disc,
  Zap,
} from "react-feather";
import { transparentize } from "polished";
import { useReactiveVar } from "@apollo/client";

import Joe from "./Joe";

import Title from "./Title";
import { AutoColumn } from "./Column";
import { BasicLink } from "./Link";
import { darkModeVar } from "app/core";
import Toggle from "./Toggle";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: transparentize(0.4, theme.palette.background.default),
    background: "linear-gradient(193.68deg, #1b1c22 0.68%, #000000 100.48%)",
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
    paddingLeft: theme.spacing(3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  title: {
    padding: theme.spacing(1),
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

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <div className={classes.root}>
      <DesktopWrapper>
        <AutoColumn
          gap="1rem"
          style={{ marginLeft: theme.spacing(3), marginTop: theme.spacing(4) }}
        >
          <Title />

          <AutoColumn gap="1.25rem" style={{ marginTop: "1rem" }}>
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
        <AutoColumn
          gap="0.5rem"
          style={{ marginLeft: theme.spacing(3), marginBottom: "4rem" }}
        >
          <HeaderText>
            <BasicLink href="https://voltage.finance" target="_blank">
              Voltage
            </BasicLink>
          </HeaderText>
          <HeaderText>
            <BasicLink href="https://docs.voltage.finance" target="_blank">
              Docs
            </BasicLink>
          </HeaderText>
          <HeaderText>
            <BasicLink
              href="https://discord.com/invite/voltagefinance"
              target="_blank"
            >
              Discord
            </BasicLink>
          </HeaderText>
          <HeaderText>
            <BasicLink href="https://twitter.com/voltfinance" target="_blank">
              Twitter
            </BasicLink>
          </HeaderText>
          <HeaderText>
            <BasicLink href="https://t.me/voltage_finance" target="_blank">
              Telegram
            </BasicLink>
          </HeaderText>
          <Toggle isActive={darkMode} toggle={onToggleDarkMode} />
        </AutoColumn>
        {/* <SideNavTimer /> */}
      </DesktopWrapper>
      <Dialog
        maxWidth="sm"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an address and click load.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("defaultAddress", address);
              router.push("/users/" + address);
              handleClose();
            }}
            color="primary"
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const HeaderText = styled.div`
  margin-right: 0.75rem;
  font-size: 0.825rem;
  font-weight: 500;
  display: inline-box;
  display: -webkit-inline-box;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: white;
  }
`;
