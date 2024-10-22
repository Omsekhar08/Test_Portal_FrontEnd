import React, { useState, useContext, useEffect } from 'react';
import { Typography, Button, Paper, Box, LinearProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MCQSection = ({ testId, mcqs, onComplete }) => {
  const [currentMcq, setCurrentMcq] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    console.log('Current token:', token);
    if (!testId) {
      console.error('Test ID is undefined');
      toast.error('Error: Test ID is missing. Please try again or contact support.');
    }
  }, [token, testId]);

  const handleOptionClick = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentMcq]: option
    });
  };

  const handleNext = () => {
    if (currentMcq < mcqs.length - 1) {
      setCurrentMcq(currentMcq + 1);
    }
  };

  const handlePrevious = () => {
    if (currentMcq > 0) {
      setCurrentMcq(currentMcq - 1);
    }
  };

  const handleSkip = () => {
    if (currentMcq < mcqs.length - 1) {
      setCurrentMcq(currentMcq + 1);
      const updatedAnswers = { ...selectedAnswers };
      delete updatedAnswers[currentMcq];
      setSelectedAnswers(updatedAnswers);
    }
  };

  const handleSubmit = async () => {
    if (!testId || !mcqs.length) {
      console.error('Test ID or MCQs are missing');
      toast.error('Error: Test data is incomplete. Please try again or contact support.');
      return;
    }

    try {
      const userAnswers = Object.entries(selectedAnswers).map(([index, answer]) => ({
        questionId: mcqs[parseInt(index)]._id,
        selectedAnswer: answer
      }));

      console.log('Submitting answers:', userAnswers);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/mcq/test/${testId}/submit`,
        { userAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('MCQ submission response:', response.data);
      // toast.success(`MCQ answers submitted successfully! Score: ${response.data.score}/${response.data.totalQuestions}`);
      onComplete();
    } catch (error) {
      console.error('Error submitting MCQ answers:', error.response?.data || error.message);
      toast.error(`Error submitting MCQ answers: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!testId) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" color="error">
          Error: Test ID is missing. Please try again or contact support.
        </Typography>
      </Paper>
    );
  }

  if (mcqs.length === 0) return <Typography>No MCQs available for this hackathon.</Typography>;

  const currentQuestion = mcqs[currentMcq];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        MCQ Section
      </Typography>
      <Typography variant="subtitle1" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
        {currentMcq + 1} / {mcqs.length}
      </Typography>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        MCQ Challenge
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(currentMcq + 1) / mcqs.length * 100}
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      <Typography variant="h6" paragraph fontWeight="medium">
        {currentQuestion.question}
      </Typography>
      <Box sx={{ mt: 2 }}>
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswers[currentMcq] === option ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleOptionClick(option)}
            fullWidth
            sx={{ mb: 1, justifyContent: 'flex-start', textTransform: 'none' }}
          >
            <Typography variant="body1">
              {String.fromCharCode(65 + index)}. {option}
            </Typography>
          </Button>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={handlePrevious}
          disabled={currentMcq === 0}
          variant="outlined"
          color="primary"
        >
          Previous
        </Button>
        {currentMcq === mcqs.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
          >
            Submit
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSkip}
              variant="outlined"
              color="secondary"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </>
        )}
      </Box>
      <ToastContainer />
    </Paper>
  );
};

export default MCQSection;
