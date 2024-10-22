import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Paper, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

const TestDetailsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/test/${testId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTest(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Failed to load test details');
        setLoading(false);
      }
    };

    fetchTestDetails();

    if (user) {
      setRegistrationData({
        name: user.username || '',
        email: user.email || ''
      });
    }
  }, [testId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/tests/${testId}/register`, registrationData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRegistered(true);
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Error registering for test:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleStartTest = () => {
    navigate(`/test/${testId}/start`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!test) {
    return <Typography>Test not found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>{test.name}</Typography>
        <Typography variant="body1" paragraph>{test.description}</Typography>
        <Typography variant="body2">Duration: {test.duration} minutes</Typography>
        <Typography variant="body2">Price: ${test.price || 'Free'}</Typography>
        <Typography variant="body2" gutterBottom>Number of Participants: {test.num_participants || 'infinity'}</Typography>
        <Typography variant="body2">Proctoring: {test.proctoring ? 'Yes' : 'No'}</Typography>
        <Typography variant="body2">Number of MCQs: {test.mcqs.length}</Typography>
        <Typography variant="body2" gutterBottom>Number of Coding Challenges: {test.codingChallenges.length}</Typography>
        
         
      </Paper>

      {!registered ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Register for Test</Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={registrationData.name}
              onChange={handleInputChange}
              disabled
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registrationData.email}
              onChange={handleInputChange}
              margin="normal"
              disabled
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>
        </Paper>
      ) : (
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
  );
};

export default TestDetailsPage;
