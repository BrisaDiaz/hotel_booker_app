import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme({
  palette: {
    background: {
      default: '#f1f3f98c',
    },
    common: {
      white: '#fff',
      black: '#373737',
    },
    primary: {
      main: '#435b9c',
      dark: '#304170',
      light: '#A9B6DA',
    },
    secondary: {
      main: '#9c5443',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
