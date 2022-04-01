import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMemo } from "react";
import { tokens } from "@voltage-finance/swap-default-token-list/build/voltage-swap-default.tokenlist.json";

const voltTokenListLogos = tokens.reduce(
  (acc, token) => ({ ...acc, [token.symbol]: token.logoURI }),
  { "VOLT": "https://fuselogo.s3.eu-central-1.amazonaws.com/volt_icon.png"}
);

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    // background: "transparent",
    color: theme.palette.text.secondary,
    width: "24px",
    height: "24px",
  },
}));

export default function TokenIcon({ id, ...rest }) {
  const classes = useStyles();
  const src = useMemo(
    () => voltTokenListLogos[id],
    [id]
  );
  return <Avatar classes={{ root: classes.root }} src={src} {...rest} />;
}
