import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#000000',
        color: 'white',
        position: 'relative',
        bottom: 0,
        width: '100%',
        height: '64px'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography variant="body2" align="center">
              © 2024 NeXTerTest Platform. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;