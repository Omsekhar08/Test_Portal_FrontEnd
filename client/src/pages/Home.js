import React from 'react';
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
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  }
}));

const Home = () => {
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
    <>
      {/* Hero Section */}
      <Box sx={{ 
        background: '#000000',
        color: 'white',
        minHeight: '400px',
        position: 'relative'
      }}>
        {/* Background Image */}
        <Box 
          component="img"
          src={require("../assets/main1.jpeg")}
          alt="Hero"
          sx={{
            width: '100%',
            height: '350px',
            objectFit: 'contain',
            opacity: 0.6,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />

        {/* Content */}
        
      </Box>

      {/* Vendor Features Section */}
      <Box sx={{ 
        background: '#000000',
        py: 10
      }}>
        <Container maxWidth="xl">
          <Typography variant="h2" align="center" sx={{ 
            color: 'white',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Vendor Key Features
          </Typography>
          <Typography variant="h6" align="center" sx={{ 
            color: 'rgba(255,255,255,0.8)',
            mb: 6
          }}>
            Empowering Vendors with Seamless Examination Tools
          </Typography>
          <Grid container spacing={4}>
            {vendorFeatures.map((feature, index) => (
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
        </Container>
      </Box>

      {/* Security Features Section */}
      <Box sx={{ 
        background: '#050505',
        py: 10
      }}>
        <Container maxWidth="xl">
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
    </>
  );
};

export default Home;
