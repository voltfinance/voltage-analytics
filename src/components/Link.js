import React, { forwardRef } from "react";

import MuiLink from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import NextLink from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import styled from "styled-components";

const useStyles = makeStyles(() => ({
  root: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
      underline: "none",
    },
  },
}));

const NextComposed = forwardRef(function NextComposed(props, ref) {
  const { as, href, ...other } = props;

  return (
    <NextLink href={href} as={as}>
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

  const router = useRouter();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
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

export default forwardRef((props, ref) => <Link {...props} innerRef={ref} />);
