import React, { useState, useContext } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Stepper, Step, StepLabel, Paper, Divider } from '@mui/material';
import axios from 'axios';
import MCQManager from './MCQManager';
import CodingChallengeManager from './CodingChallengeManager';
import { AuthContext } from '../../contexts/AuthContext';

const TestManager = () => {
  const { token } = useContext(AuthContext);
  const [test, setTest] = useState({
    name: '',
    description: '',
    duration: 60,
    proctoring: true,
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
      const testData = {
        name: test.name,
        description: test.description,
        duration: test.duration,
        proctoring: test.proctoring,
        mcqs: test.mcqs.map(mcq => ({
          question: mcq.question,
          options: mcq.options,
          correctAnswers: mcq.correctAnswers,
          isMultipleAnswer: mcq.correctAnswers.length > 1
        })),
        codingChallenges: test.codingChallenges.map(challenge => ({
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          testCases: challenge.testCases,
          languages: challenge.languages
        }))
      };

      const response = await axios.post('http://localhost:5000/api/admin/tests', testData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Test created successfully:', response.data);
      // Reset the form
      setTest({
        name: '',
        description: '',
        duration: 60,
        proctoring: false,
        mcqs: [],
        codingChallenges: []
      });
      alert('Test created successfully!');
    } catch (error) {
      console.error('Error creating test:', error.response?.data || error.message);
      alert('Error creating test. Please try again.');
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Test Details</Typography>
            <TextField
              fullWidth
              label="Test Name"
              name="name"
              value={test.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Test Description"
              name="description"
              value={test.description}
              onChange={handleInputChange}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={test.price}
              onChange={handleInputChange}
              required
              type="number"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Number Of Participants"
              name="num_participants"
              value={test.num_participants}
              onChange={handleInputChange}
              required
              type="number"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Test Duration (minutes)</InputLabel>
              <Select
                name="duration"
                value={test.duration}
                onChange={handleInputChange}
                required
              >
                {[30, 60, 90, 120, 150, 180].map(duration => (
                  <MenuItem key={duration} value={duration}>{duration} minutes</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        );
      case 1:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>MCQ Questions</Typography>
            <MCQManager onSubmit={handleMCQSubmit} />
          </Paper>
        );
      case 2:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Coding Challenges</Typography>
            <CodingChallengeManager onSubmit={handleCodingChallengeSubmit} />
          </Paper>
        );
      case 3:
        return (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Review Test</Typography>
            {/* Add a summary of the test details, MCQs, and coding challenges here */}
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
            onClick={handleBack}
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
                onClick={handleNext}
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

export default TestManager;
