const MCQ = require('../models/MCQModel');

exports.submitMCQs = async (req, res) => {
  try {
    const { mcqs, testId } = req.body;
    
    console.log('Received MCQs:', mcqs);
    console.log('Test ID:', testId);

    if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0 || !testId) {
      return res.status(400).json({ message: 'Invalid MCQ data or missing test ID' });
    }

    const mcqsWithTestId = mcqs.map(mcq => ({
      ...mcq,
      test: testId
    }));

    const savedMCQs = await MCQ.create(mcqsWithTestId);

    console.log('Saved MCQs:', savedMCQs);

    res.status(201).json({
      message: 'MCQs submitted successfully',
      mcqs: savedMCQs
    });
  } catch (error) {
    console.error('Error submitting MCQs:', error);
    res.status(500).json({ message: 'Error submitting MCQs', error: error.message });
  }
};

exports.getMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.status(200).json(mcqs);
  } catch (error) {
    console.error('Error fetching MCQs:', error);
    res.status(500).json({ message: 'Error fetching MCQs', error: error.message });
  }
};

exports.deleteMCQsById = async (req, res) => {
  try {
    const { id } = req.params;
    await MCQ.findByIdAndDelete(id);
    res.status(200).json({ message: 'MCQs deleted successfully' });
  } catch (error) {
    console.error('Error deleting MCQs:', error);
    res.status(500).json({ message: 'Error deleting MCQs', error: error.message });
  }
};

exports.getMCQsById = async (req, res) => {
  try {
    const { id } = req.params;
    const mcqs = await MCQ.findById(id);
    res.status(200).json(mcqs);
  } catch (error) {
    console.error('Error fetching MCQs by ID:', error);
    res.status(500).json({ message: 'Error fetching MCQs by ID', error: error.message });
  }
};

exports.updateMCQsById = async (req, res) => {
  try {
    const { id } = req.params;
    const mcqs = req.body;
    const updatedMCQs = await MCQ.findByIdAndUpdate(id, mcqs, { new: true });
    res.status(200).json(updatedMCQs);
  } catch (error) {
    console.error('Error updating MCQs by ID:', error);
    res.status(500).json({ message: 'Error updating MCQs by ID', error: error.message });
  }
};
