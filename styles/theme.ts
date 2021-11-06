import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme({
  palette: {
    background: {
      default: '#efefef00',
    },
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#ab003c',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
