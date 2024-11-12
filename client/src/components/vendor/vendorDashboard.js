import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  IconButton, 
  Dialog,
  Chip,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../../contexts/AuthContext';
import { apiHelper, endpoints } from '../../helpers';
import VendorTestManager from './VendorTestManager';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [openTestManager, setOpenTestManager] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  useEffect(() => {
    fetchTests();
  }, [user.id]);

  const fetchTests = async () => {
    try {
      const data = await apiHelper.get(endpoints.vendor.vendorTests(user.id));
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleCreateTest = () => {
    setEditingTest(null);
    setOpenTestManager(true);
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setOpenTestManager(true);
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await apiHelper.delete(endpoints.vendor.testById(testId));
        setTests(tests.filter(test => test.id !== testId));
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  const handleTestSubmit = async (testData) => {
    try {
      if (editingTest) {
        await apiHelper.put(
          endpoints.vendor.testById(editingTest.id),
          testData
        );
      } else {
        await apiHelper.post(
          endpoints.vendor.tests,
          testData
        );
      }
      setOpenTestManager(false);
      fetchTests();
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Vendor Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateTest}
        >
          Create New Test
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tests
              </Typography>
              <Typography variant="h4">
                {tests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Tests
              </Typography>
              <Typography variant="h4">
                {tests.filter(test => test.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Candidates
              </Typography>
              <Typography variant="h4">
                {tests.reduce((acc, test) => acc + (test.candidates?.length || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tests Grid */}
      <Typography variant="h5" sx={{ mb: 3 }}>My Tests</Typography>
      <Grid container spacing={3}>
        {tests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {test.title}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  {test.description}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip 
                    label={`${test.duration} mins`} 
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    label={test.difficulty} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2">
                  MCQs: {test.mcqs?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Coding Challenges: {test.codingChallenges?.length || 0}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditTest(test)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteTest(test.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button 
                  size="small" 
                  onClick={() => {/* Handle view results */}}
                  sx={{ ml: 'auto' }}
                >
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Test Manager Dialog */}
      <Dialog 
        open={openTestManager} 
        onClose={() => setOpenTestManager(false)}
        maxWidth="md"
        fullWidth
      >
        <VendorTestManager
          test={editingTest}
          onSubmit={handleTestSubmit}
          onCancel={() => setOpenTestManager(false)}
        />
      </Dialog>
    </Box>
  );
};

export default VendorDashboard;
