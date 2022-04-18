import {
  blueGrey,
  deepOrange,
  deepPurple,
  green,
  grey,
  orange,
  purple,
  red,
} from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

import styled from 'styled-components'
import { Typography, withStyles } from "@material-ui/core";

const TypographyWrapper = withStyles((theme) => ({
  root: {
    fontWeight: props => props.fontWeight || 500,
    fontSize: props => props.fontSize || "14px",
    color: props => props.color || theme.palette.text.primary,
    marginRight: props => props.mr,
  }
}))(Typography);

export const TYPE = {
  main(props) {
    return <TypographyWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />
  },

  body(props) {
    return <TypographyWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />
  },

  small(props) {
    return <TypographyWrapper fontWeight={500} fontSize={11} color={'text1'} {...props} />
  },

  header(props) {
    return <TypographyWrapper fontWeight={600} color={'text1'} {...props} />
  },

  largeHeader(props) {
    return <TypographyWrapper fontWeight={500} color={'text1'} fontSize={24} {...props} />
  },

  light(props) {
    return <TypographyWrapper fontWeight={400} color={'text3'} fontSize={14} {...props} />
  },

  pink(props) {
    return <TypographyWrapper fontWeight={props.faded ? 400 : 600} color={props.faded ? 'text1' : 'text1'} {...props} />
  },
}

export const ThemedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  color: ${(theme) => theme.text1}
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;

  transform: translateY(-110vh);
`;

export const palette = {
  primary: {
    main: "#B93CF6",
  },
  positive: {
    main: green[500],
  },
  negative: {
    main: red[500],
  },

  seaweed: {
    main: "#050709",
  },
  rice: {
    main: "white",
  },
  filling: {
    main: red.A400,
  },

  // Used by `getContrastText()` to maximize the contrast between
  // the background and the text.
  contrastThreshold: 3,
  // Used by the functions below to shift a color's luminance by approximately
  // two indexes within its tonal palette.
  // E.g., shift from Red 500 to Red 300 or Red 700.
  tonalOffset: 0.2,

  // // Used by `getContrastText()` to maximize the contrast between
  // // the background and the text.
  // contrastThreshold: 3,
  // // Used by the functions below to shift a color's luminance by approximately
  // // two indexes within its tonal palette.
  // // E.g., shift from Red 500 to Red 300 or Red 700.
  // tonalOffset: 0.2,
};

const fontFamily = [
  "Averta CY",
  "Inter",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Fira Sans",
  "Droid Sans",
  "Helvetica Neue",
  "sans-serif",
];

const overrides = {
  MuiTable: {
    root: {
      // "& > tbody > tr:last-child > *": { border: 0 },
      // "& > thead > tr > *": { border: 0 },
    },
  },
  MuiInputBase: {
    root: {
      backgroundColor: "#fff",
    },
  },
  MuiTableCell: {
    head: {
      fontWeight: 400,
      whiteSpace: "nowrap",
    },
  },
  MuiAvatarGroup: {
    avatar: {
      border: 0,
    },
  },
  MuiAvatar: {
    fallback: {},
  },
};

export const darkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "dark",
      text: {
        primary: "#fff",
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
      },
      action: {
        active: "#fff",
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#212429",
        paper: "#212429",
      },
      divider: "rgba(255, 255, 255, 0.12)",
      ...palette,
    },
    typography: {
      fontFamily,
    },
    overrides,
  })
);

export const lightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "light",
      background: {
        default: "#F7F8FA",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#050709",
        secondary: "rgba(5, 7, 9, 0.7)",
        disabled: "rgba(5, 7, 9, 0.5)",
      },
      ...palette,
    },
    typography: {
      fontFamily,
    },
    overrides,
  })
);
