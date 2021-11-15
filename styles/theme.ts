import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme({
  palette: {
    background: {
      default: '#efefef00',
    },
    common: {
      white: '#fff',
      black: '#000',
    },
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#efb810',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
