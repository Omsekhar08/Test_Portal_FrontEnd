import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, CircularProgress, Grid, Card, CardContent, CardActions } from '@mui/material';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { apiHelper, endpoints } from '../../helpers';

const TestDetailsPage = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await apiHelper.get(endpoints.tests.all);
        setTests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('Failed to load tests');
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Available Tests</Typography>
      <Grid container spacing={3}>
        {tests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test._id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>{test.name}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {test.description}
                </Typography>
                <Typography variant="body2">Duration: {test.duration} minutes</Typography>
                <Typography variant="body2">Price: ${test.price || 'Free'}</Typography>
                <Typography variant="body2">
                  Participants: {test.num_participants || 'Unlimited'}
                </Typography>
                <Typography variant="body2">
                  Questions: {test.mcqs?.length || 0} MCQs, {test.codingChallenges?.length || 0} Coding
                </Typography>
                <Typography variant="body2">
                  Proctoring: {test.proctoring ? 'Required' : 'Not Required'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => navigate(`/test/${test._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestDetailsPage;
