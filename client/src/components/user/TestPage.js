import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Typography, CircularProgress, Box, Paper, List, ListItem, ListItemText, Grid } from '@mui/material';
import MCQSection from './MCQSection';
import CodingChallengeSection from './CodingChallengeSection';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Proctoring from './Proctoring';
import { useNavigate, useParams } from 'react-router-dom';
import { apiHelper, endpoints } from '../../helpers';
import useExamSecurity from '../../hooks/useExamSecurity';

const TestPage = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState('mcq');
  const [isProctoringEnabled, setIsProctoringEnabled] = useState(false);
  const [isProctoringSetup, setIsProctoringSetup] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [isProctoringActive, setIsProctoringActive] = useState(false);
  const warningCountRef = useRef(0);
  const navigate = useNavigate();
  const { testId } = useParams();

  // Add exam security
  const { enterFullscreen } = useExamSecurity({
    enabled: examStarted,
    onViolation: (message) => {
      handleProctoringViolation(message);
    }
  });

  useEffect(() => {
    const fetchTest = async () => {
      try {
        if (!testId) {
          setError('No test ID provided');
          setLoading(false);
          return;
        }

        const response = await apiHelper.get(endpoints.tests.byId(testId));
        setSelectedTest(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  // Modify handleStartTest to include fullscreen
  const handleStartTest = () => {
    console.log('Starting test, proctoring:', selectedTest.proctoring);
    if (selectedTest.proctoring && !isProctoringActive) {
      setIsProctoringEnabled(true);
      setIsProctoringSetup(true);
      setIsProctoringActive(true);
    } else {
      startExam();
    }
  };

  // Modify startExam to check security status
  const startExam = useCallback(() => {
    if (!examStarted) {
      enterFullscreen(); // Enter fullscreen mode
      setTestStarted(true);
      setExamStarted(true);
      toast.success('Exam started. Good luck!', { toastId: 'exam-start' });
    }
  }, [examStarted, enterFullscreen]);

  const handleProctoringAlert = useCallback((message) => {
    console.log('Proctoring alert:', message);
    toast.warn(message);
  }, []);

  const handleProctoringViolation = useCallback((violationType) => {
    console.log('Proctoring violation:', violationType);
    warningCountRef.current += 1;
    toast.error(`Proctoring violation detected: ${violationType}`);
    
    if (warningCountRef.current >= 3) {
      handleTestEnd('Test ended due to multiple violations');
      navigate('/home');
    }
  }, [navigate]);

  const handleProctoringSetupComplete = useCallback((success) => {
    console.log('Proctoring setup complete:', success);
    setIsProctoringSetup(false);
    if (success) {
      startExam();
    } else {
      setIsProctoringActive(false);
      toast.error('Proctoring setup failed. Please try again or contact support.', { toastId: 'proctoring-fail' });
    }
  }, [startExam]);

  const handleSectionComplete = () => {
    console.log('Section complete:', currentSection);
    if (currentSection === 'mcq') {
      if (selectedTest.codingChallenges && selectedTest.codingChallenges.length > 0) {
        setCurrentSection('coding');
      } else {
        handleTestEnd('Exam completed successfully.');
      }
    } else {
      handleTestEnd('Exam completed successfully.');
    }
  };

  const handleTestEnd = (message) => {
    console.log('Test ended:', message);
    setTestStarted(false);
    setExamStarted(false);
    setSelectedTest(null);
    setIsProctoringEnabled(false);
    setIsProctoringActive(false);
    setCurrentSection('mcq');
    warningCountRef.current = 0;
    toast.info(message);
  };

  useEffect(() => {
    if (selectedTest) {
      console.log('MCQs:', selectedTest.mcqs);
    }
  }, [selectedTest]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  console.log('Render state:', { selectedTest, testStarted, isProctoringEnabled, isProctoringSetup, examStarted });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Test Details</Typography>
      
      {!examStarted ? (
        <>
          {selectedTest && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" gutterBottom>{selectedTest.name}</Typography>
                  <Typography variant="body1" paragraph>{selectedTest.description}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper elevation={2} sx={{ p: 2, height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Duration</Typography>
                        <Typography variant="h6">{selectedTest.duration} minutes</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper elevation={2} sx={{ p: 2, height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Price</Typography>
                        <Typography variant="h6">{selectedTest.price}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper elevation={2} sx={{ p: 2, height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Participants</Typography>
                        <Typography variant="h6">{selectedTest.num_participants}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  {!isProctoringEnabled && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleStartTest}
                      >
                        Start Test
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
          {isProctoringEnabled && (
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Proctoring Setup</Typography>
                <Proctoring 
                  isActive={true}
                  isSetupMode={isProctoringSetup}
                  onAlert={handleProctoringAlert}
                  onSetupComplete={handleProctoringSetupComplete}
                  onViolation={handleProctoringViolation}
                  onEndTest={() => handleTestEnd('Test ended by proctor')}
                />
              </Paper>
            </Grid>
          )}
        </>
      ) : (
        <>
          {isProctoringActive && (
            <Box sx={{ 
              position: 'fixed', 
              top: 20, 
              right: 20, 
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 1,
              borderRadius: 1,
              boxShadow: 2
            }}>
              <Proctoring 
                isActive={true}
                onAlert={handleProctoringAlert}
                onViolation={handleProctoringViolation}
                onEndTest={() => handleTestEnd('Test ended by proctor')}
                navigate={'/home'}
              />
            </Box>
          )}
          
          {examStarted && selectedTest && (
            <Box sx={{ mt: 3 }}>
              {currentSection === 'mcq' ? (
                selectedTest?.mcqs && Array.isArray(selectedTest.mcqs) && selectedTest.mcqs.length > 0 ? (
                  <MCQSection 
                    testId={selectedTest._id}
                    mcqs={selectedTest.mcqs} 
                    onComplete={handleSectionComplete}
                  />
                ) : (
                  <Typography variant="body1">No MCQ questions available for this test.</Typography>
                )
              ) : currentSection === 'coding' && selectedTest.codingChallenges && Array.isArray(selectedTest.codingChallenges) && selectedTest.codingChallenges.length > 0 ? (
                <CodingChallengeSection 
                  testId={selectedTest._id}
                  challenges={selectedTest.codingChallenges} 
                  onAllChallengesCompleted={handleSectionComplete}
                />
              ) : (
                <Typography variant="body1">No questions available for this section.</Typography>
              )}
            </Box>
          )}
        </>
      )}
      
      <ToastContainer />
    </Box>
  );
};

export default TestPage;
