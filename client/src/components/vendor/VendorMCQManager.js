import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const VendorMCQManager = ({ onSubmit }) => {
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
    if (validateMcq()) {
      const newMcqs = [...mcqs, currentMcq];
      setMcqs(newMcqs);
      setCurrentMcq({
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [],
      });
      onSubmit(newMcqs);
    }
  };

  const handleDeleteMcq = (index) => {
    const newMcqs = mcqs.filter((_, i) => i !== index);
    setMcqs(newMcqs);
    onSubmit(newMcqs);
  };

  const validateMcq = () => {
    if (!currentMcq.question.trim()) {
      alert('Please enter a question');
      return false;
    }
    if (currentMcq.options.some(option => !option.trim())) {
      alert('Please fill in all options');
      return false;
    }
    if (currentMcq.correctAnswers.length === 0) {
      alert('Please select at least one correct answer');
      return false;
    }
    return true;
  };

  return (
    <Box>
      {/* Display existing MCQs */}
      {mcqs.map((mcq, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Question {index + 1}</Typography>
            <IconButton onClick={() => handleDeleteMcq(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography>{mcq.question}</Typography>
          {mcq.options.map((option, optionIndex) => (
            <Typography key={optionIndex}>
              {optionIndex + 1}. {option} 
              {mcq.correctAnswers.includes(optionIndex) && 
                <span style={{ color: 'green' }}> (Correct)</span>
              }
            </Typography>
          ))}
        </Box>
      ))}

      {/* Add new MCQ form */}
      <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Add New Question</Typography>
        <TextField
          fullWidth
          label="Question"
          name="question"
          value={currentMcq.question}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        {currentMcq.options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              label={`Option ${index + 1}`}
              name="option"
              value={option}
              onChange={(e) => handleInputChange(e, index)}
              margin="normal"
              required
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
        <Button 
          onClick={handleAddMcq} 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Add Question
        </Button>
      </Box>
    </Box>
  );
};

export default VendorMCQManager; 