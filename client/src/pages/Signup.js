import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        termsAccepted: false
    });

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)'
        }}>
            <Container maxWidth="lg" sx={{
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                py: 4
            }}>
                {/* Left Side - Form */}
                <Box sx={{
                    width: '50%',
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: '8px 0 0 8px',
                    boxShadow: 3
                }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Join the    NeXter Test
                    </Typography>
                   

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, py: 1.5 }}
                        onClick={() => {
                            window.location.href = 'https://nexterchat.com/test-login/';
                        }}
                    >
                        <img src="https://hysterchat-media.s3.amazonaws.com/hysterchat-media/uploads/2024/09/24021820/Picture1.png" alt="NeXterChat Logo" style={{ width: '40px', height: '30px', marginRight: '10px' }} />
                        Sign up with NeXterChat
                    </Button>

                    <Typography variant="body1" sx={{ textAlign: 'center', mb:3 }}>
                        or Sign up with e-mail
                    </Typography>

                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        sx={{ mb: 2, }}
                    />
                    <TextField
                        fullWidth
                        label="E-mail"
                        variant="outlined"
                        sx={{ mb: 2,   }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        sx={{ mb: 2,  }}
                    />

                    <FormControlLabel
                        control={<Checkbox />}
                        label={
                            <Typography variant="body2">
                                I'm okay with your{' '}
                                <Link to="/terms" style={{ color: '#3f51b5' }}>Terms of Service</Link>,{' '}
                                <Link to="/privacy" style={{ color: '#3f51b5' }}>Privacy Policy</Link>
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            py: 1.5,
                            bgcolor: '#3f51b5',
                            '&:hover': { bgcolor: '#2196f3' }
                        }}
                    >
                        Create Account
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Typography variant="body2">
                            Already a member?{' '}
                            <Link to="/login" style={{ color: '#3f51b5', fontWeight: 'bold' }}>
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                {/* Right Side - Video */}
                <Box sx={{
                    width: '50%',
                    bgcolor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderRadius: '0 8px 8px 0',
                    // boxShadow: 3
                }}>
                    <video
                        autoPlay
                        loop
                        muted
                        style={{
                            maxWidth: '80%',
                            height: 'auto',
                            borderRadius: '8px'
                        }}
                    >
                        <source src={require("../assets/grammar_correction.mp4")} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>
            </Container>
        </Box>
    );
};

export default Signup;