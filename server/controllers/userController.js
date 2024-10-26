const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const MCQ = require('../models/MCQModel');  
const MCQSubmission = require('../models/MCQSubmission');  // You might need to create this model
const UserScore = require('../models/UserScore');  // You might need to create this model

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role , username: user.username  } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  res.send(req.user);
};

exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTest = async (req, res) => {
  console.log('getTest function called');
  try {
    console.log('Fetching tests from database');
    const tests = await Test.find().populate('mcqs').populate('codingChallenges');
    console.log(`Found ${tests.length} tests`);
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};


exports.executeCode = async (req, res) => {
  try {
    const { codingChallengeId } = req.params;
    const { code, language } = req.body;

    const challenge = await CodingChallenge.findById(codingChallengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    if (!challenge.languages.includes(language)) {
      return res.status(400).json({ message: 'Language not supported for this challenge' });
    }

    const testCases = challenge.testCases.filter(test => test.isVisible);
    const results = await executeCode(code, language, testCases);

    res.json({ results });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: 'Error executing code', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }  
};

exports.submitMCQs = async (req, res) => {
  try {
    const { testId } = req.params;
    const { userAnswers } = req.body;

    console.log('Received testId:', testId);
    console.log('Received userAnswers:', userAnswers);

    if (!testId || !userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Fetch the test and its questions
    const test = await Test.findById(testId).populate('mcqs');
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = test.mcqs;
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "No questions found for this test" });
    }

    let score = 0;
    const totalQuestions = questions.length;

    userAnswers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    // Save the user's score
    const userScore = new UserScore({
      user: req.user._id,
      test: testId,
      score: score,
      totalQuestions: totalQuestions
    });
    await userScore.save();

    res.status(200).json({ message: "MCQ answers submitted successfully", score, totalQuestions });
  } catch (error) {
    console.error("Error in submitMCQs:", error);
    res.status(500).json({ message: "Error submitting MCQs", error: error.message });
  }
};

// Implement this function based on your scoring logic
function calculateScore(userAnswers, questions) {
  if (!Array.isArray(userAnswers) || !Array.isArray(questions)) {
    console.error('Invalid input for score calculation:', { userAnswers, questions });
    return 0;
  }

  return userAnswers.reduce((score, userAnswer) => {
    const question = questions.find(q => q._id.toString() === userAnswer.questionId);
    if (question && arraysEqual(userAnswer.selectedAnswers, question.correctAnswers)) {
      return score + 1;
    }
    return score;
  }, 0);
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

exports.refreshToken = async (req, res) => {
  try {
    const user = req.user;
    const newToken = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
