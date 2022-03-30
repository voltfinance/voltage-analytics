import { makeStyles } from '@material-ui/core'
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    "&.center": {
      width: "100%",
      alignItems: "center",
    },
    "&.auto": {
      display: "grid",
      "grid-auto-rows": "auto",
      "grid-row-gap": ({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap,
      justifyItems: ({ justify }) => justify && justify,
    },
  },
}));

const Column = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.column}>{children}</div>
};
export default Column;

export const ColumnCenter = ({ children }) => {
  const classes = useStyles();
  return <div className={clsx(classes.column, "center")}>{children}</div>
};

export const AutoColumn = ({ gap, justify, className, children }) => {
  const classes = useStyles({ gap, justify });
  return <div className={clsx(className, classes.column, "auto")}>{children}</div>
};

