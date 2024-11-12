import React, { useState, useContext } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Stepper, Step, StepLabel, Paper, Divider } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { apiHelper, endpoints } from '../../helpers';
import VendorMCQManager from './VendorMCQManager';
import VendorCodingChallengeManager from './VendorCodingChallengeManager';

const VendorTestManager = () => {
  const { user } = useContext(AuthContext);
  const [test, setTest] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: 'medium',
    mcqs: [],
    codingChallenges: []
  });
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Test Details', 'MCQ Questions', 'Coding Challenges', 'Review'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTest(prevTest => ({
      ...prevTest,
      [name]: value
    }));
  };

  const handleMCQSubmit = (mcqs) => {
    setTest(prevTest => ({
      ...prevTest,
      mcqs: mcqs
    }));
  };

  const handleCodingChallengeSubmit = (challenges) => {
    setTest(prevTest => ({
      ...prevTest,
      codingChallenges: challenges
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiHelper.post(endpoints.vendor.tests, {
        ...test,
        vendorId: user.id
      });

      console.log('Test created successfully:', response);
      setTest({
        title: '',
        description: '',
        duration: 60,
        difficulty: 'medium',
        mcqs: [],
        codingChallenges: []
      });
      alert('Test created successfully!');
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Error creating test. Please try again.');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Test Details</Typography>
            <TextField
              fullWidth
              label="Test Title"
              name="title"
              value={test.title}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={test.description}
              onChange={handleInputChange}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Duration (minutes)</InputLabel>
              <Select
                name="duration"
                value={test.duration}
                onChange={handleInputChange}
                required
              >
                {[30, 60, 90, 120].map(duration => (
                  <MenuItem key={duration} value={duration}>{duration} minutes</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={test.difficulty}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        );
      case 1:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>MCQ Questions</Typography>
            <VendorMCQManager onSubmit={handleMCQSubmit} />
          </Paper>
        );
      case 2:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Coding Challenges</Typography>
            <VendorCodingChallengeManager onSubmit={handleCodingChallengeSubmit} />
          </Paper>
        );
      case 3:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Review Test</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Test Details</Typography>
              <Typography>Title: {test.title}</Typography>
              <Typography>Duration: {test.duration} minutes</Typography>
              <Typography>Difficulty: {test.difficulty}</Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }}>MCQs ({test.mcqs.length})</Typography>
              {test.mcqs.map((mcq, index) => (
                <Box key={index} sx={{ ml: 2, mb: 1 }}>
                  <Typography>Question {index + 1}: {mcq.question}</Typography>
                </Box>
              ))}
              
              <Typography variant="h6" sx={{ mt: 2 }}>Coding Challenges ({test.codingChallenges.length})</Typography>
              {test.codingChallenges.map((challenge, index) => (
                <Box key={index} sx={{ ml: 2, mb: 1 }}>
                  <Typography>Challenge {index + 1}: {challenge.title}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Create New Test</Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Create Test
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setActiveStep(prev => prev + 1)}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default VendorTestManager; 