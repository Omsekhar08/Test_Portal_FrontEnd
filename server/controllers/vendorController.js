const Test = require('../models/Test');
const MCQ = require('../models/MCQModel');
const CodingChallenge = require('../models/codingModel');

exports.createTest = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      duration, 
      difficulty,
      mcqs,
      codingChallenges 
    } = req.body;

    // Create the main test
    const newTest = new Test({
      title,
      description,
      duration,
      difficulty,
      vendorId: req.user.id // From auth middleware
    });

    // Save MCQs if provided
    if (mcqs && mcqs.length > 0) {
      const createdMCQs = await Promise.all(mcqs.map(async (mcq) => {
        const newMCQ = new MCQ({
          question: mcq.question,
          options: mcq.options,
          correctAnswers: mcq.correctAnswers,
          test: newTest._id
        });
        return await newMCQ.save();
      }));
      newTest.mcqs = createdMCQs.map(mcq => mcq._id);
    }

    // Save Coding Challenges if provided
    if (codingChallenges && codingChallenges.length > 0) {
      const createdChallenges = await Promise.all(codingChallenges.map(async (challenge) => {
        const newChallenge = new CodingChallenge({
          title: challenge.title,
          description: challenge.description,
          testCases: challenge.testCases,
          test: newTest._id
        });
        return await newChallenge.save();
      }));
      newTest.codingChallenges = createdChallenges.map(challenge => challenge._id);
    }

    await newTest.save();

    res.status(201).json({
      status: 'success',
      data: newTest
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getVendorTests = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    // Ensure vendor can only access their own tests
    if (vendorId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    const tests = await Test.find({ vendorId })
      .populate('mcqs')
      .populate('codingChallenges');

    res.status(200).json({
      status: 'success',
      data: tests
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('mcqs')
      .populate('codingChallenges');

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    res.status(200).json({
      status: 'success',
      data: test
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only update their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own tests'
      });
    }

    const { 
      title, 
      description, 
      duration, 
      difficulty,
      mcqs,
      codingChallenges 
    } = req.body;

    // Update basic test info
    test.title = title;
    test.description = description;
    test.duration = duration;
    test.difficulty = difficulty;

    // Update MCQs if provided
    if (mcqs && mcqs.length > 0) {
      // Delete existing MCQs
      await MCQ.deleteMany({ test: test._id });
      
      // Create new MCQs
      const createdMCQs = await Promise.all(mcqs.map(async (mcq) => {
        const newMCQ = new MCQ({
          question: mcq.question,
          options: mcq.options,
          correctAnswers: mcq.correctAnswers,
          test: test._id
        });
        return await newMCQ.save();
      }));
      test.mcqs = createdMCQs.map(mcq => mcq._id);
    }

    // Update Coding Challenges if provided
    if (codingChallenges && codingChallenges.length > 0) {
      // Delete existing challenges
      await CodingChallenge.deleteMany({ test: test._id });
      
      // Create new challenges
      const createdChallenges = await Promise.all(codingChallenges.map(async (challenge) => {
        const newChallenge = new CodingChallenge({
          title: challenge.title,
          description: challenge.description,
          testCases: challenge.testCases,
          test: test._id
        });
        return await newChallenge.save();
      }));
      test.codingChallenges = createdChallenges.map(challenge => challenge._id);
    }

    await test.save();

    res.status(200).json({
      status: 'success',
      data: test
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only delete their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own tests'
      });
    }

    // Delete associated MCQs and Coding Challenges
    await MCQ.deleteMany({ test: test._id });
    await CodingChallenge.deleteMany({ test: test._id });
    
    // Delete the test
    await Test.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Test deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 

exports.getTestAnalytics = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('results')
      .populate('participants');

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    const analytics = {
      totalParticipants: test.participants.length,
      completedTests: test.results.filter(result => result.completed).length,
      averageScore: test.results.reduce((acc, result) => acc + result.score, 0) / test.results.length || 0,
      // Add more analytics as needed
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestAnalyticsParticipants = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('participants', 'name email registeredAt');

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    const participantAnalytics = {
      totalParticipants: test.participants.length,
      participantsList: test.participants,
      // Add more participant-specific analytics as needed
    };

    res.status(200).json({
      status: 'success',
      data: participantAnalytics
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestStatus = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    // You might want to add additional status-related logic here
    const status = {
      isActive: test.isActive,
      totalParticipants: test.participants?.length || 0,
      // Add other status fields as needed
    };

    res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestParticipants = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('participants', 'name email'); // Adjust fields as needed

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    res.status(200).json({
      status: 'success',
      data: test.participants
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate({
        path: 'results',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    res.status(200).json({
      status: 'success',
      data: test.results
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestAnalyticsResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('results');

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    // Calculate analytics based on results
    const analytics = {
      totalParticipants: test.results.length,
      averageScore: test.results.reduce((acc, result) => acc + result.score, 0) / test.results.length,
      // Add more analytics as needed
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestCompletedUsers = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate({
        path: 'results',
        match: { completed: true },
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Ensure vendor can only access their own test
    if (test.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own tests'
      });
    }

    const completedUsers = test.results.map(result => result.userId);

    res.status(200).json({
      status: 'success',
      data: completedUsers
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};