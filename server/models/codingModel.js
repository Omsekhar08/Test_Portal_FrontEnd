const mongoose = require('mongoose');

const codingChallengeSchema = new mongoose.Schema({ 
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  testCases: [{
    input: { type: String, required: true },
    output: { type: String, required: true }
  }],
  languages: [{ type: String, required: true }]
}, { 
  timestamps: true,
  // Disable automatic index creation
  autoIndex: false 
});

const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);

module.exports = CodingChallenge;
