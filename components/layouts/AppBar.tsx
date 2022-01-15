import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Logo from '@/components/layouts/Logo';

export default function SearchAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{'.css-42gggb-MuiPaper-root-MuiAppBar-root':{boxShadow:'0px 1px 2px -1px rgb(0 0 0 / 10%), 0px 4px 3px 0px rgb(0 0 0 / 8%), 0px 1px 5px 0px rgb(0 0 0 / 6%)'}}}>
        <Toolbar>
          <Box sx={{ mr: 2 }}>
            <Logo />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
