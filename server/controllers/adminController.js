const Test = require('../models/Test');
const MCQ = require('../models/MCQModel');
const CodingChallenge = require('../models/codingModel');

const createTest = async (req, res) => {
  try {
    const { name, description, duration, proctoring, mcqs, codingChallenges } = req.body;

    console.log('Received test data:', { name, description, duration, proctoring });
    console.log('Received MCQs:', mcqs);
    console.log('Received Coding Challenges:', codingChallenges);

    // First, create the Test document
    const newTest = new Test({
      name,
      description,
      duration,
      proctoring
    });

    const savedTest = await newTest.save();
    console.log('Saved test:', savedTest);

    // Now create MCQs with the test reference
    const createdMCQs = await Promise.all(mcqs.map(async (mcq) => {
      const newMCQ = new MCQ({
        question: mcq.question,
        options: mcq.options,
        correctAnswers: mcq.correctAnswers,
        isMultipleAnswer: mcq.isMultipleAnswer,
        test: savedTest._id
      });
      return await newMCQ.save();
    }));
    console.log('Created MCQs:', createdMCQs);

    // Create Coding Challenges
    const createdChallenges = await Promise.all(codingChallenges.map(async (challenge) => {
      const newChallenge = new CodingChallenge({
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        testCases: challenge.testCases,
        languages: challenge.languages,
        test: savedTest._id
      });
      return await newChallenge.save();
    }));
    console.log('Created Coding Challenges:', createdChallenges);

    // Update the Test document with the created MCQs and Coding Challenges
    savedTest.mcqs = createdMCQs.map(mcq => mcq._id);
    savedTest.codingChallenges = createdChallenges.map(challenge => challenge._id);
    await savedTest.save();

    res.status(201).json({ 
      message: 'Test created successfully',
      test: savedTest 
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};



exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    await Test.findByIdAndDelete(id);
    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMCQ = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const mcq = new MCQ({ question, options, correctAnswer });
    await mcq.save();
    res.status(201).json(mcq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    await MCQ.findByIdAndDelete(id);
    res.status(200).json({ message: 'MCQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCodingChallenge = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;
    const codingChallenge = new CodingChallenge({ title, description, difficulty, testCases });
    await codingChallenge.save();
    res.status(201).json(codingChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCodingChallenges = async (req, res) => {
  try {
    const codingChallenges = await CodingChallenge.find();
    res.status(200).json(codingChallenges); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCodingChallenge = async (req, res) => {
  try {
    const { id } = req.params;  
    await CodingChallenge.findByIdAndDelete(id);
    res.status(200).json({ message: 'Coding challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestById = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test', error: error.message });
  }
};
const UpdateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, proctoring, mcqs, codingChallenges } = req.body;
    const updatedTest = await Test.findByIdAndUpdate(id, { name, description, duration, proctoring, mcqs, codingChallenges }, { new: true });
    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json({ test: updatedTest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating test', error: error.message });
  }
};
const deleteTestById = async (req, res) => {
  try {
    const { id } = req.params;
    await Test.findByIdAndDelete(id);
    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const { name, description, duration, proctoring, mcqs, codingChallenges } = req.body;

    console.log('Received test data:', { name, description, duration, proctoring });
    console.log('Received MCQs:', mcqs);
    console.log('Received Coding Challenges:', codingChallenges);

    // First, create the Test document
    const newTest = new Test({
      name,
      description,
      duration,
      proctoring
    });

    const savedTest = await newTest.save();
    console.log('Saved test:', savedTest);

    // Now create MCQs with the test reference
    const createdMCQs = await Promise.all(mcqs.map(async (mcq) => {
      const newMCQ = new MCQ({
        question: mcq.question,
        options: mcq.options,
        correctAnswers: mcq.correctAnswers,
        isMultipleAnswer: mcq.isMultipleAnswer,
        test: savedTest._id
      });
      return await newMCQ.save();
    }));
    console.log('Created MCQs:', createdMCQs);

    // Create Coding Challenges
    const createdChallenges = await Promise.all(codingChallenges.map(async (challenge) => {
      const newChallenge = new CodingChallenge({
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        testCases: challenge.testCases,
        languages: challenge.languages,
        test: savedTest._id
      });
      return await newChallenge.save();
    }));
    console.log('Created Coding Challenges:', createdChallenges);

    // Update the Test document with the created MCQs and Coding Challenges
    savedTest.mcqs = createdMCQs.map(mcq => mcq._id);
    savedTest.codingChallenges = createdChallenges.map(challenge => challenge._id);
    await savedTest.save();

    res.status(201).json({ 
      message: 'Test created successfully',
      test: savedTest 
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};



module.exports = {
  createTest,
  getTests,
  getTestById,
  UpdateTest,
  deleteTestById,
};
