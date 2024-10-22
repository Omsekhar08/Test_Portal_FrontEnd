import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';

const MCQManager = ({ onSubmit }) => {
  const [mcqs, setMcqs] = useState([]);
  const [currentMcq, setCurrentMcq] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'option') {
      const newOptions = [...currentMcq.options];
      newOptions[index] = value;
      setCurrentMcq({ ...currentMcq, options: newOptions });
    } else {
      setCurrentMcq({ ...currentMcq, [name]: value });
    }
  };

  const handleCorrectAnswerChange = (index) => {
    const newCorrectAnswers = currentMcq.correctAnswers.includes(index)
      ? currentMcq.correctAnswers.filter(i => i !== index)
      : [...currentMcq.correctAnswers, index];
    setCurrentMcq({ ...currentMcq, correctAnswers: newCorrectAnswers });
  };

  const handleAddMcq = () => {
    if (currentMcq.question && currentMcq.options.some(option => option !== '') && currentMcq.correctAnswers.length > 0) {
      setMcqs([...mcqs, currentMcq]);
      setCurrentMcq({
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [],
      });
      onSubmit([...mcqs, currentMcq]);
    } else {
      alert('Please fill in all required fields for the MCQ.');
    }
  };

  return (
    <Box>
      {mcqs.map((mcq, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">Question {index + 1}</Typography>
          <Typography>{mcq.question}</Typography>
          {mcq.options.map((option, optionIndex) => (
            <Typography key={optionIndex}>
              {optionIndex + 1}. {option} {mcq.correctAnswers.includes(optionIndex) ? '(Correct)' : ''}
            </Typography>
          ))}
        </Box>
      ))}
      <TextField
        fullWidth
        label="Question"
        name="question"
        value={currentMcq.question}
        onChange={handleInputChange}
        margin="normal"
      />
      {currentMcq.options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            name="option"
            value={option}
            onChange={(e) => handleInputChange(e, index)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentMcq.correctAnswers.includes(index)}
                onChange={() => handleCorrectAnswerChange(index)}
              />
            }
            label="Correct"
          />
        </Box>
      ))}
      <Button onClick={handleAddMcq} variant="contained" color="primary" sx={{ mt: 2 }}>
        Add MCQ
      </Button>
    </Box>
  );
};

export default MCQManager;
