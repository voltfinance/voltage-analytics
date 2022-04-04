import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMemo } from "react";
import { tokens } from "@voltage-finance/swap-default-token-list/build/voltage-swap-default.tokenlist.json";
import { VOLT_TOKEN_ADDRESS } from "config";

const voltTokenListLogos = tokens.reduce(
  (acc, token) => ({ ...acc, [token.address.toLowerCase()]: token.logoURI }),
  { [VOLT_TOKEN_ADDRESS]: "https://fuselogo.s3.eu-central-1.amazonaws.com/volt_icon.png" }
);

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    // background: "transparent",
    color: theme.palette.text.secondary,
    width: (props) => props.width || "24px",
    height: (props) => props.height || "24px",
  },
}));

export default function TokenIcon({ id, width, height, ...rest }) {
  const classes = useStyles({ width, height });
  const src = useMemo(
    () => voltTokenListLogos[id.toLowerCase()],
    [id]
  );
  return <Avatar classes={{ root: classes.root }} src={src} {...rest} />;
}
