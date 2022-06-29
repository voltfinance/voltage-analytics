import { Avatar } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.getContrastText("#f3fc1f"),
    backgroundColor: "#f3fc1f",
    marginRight: theme.spacing(2),
  },
}));

export default function AddressAvatar(props) {
  const classes = useStyles();
  return (
    <Avatar variant="rounded" className={classes.avatar}>
      {props.address.slice(0, 3)}
    </Avatar>
  );
}
