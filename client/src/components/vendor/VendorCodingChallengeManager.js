import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const VendorCodingChallengeManager = ({ onSubmit }) => {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    testCases: [{ input: '', expectedOutput: '' }],
    languages: ['javascript'], // Default language
  });

  const availableLanguages = [
    'javascript',
    'python',
    'java',
    'cpp',
    'csharp'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentChallenge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (event) => {
    setCurrentChallenge(prev => ({
      ...prev,
      languages: event.target.value
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...currentChallenge.testCases];
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value
    };
    setCurrentChallenge(prev => ({
      ...prev,
      testCases: newTestCases
    }));
  };

  const addTestCase = () => {
    setCurrentChallenge(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
  };

  const removeTestCase = (index) => {
    setCurrentChallenge(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleAddChallenge = () => {
    if (validateChallenge()) {
      const newChallenges = [...challenges, currentChallenge];
      setChallenges(newChallenges);
      setCurrentChallenge({
        title: '',
        description: '',
        difficulty: 'medium',
        testCases: [{ input: '', expectedOutput: '' }],
        languages: ['javascript']
      });
      onSubmit(newChallenges);
    }
  };

  const handleDeleteChallenge = (index) => {
    const newChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(newChallenges);
    onSubmit(newChallenges);
  };

  const validateChallenge = () => {
    if (!currentChallenge.title.trim()) {
      alert('Please enter a title');
      return false;
    }
    if (!currentChallenge.description.trim()) {
      alert('Please enter a description');
      return false;
    }
    if (currentChallenge.testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
      alert('Please fill in all test cases');
      return false;
    }
    return true;
  };

  return (
    <Box>
      {/* Display existing challenges */}
      {challenges.map((challenge, index) => (
        <Paper key={index} elevation={2} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{challenge.title}</Typography>
            <IconButton onClick={() => handleDeleteChallenge(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Difficulty: {challenge.difficulty}
          </Typography>
          <Typography>{challenge.description}</Typography>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Supported Languages: {challenge.languages.join(', ')}
          </Typography>
        </Paper>
      ))}

      {/* Add new challenge form */}
      <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Add New Coding Challenge</Typography>
        
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={currentChallenge.title}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={currentChallenge.description}
          onChange={handleInputChange}
          margin="normal"
          required
          multiline
          rows={4}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select
            name="difficulty"
            value={currentChallenge.difficulty}
            onChange={handleInputChange}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Programming Languages</InputLabel>
          <Select
            multiple
            value={currentChallenge.languages}
            onChange={handleLanguageChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {availableLanguages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2 }}>Test Cases</Typography>
        {currentChallenge.testCases.map((testCase, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Input"
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
              fullWidth
            />
            <TextField
              label="Expected Output"
              value={testCase.expectedOutput}
              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
              fullWidth
            />
            <IconButton 
              onClick={() => removeTestCase(index)}
              disabled={currentChallenge.testCases.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addTestCase}
          sx={{ mb: 2 }}
        >
          Add Test Case
        </Button>

        <Box sx={{ mt: 2 }}>
          <Button 
            onClick={handleAddChallenge} 
            variant="contained" 
            color="primary"
          >
            Add Challenge
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorCodingChallengeManager; 