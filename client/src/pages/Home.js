import React, { useEffect } from 'react';
import { Typography, Button, Grid, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CreateIcon from '@mui/icons-material/Create';
import MonitorIcon from '@mui/icons-material/Monitor';
import GradingIcon from '@mui/icons-material/Grading';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VideocamIcon from '@mui/icons-material/Videocam';
import BackupIcon from '@mui/icons-material/Backup';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiHelper, endpoints } from '../helpers';
import { RetroGrid } from '../components/ui/RetroGrid';
import '../App.css';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #18F349 30%, #04A8BF 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(4, 168, 191, .3)',
  color: 'white',
  padding: '10px 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #04A8BF 30%, #18F349 90%)',
  }
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
}));

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    const handleUrlParams = () => {
      const searchParams = new URLSearchParams(location.search);
      const data = {
        name: searchParams.get('name'),
        email: searchParams.get('email'),
        userId: searchParams.get('user_id'),
        userRole: searchParams.get('user_role'),
        userPassword: searchParams.get('password'),
        fullName: searchParams.get('full_name'),
        avatarUrl: searchParams.get('avatar_url')
      };

      if (data.name && data.email && data.userId && data.userRole && data.userPassword) {
        handleSignupAndLogin(data);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleUrlParams();
  }, [location]);

  const handleSignupAndLogin = async (data) => {
    try {
      const response = await apiHelper.post(endpoints.auth.register, {
        username: data.name,
        email: data.email,
        password: data.userPassword,
        name: data.fullName,
        userId: data.userId,
        avatarUrl: data.avatarUrl
      });

      if (response.token && response.user) {
        login(response.token, response.user);
        navigate('/');
      } else {
        throw new Error('Invalid response received');
      }
    } catch (error) {
      console.error('Signup/Login error:', error.message || error);
      setSnackbarMessage('Error: ' + (error.message || 'Failed to register user'));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const vendorFeatures = [
    {
      icon: <CreateIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Custom exam Creation",
      description: "Vendors can create exams with customizable question formats, including multiple-choice, essay, and drag-and-drop."
    },
    {
      icon: <MonitorIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "AI-Powered Procturing",
      description: "Real-time monitoring using AI algorithms to detect suspicious behavior and ensure exam integrity."
    },
    {
      icon: <GradingIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Automated Grading",
      description: "Automatic grading of multiple-choice and objective-type questions with immediate result generation."
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Exam Scheduling",
      description: "Vendors can schedule exams, set time limits, and automate reminders for upcoming exams."
    },
    {
      icon: <WorkspacePremiumIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Instant certification",
      description: "Automatically issue certificates to candidates upon successful completion of the exam."
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Vendor dashboard",
      description: "A comprehensive dashboard that provides an overview of all exams, candidates, and performance metrics."
    }
  ];

  const securityFeatures = [
    {
      icon: <LockIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Secure Browser Mode",
      description: "Exams are conducted in a secure environment, restricting candidates from accessing unauthorized websites or applications."
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "End-to-End Encryption",
      description: "All data, from exam papers to candidate information, is fully encrypted to protect sensitive information."
    },
    {
      icon: <HomeIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Session Lockdown",
      description: "Prevent candidates from exiting the exam window or switching tabs during an active session."
    },
    {
      icon: <VpnKeyIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA, ensuring only authorized users can access exams."
    },
    {
      icon: <VideocamIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Live Proctor Monitoring",
      description: "Real-time monitoring and recording of exam sessions to prevent malpractice."
    },
    {
      icon: <BackupIcon sx={{ fontSize: 40, color: '#18F349' }} />,
      title: "Data Backup",
      description: "We securely back up all exam data to ensure that nothing is lost, even in the case of unexpected disruptions."
    }
  ];

  return (
    <Box sx={{ padding: '10px' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: '#000',
        minHeight: '430px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Background Image */}
        <Box 
          component="img"
          src={require("../assets/main1.jpeg")}
          alt="Hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.6,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        
        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ 
          position: 'relative',
          pt: 8, 
          pb: 6,
          zIndex: 3
        }}>
         
        </Container>
        
      </Box>

      <Box sx={{ background: '#000', py: 8, position: 'relative', zIndex: 1, mt: '-1px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 500,
              color: '#FFFFFF',
              mb: 2,
              '& .highlight': {
                color: '#18F349',
                textDecoration: 'underline',
              }
            }}
          >
            Create online <span className="highlight">tests</span>, <span className="highlight">quizzes</span> and <span className="highlight">exams</span>
          </Typography>
          
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: '#919191',
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1.5
            }}
          >
            We helped these great brands write their success stories. Join them now. Choose professional online assessment tool.
          </Typography>
        </Container>
      </Box>

      {/* Vendor Features Section */}
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #000000, #001a1a)',  // Dark gradient background
        py: 10,
        minHeight: '765px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(24, 243, 73, 0.1), transparent 70%)',
          zIndex: 1
        }} />

        {/* RetroGrid */}
        <RetroGrid />
        
        {/* Content Container */}
        <Container maxWidth="lg" sx={{ 
          position: 'relative', 
          zIndex: 2
        }}>
          {/* Section Title */}
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              color: '#FFFFFF',
              fontSize: '40px',
              fontWeight: 500,
              lineHeight: '150.35%',
              mb: 1
            }}
          >
            Vendor Key Features
          </Typography>

          {/* Section Subtitle */}
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: '#EBE6E6',
              fontSize: '20px',
              fontWeight: 500,
              lineHeight: '150.35%',
              mb: 8
            }}
          >
            Empowering Vendors with Seamless Examination Tools
          </Typography>

          {/* Features Grid */}
          <Grid container spacing={2.5} sx={{ mb: 8 }}>
            {[
              {
                icon: <CreateIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "Custom exam Creation",
                description: "Vendors can create exams with customizable question formats, including multiple-choice, essay, and drag-and-drop."
              },
              {
                icon: <MonitorIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "AI-Powered Procturing",
                description: "Real-time monitoring using AI algorithms to detect suspicious behavior and ensure exam integrity."
              },
              {
                icon: <GradingIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "Automated Grading",
                description: "Automatic grading of multiple-choice and objective-type questions with immediate result generation."
              },
              {
                icon: <ScheduleIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "Exam Scheduling",
                description: "Vendors can schedule exams, set time limits, and automate reminders for upcoming exams."
              },
              {
                icon: <WorkspacePremiumIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "Instant certification",
                description: "Automatically issue certificates to candidates upon successful completion of the exam."
              },
              {
                icon: <DashboardIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />,
                title: "Vendor dashboard",
                description: "A comprehensive dashboard that provides an overview of all exams, candidates, and performance metrics."
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FFFFFF',
                      fontSize: '25px',
                      fontWeight: 500,
                      lineHeight: '150.35%',
                      mb: 2,
                      textAlign: 'center'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: '150.35%',
                      textAlign: 'center'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>

          {/* Explore Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                border: '3px solid #00AF27',
                borderRadius: '7px',
                padding: '12px 29px',
                gap: '23px',
                color: '#FFFFFF',
                fontSize: '30px',
                fontWeight: 500,
                lineHeight: '150.35%',
                textTransform: 'none',
                '&:hover': {
                  border: '3px solid #00AF27',
                  background: 'rgba(0, 175, 39, 0.1)'
                }
              }}
            >
              Explore
              
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Security Features Section */}
      <Box sx={{ 
        background: '#050505',
        py: 10,
      }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
          <Typography variant="h2" align="center" sx={{ 
            color: 'white',
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Advanced Proctoring & Security
          </Typography>
          <Grid container spacing={4}>
            {securityFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard>
                  {feature.icon}
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    my: 2,
                    fontWeight: 'bold'
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <GradientButton variant="contained" size="large">
              Explore
            </GradientButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
