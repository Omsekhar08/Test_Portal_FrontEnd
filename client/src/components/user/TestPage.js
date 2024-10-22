import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Typography, CircularProgress, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import MCQSection from './MCQSection';
import CodingChallengeSection from './CodingChallengeSection';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Proctoring from './Proctoring';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const [tests, setTests] = useState([]);
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
  const [testState, setTestState] = useState({
    selectedTest: null,
    testStarted: false,
    isProctoringEnabled: false,
    isProctoringSetup: false,
    examStarted: false
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get('http://localhost:5000/api/users/test', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('API Response:', response.data);
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError(`Failed to load tests. ${err.message}`);
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTestSelect = (test) => {
    console.log('Test selected:', test);
    navigate(`/test/${test._id}`);
  };

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
  const handleProctoringSetup = useCallback((isSetup) => {
    setTestState(prevState => ({
      ...prevState,
      isProctoringSetup: isSetup,
      examStarted: isSetup  
    }));
  }, []);

  const startExam = useCallback(() => {
    if (!examStarted) {
      console.log('Exam started');
      setTestStarted(true);
      setExamStarted(true);
      toast.success('Exam started. Good luck!', { toastId: 'exam-start' });
    }
  }, [examStarted]);

  const handleProctoringAlert = useCallback((message) => {
    console.log('Proctoring alert:', message);
    toast.warn(message);
  }, []);

  const handleProctoringViolation = useCallback((violationType) => {
    console.log('Proctoring violation:', violationType);
    toast.error(`Proctoring violation detected: ${violationType}`);
    
  }, []);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (tests.length === 0) {
    return <Typography>No tests available.</Typography>;
  }

  console.log('Render state:', { selectedTest, testStarted, isProctoringEnabled, isProctoringSetup, examStarted });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Available Tests</Typography>
      
      {!selectedTest ? (
        <List>
          {tests.map((test) => (
            <ListItem 
              key={test._id} 
              button 
              onClick={() => handleTestSelect(test)}
              component={Paper}
              sx={{ mb: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              <ListItemText 
                primary={test.name} 
                secondary={`Duration: ${test.duration} minutes`} 
              />
            </ListItem>
          ))}
        </List>
      ) : !examStarted ? (
        <>
          <Box>
            <Typography variant="h5">{selectedTest.name}</Typography>
            <Typography variant="body1">{selectedTest.description}</Typography>
            <Typography variant="body2">Duration: {selectedTest.duration} minutes</Typography>
            <Typography variant="body2">Price: {selectedTest.price}</Typography>
            <Typography variant="body2">Number Of Participants: {selectedTest.num_participants}</Typography>
            {!isProctoringEnabled && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleStartTest}
                sx={{ mt: 2 }}
              >
                Start Test
              </Button>
            )}
          </Box>
          {isProctoringEnabled && (
            <Proctoring 
              isActive={true} 
              isSetupMode={isProctoringSetup}
              onAlert={handleProctoringAlert}
              onSetupComplete={handleProctoringSetupComplete}
            />
          )}
        </>
      ) : (
        <>
          {isProctoringActive && (
            <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
              <Proctoring 
                isActive={isProctoringActive}
                onAlert={handleProctoringAlert}
                onSetupComplete={handleProctoringSetupComplete}
                onViolation={handleProctoringViolation}
              />
            </Box>
          )}
          
          {examStarted && (
            <>
              {currentSection === 'mcq' && selectedTest.mcqs && selectedTest.mcqs.length > 0 && (
                <MCQSection 
                  testId={selectedTest._id}
                  mcqs={selectedTest.mcqs} 
                  onComplete={handleSectionComplete}
                />
              )}
              {currentSection === 'coding' && selectedTest.codingChallenges && selectedTest.codingChallenges.length > 0 && (
                <CodingChallengeSection 
                  testId={selectedTest._id}
                  challenges={selectedTest.codingChallenges} 
                  onAllChallengesCompleted={handleSectionComplete}
                />
              )}
              {currentSection === 'coding' && (!selectedTest.codingChallenges || selectedTest.codingChallenges.length === 0) && (
                <Typography>No coding challenges available for this test.</Typography>
              )}
            </>
          )}
        </>
      )}
      
      <ToastContainer />
    </Box>
  );
};

export default TestPage;
