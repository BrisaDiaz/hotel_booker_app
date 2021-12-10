import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';

import Logo from '@/components/layouts/Logo';

export default function SearchAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ mr: 2 }}>
            <Logo />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
