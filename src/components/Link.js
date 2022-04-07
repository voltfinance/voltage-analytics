import React, { forwardRef } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import MuiLink from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
      underline: "none",
    },
  },
  custom: {
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: ({ color }) => (color ? color : theme.palette.text.primary),
    // "&:visited": {
    //   color: ({ color, theme }) => (color ? lighten(0.1, color) : lighten(0.1, theme.link)),
    // },
    // "&:hover": {
    //   cursor: "pointer",
    //   textDecoration: "none",
    //   underline: "none",
    //   color: ({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.link)),
    // }
  }
}));

const NextComposed = forwardRef(function NextComposed(props, ref) {
  const { as, href = "", ...other } = props;

  return (
    <NextLink href={href} as={as} passHref>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props) {
  const {
    href,
    activeClassName = "MuiLink-underlineAlways",
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const { pathname } = useRouter();
  const className = clsx(classNameProps, {
    [activeClassName]: pathname === href && activeClassName,
  });

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      color="textPrimary"
      {...other}
    />
  );
}

export const BasicLink = ({ className, children, ...rest }) => {
  const classes = useStyles();
  return (
    <Link className={clsx(className, classes.root)} {...rest}>
      {children}
    </Link>
  );
};

export const CustomLink = ({ className, children, ...rest }) => {
  const classes = useStyles();
  return (
    <Link className={clsx(className, classes.custom)} {...rest}>
      {children}
    </Link>
  );
}

export default forwardRef((props, ref) => <Link {...props} innerRef={ref} />);
