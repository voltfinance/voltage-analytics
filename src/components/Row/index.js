import styled from "styled-components";
import { makeStyles, Box as MuiBox } from "@material-ui/core";

const CanaryRow = ({ align = "center", children, ...props }) => {
  return (
    <MuiBox
      alignItems={align}
      padding={0}
      display="flex"
      width="100%"
      {...props}
    >
      {children}
    </MuiBox>
  );
};

export const RowBetween = ({ children, ...props }) => (
  <CanaryRow justifyContent="space-between" {...props}>{children}</CanaryRow>
);

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const RowFixed = ({ children, ...props }) => (
  <CanaryRow width="fit-content" {...props}>{children}</CanaryRow>
);

const useStyles = makeStyles(() => ({
  root: {
    flexWrap: ({ wrap }) => wrap ?? "nowrap",
    margin: ({ gap }) => gap,
    "& > *": {
      margin: ({ gap }) => `${gap} !important"`,
    },
  },
}));

export const AutoRow = ({ children, ...props }) => {
  const classes = useStyles({ ...props });
  return (
    <CanaryRow className={classes.root} {...props}>
      {children}
    </CanaryRow>
  );
};
