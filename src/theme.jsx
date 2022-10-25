import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#0C0C0C",
      light: "#313439",
      contrastText: "#fff",
    },
    secondary: {
      main: "#06044a",
      light: "#4c02f1",
      contrastText: "#000000",
    },
    text: {
      primary: "#fff",
      secondary: "#35343f",
    },
  },
});

theme.overrides = {
  MuiCssBaseline: {
    "@global": {
      body: {
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#000000",
        color: "#ffffff",
      },
      ".img-fluid": {
        maxWidth: "100%",
        height: "auto",
      },
    },
  },
};

theme = responsiveFontSizes(theme);

export default theme;
