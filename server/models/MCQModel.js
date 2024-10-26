const mongoose = require('mongoose');

const MCQSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswers: [{
    type: Number,
    required: true
  }],
  isMultipleAnswer: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('MCQ', MCQSchema);
