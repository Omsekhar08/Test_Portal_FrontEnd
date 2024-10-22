import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

const CodingChallengeManager = ({ onSubmit }) => {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    testCases: [{ input: '', output: '' }],
    languages: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentChallenge({ ...currentChallenge, [name]: value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...currentChallenge.testCases];
    newTestCases[index][field] = value;
    setCurrentChallenge({ ...currentChallenge, testCases: newTestCases });
  };

  const handleAddTestCase = () => {
    setCurrentChallenge({
      ...currentChallenge,
      testCases: [...currentChallenge.testCases, { input: '', output: '' }],
    });
  };

  const handleLanguageChange = (event) => {
    setCurrentChallenge({ ...currentChallenge, languages: event.target.value });
  };

  const handleAddChallenge = () => {
    if (currentChallenge.title && currentChallenge.description && currentChallenge.languages.length > 0) {
      setChallenges([...challenges, currentChallenge]);
      setCurrentChallenge({
        title: '',
        description: '',
        difficulty: 'Easy',
        testCases: [{ input: '', output: '' }],
        languages: [],
      });
      onSubmit([...challenges, currentChallenge]);
    } else {
      alert('Please fill in all required fields for the coding challenge.');
    }
  };

  return (
    <Box>
      {challenges.map((challenge, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">Challenge {index + 1}: {challenge.title}</Typography>
          <Typography>Difficulty: {challenge.difficulty}</Typography>
          <Typography>Languages: {challenge.languages.join(', ')}</Typography>
        </Box>
      ))}
      <TextField
        fullWidth
        label="Challenge Title"
        name="title"
        value={currentChallenge.title}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Challenge Description"
        name="description"
        value={currentChallenge.description}
        onChange={handleInputChange}
        margin="normal"
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
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Languages</InputLabel>
        <Select
          multiple
          name="languages"
          value={currentChallenge.languages}
          onChange={handleLanguageChange}
        >
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="JavaScript">JavaScript</MenuItem>
          <MenuItem value="Java">Java</MenuItem>
          <MenuItem value="C++">C++</MenuItem>
        </Select>
      </FormControl>
      {currentChallenge.testCases.map((testCase, index) => (
        <Box key={index}>
          <TextField
            fullWidth
            label={`Test Case ${index + 1} Input`}
            value={testCase.input}
            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={`Test Case ${index + 1} Output`}
            value={testCase.output}
            onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
            margin="normal"
          />
        </Box>
      ))}
      <Button onClick={handleAddTestCase} variant="outlined" sx={{ mt: 1 }}>
        Add Test Case
      </Button>
      <Button onClick={handleAddChallenge} variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
        Add Coding Challenge
      </Button>
    </Box>
  );
};

export default CodingChallengeManager;
