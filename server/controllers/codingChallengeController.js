const CodingChallenge = require('../models/codingModel');

exports.submitCodingChallenge = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newChallenge = new CodingChallenge({ title, description, difficulty, testCases });
    await newChallenge.save();

    res.status(201).json({
      message: 'Coding challenge submitted successfully',
      challenge: newChallenge
    });
  } catch (error) {
    console.error('Error submitting coding challenge:', error);
    res.status(500).json({ message: 'Error submitting coding challenge', error: error.message });
  }
};

exports.getCodingChallenges = async (req, res) => {
  try {
    const challenges = await CodingChallenge.find();
    res.status(200).json({ challenges });
  } catch (error) {
    console.error('Error fetching coding challenges:', error);
    res.status(500).json({ message: 'Error fetching coding challenges', error: error.message });
  }
};

exports.deleteCodingChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    await CodingChallenge.findByIdAndDelete(id);
    res.status(200).json({ message: 'Coding challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting coding challenge:', error);
    res.status(500).json({ message: 'Error deleting coding challenge', error: error.message });
  }
};

exports.updateCodingChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, testCases } = req.body;

    if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedChallenge = await CodingChallenge.findByIdAndUpdate(id, { title, description, difficulty, testCases }, { new: true });
    res.status(200).json({
      message: 'Coding challenge updated successfully',
      challenge: updatedChallenge
    });
  } catch (error) {
    console.error('Error updating coding challenge:', error);
    res.status(500).json({ message: 'Error updating coding challenge', error: error.message });
  }
};

exports.getCodingChallenge = async (req, res) => {
  try {
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching coding challenge:', error);
    res.status(500).json({ message: 'Error fetching coding challenge', error: error.message });
  }
};

exports.submitCodingChallengeSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, testResults, passed } = req.body;

    // Here you would typically save the submission to the database
    // and perform any necessary processing

    res.status(200).json({
      message: 'Solution submitted successfully',
      submission: { challengeId: id, code, language, testResults, passed }
    });
  } catch (error) {
    console.error('Error submitting coding challenge solution:', error);
    res.status(500).json({ message: 'Error submitting solution', error: error.message });
  }
};
