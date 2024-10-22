import React from 'react';
import { Typography, Button, Grid, Box, Container, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MonitorIcon from '@mui/icons-material/Monitor';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import CreateIcon from '@mui/icons-material/Create';

const HeroSection = styled('div')({
  backgroundColor: '#004d40',
  color: 'white',
  padding: '80px 0',
});

const FeatureIcon = styled('div')({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  backgroundColor: '#e0f2f1',
  color: '#004d40',
});

const Home = () => {
  const features = [
    { title: 'Create', icon: <CreateIcon />, description: 'Create exams in minutes' },
    { title: 'Monitor', icon: <MonitorIcon />, description: 'Live exam monitoring' },
    { title: 'Analyze', icon: <AnalyticsIcon />, description: 'Detailed analytics and reports' },
    { title: 'Secure', icon: <SecurityIcon />, description: 'Advanced security features' },
  ];

  return (
    <>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom>
                The Ultimate Online Exam Platform
              </Typography>
              <Typography variant="h5" paragraph>
                Create, monitor, and analyze tests with ease. Trusted by 2.5M+ users worldwide.
              </Typography>
              <Button variant="contained" color="secondary" size="large">
                Start Free Trial
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                No credit card required
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add an image or illustration of the platform here */}
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Powerful Features for All Your Testing Needs
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <Typography variant="h6" align="center" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" align="center">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#f0f4f8', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Why Choose Our Platform?
              </Typography>
              <List>
                {[
                  'Easy to use interface',
                  'Multiple question types',
                  'AI-powered proctoring',
                  'Detailed analytics',
                  'Customizable branding',
                  'Multilingual support',
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add an image or illustration here */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#e0f2f1', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            Join thousands of organizations using our platform for their testing needs.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" size="large" sx={{ mr: 2 }}>
              Sign Up Free
            </Button>
            <Button variant="outlined" color="primary" size="large">
              Request Demo
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
