import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import { apiHelper, endpoints } from '../helpers';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const data = await apiHelper.get(endpoints.auth.profile);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const debugAuth = () => {
    console.log('Current user:', user);
    console.log('Auth token:', localStorage.getItem('token'));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#000000',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ffffff'
            }}
            onClick={() => navigate('/')}
          >
            <Box 
              component="img"
              src="https://hysterchat-media.s3.amazonaws.com/hysterchat-media/uploads/2024/09/24021820/Picture1.png" 
              alt="TestPlatform"
              
              sx={{ height: 50, width: 50 }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              NeXterTest Platform
            </Box>
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          <Button 
              color="inherit" 
              component={RouterLink} 
              to="/tests"
              sx={{ color: '#ffffff' }}
            >
              Test
            </Button>
            
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/services"
              sx={{ color: '#ffffff' }}
            >
              Services
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/vendor"
              sx={{ color: '#ffffff' }}
            >
              Vendor
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/resources"
              sx={{ color: '#ffffff' }}
            >
              Resources
            </Button>
            
            {user ? (
              <>
                <Avatar 
                  sx={{ bgcolor: 'primary.main', cursor: 'pointer' }}
                  onClick={handleMenuOpen}
                >
                  {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#00ff00',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: '#00dd00'
                    }
                  }} 
                  component={RouterLink} 
                  to="/signup"
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    '&:hover': {
                      borderColor: '#00ff00',
                      color: '#00ff00'
                    }
                  }} 
                  component={RouterLink} 
                  to="/login"
                >
                  Log In
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu - update styles */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              sx={{ color: '#ffffff' }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#000000',
                  color: '#ffffff'
                }
              }}
            >
              <MenuItem component={RouterLink} to="/services" onClick={handleMenuClose}>Services</MenuItem>
              <MenuItem component={RouterLink} to="/vendor" onClick={handleMenuClose}>Vendor</MenuItem>
              <MenuItem component={RouterLink} to="/resources" onClick={handleMenuClose}>Resources</MenuItem>
              {!user && (
                <>
                  <MenuItem component={RouterLink} to="/signup" onClick={handleMenuClose}>Sign Up</MenuItem>
                  <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>Log In</MenuItem>
                </>
              )}
              {user && <MenuItem onClick={logout}>Logout</MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
