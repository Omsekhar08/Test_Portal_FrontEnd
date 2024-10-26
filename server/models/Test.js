const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  num_participants: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  proctoring: {
    type: Boolean,
    default: false
  },
  mcqs: [{
    type: Schema.Types.ObjectId,
    ref: 'MCQ'
  }],
  codingChallenges: [{
    type: Schema.Types.ObjectId,
    ref: 'CodingChallenge'
  }]
}); 

module.exports = mongoose.model('Test', testSchema);