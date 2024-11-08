import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import MCQManager from './MCQManager';
import CodingChallengeManager from './CodingChallengeManager';
import { AuthContext } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({ name: '', date: '', mcqQuestions: [], codingChallenges: [] });
  const [editingTest, setEditingTest] = useState(null);
  const [showAddTestForm, setShowAddTestForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionType, setCurrentQuestionType] = useState('mcq');
  const [currentTestId, setCurrentTestId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleAddTest = () => {
    setShowAddTestForm(true);
  };

  const handleMCQSubmit = async (mcqs) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/tests/${currentTestId}/mcq`, 
        { mcqs }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewTest(prev => ({
        ...prev,
        mcqQuestions: [...prev.mcqQuestions, ...response.data]
      }));
      console.log('MCQs added successfully', response.data);
    } catch (error) {
      console.error('Error adding MCQs:', error);
    }
  };

  const handleCodingChallengeSubmit = (challenge) => {
    setNewTest(prev => ({
      ...prev,
      codingChallenges: [...prev.codingChallenges, challenge]
    }));
  };

  const handleSaveTest = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/tests`, 
        newTest, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const savedTest = response.data;
      setTests(prev => [...prev, savedTest]);
      setShowAddTestForm(false);
      setNewTest({ name: '', date: '', mcqQuestions: [], codingChallenges: [] });
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const handleUpdateTest = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/tests/${editingTest._id}`, 
        editingTest, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEditingTest(null);
      fetchTests();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleDeleteTest = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Button onClick={handleAddTest}>Add Test</Button>

      <Dialog open={showAddTestForm} onClose={() => setShowAddTestForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Test</DialogTitle>
        <DialogContent>
          <TextField
            label="Test Name"
            value={newTest.name}
            onChange={(e) => setNewTest({...newTest, name: e.target.value})}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Test Date"
            type="date"
            value={newTest.date}
            onChange={(e) => setNewTest({...newTest, date: e.target.value})}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <MCQManager onSubmit={handleMCQSubmit} />
          <CodingChallengeManager onSubmit={handleCodingChallengeSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveTest}>Save Test</Button>
        </DialogActions>
      </Dialog>

      <List>
        {tests.map((test) => (
          <ListItem key={test._id}>
            <ListItemText 
              primary={test.name} 
              secondary={
                <>
                  {new Date(test.date).toLocaleDateString()}
                  <br />
                  MCQs: {test.mcqQuestions.length}
                  <br />
                  Coding Challenges: {test.codingChallenges.length}
                  <br />
                  Test URL: {`${window.location.origin}/test/${test._id}`}
                </>
              } 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => setEditingTest(test)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTest(test._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AdminDashboard;