import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiHelper, endpoints } from '../helpers';
import { keyframes } from '@mui/system';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', { email, password });
      const response = await apiHelper.post(endpoints.auth.login, {
        email,
        password,
      });
      
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        console.log('Login successful, updating context');
        login(response.token, response.user, response.name);
        navigate('/');  
      } else {
        throw new Error('Invalid response received');
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    const passwordParam = searchParams.get('password');

    if (emailParam && passwordParam) {
      setEmail(emailParam);
      setPassword(passwordParam);
      handleSubmit({ preventDefault: () => {} });
    } else if (searchParams.get('userExists') === 'true') {
      setOpenDialog(true);
    }
  }, [location]);

  // Remove the separate handleAutoLogin function and the useEffect that calls it

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRedirect = () => {
    window.location.href = 'https://nexterchat.com/hul-login/';
  };

  // Define keyframes for animations
  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const pulse = keyframes`
    0% {
      box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(63, 81, 181, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(63, 81, 181, 0);
    }
  `;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${fadeIn} 1s ease-in-out`,
        padding: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          animation: `${fadeIn} 1s ease-in-out`,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary.main">
          Welcome Back
        </Typography>
       
        {error && <Typography color="error" align="center">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          />
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Sign In
          </Button>
          <Button
            onClick={handleRedirect}
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{
              py: 1.5,
              animation: `${pulse} 2s infinite`,
            }}
          >
            Login with Hysterchat
          </Button>
        </form>
        
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>User Already Exists</DialogTitle>
          <DialogContent>
            <Typography>This user already exists. Please log in instead.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Login;
