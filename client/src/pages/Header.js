import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const debugAuth = () => {
    console.log('Current user:', user);
    console.log('Auth token:', localStorage.getItem('token'));
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1,display:'flex',alignItems:'center',gap:'10px' }}>
            <img src="https://hysterchat-media.s3.amazonaws.com/hysterchat-media/uploads/2024/09/24021820/Picture1.png" alt="TestPortal" height="30" />
            NeXTer TestPortal
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/test">Test</Button>
            <Button color="inherit" component={RouterLink} to="/online-proctoring">Online Proctoring</Button>
            <Button color="inherit" component={RouterLink} to="/pricing">Pricing</Button>

            {user ? (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {profile?.username || 'User'}
                </Typography>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>                
              </>
            ) : (
              <Button variant="outlined" color="primary" component={RouterLink} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
