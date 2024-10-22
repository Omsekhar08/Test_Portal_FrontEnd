import React from 'react';
import { Typography, Container, Grid, Paper, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ComputerIcon from '@mui/icons-material/Computer';
import VideocamIcon from '@mui/icons-material/Videocam';

const OnlineProctoring = () => {
  const proctoringTypes = [
    {
      title: 'ProctorLite',
      description: 'An image-based proctoring service where images are captured at set intervals.',
      icon: <ComputerIcon fontSize="large" />,
    },
    {
      title: 'Audio & Video Proctoring',
      description: 'An audio and video-based proctoring service wherein the audio and video feeds of the candidates can be live monitored or reviewed later from the stored feed.',
      icon: <VideocamIcon fontSize="large" />,
    },
    {
      title: 'AI-based Audio and Video Proctoring',
      description: 'An AI-based suspicious activity detection system in addition to the features offered by the audio and video proctoring software.',
      icon: <SecurityIcon fontSize="large" />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" gutterBottom>
        Remote Online Proctoring
      </Typography>
      <Typography variant="body1" paragraph>
        Online proctoring, also known as proctoring software, is a method of using technology to administer exams and assessments remotely. This will increase proctoring software cost test taker flexibility and convenience, making the exam more accessible to more test takers.
      </Typography>
      <Typography variant="body1" paragraph>
        Best online proctoring software typically uses webcams and microphones to monitor candidates during the exam. Monitoring software secure proctoring can detect and flag suspicious activity such as fraud and collusion. Some online proctoring platforms also include the use of biometric technologies such as Facial recognition to further verify the identity of test takers.
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Our Proctoring Solutions
      </Typography>
      <Grid container spacing={3}>
        {proctoringTypes.map((type, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {type.icon}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom align="center">
                {type.title}
              </Typography>
              <Typography variant="body2">
                {type.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="body1" paragraph sx={{ mt: 4 }}>
        With our latest update, we have introduced the feature to record the entire screen of the candidate during the exam. This allows the admin to monitor any activity happening behind the exam screen.
      </Typography>
      <Typography variant="body1" paragraph>
        Our live proctoring software is designed to ensure the best security and integrity of online exams, providing a top-notch solution for proctoring software for online exams. When it comes to proctoring software for schools, colleges or enterprise businesses, our platform stands out as one of the best proctoring software available in the market.
      </Typography>
      <Typography variant="body1">
        SpeedExam online proctoring software offers a secure and convenient way to administer exams remotely, and with the right online proctoring platform, you can ensure the integrity of the testing process while providing flexibility to candidates.
      </Typography>
    </Container>
  );
};

export default OnlineProctoring;