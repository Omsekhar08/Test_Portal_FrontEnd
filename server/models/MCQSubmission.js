const mongoose = require('mongoose');

const MCQSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mcq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQ',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: [{
    questionId: String,
    selectedAnswers: [String]
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MCQSubmission', MCQSubmissionSchema);
