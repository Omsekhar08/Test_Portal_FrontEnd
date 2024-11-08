const mongoose = require('mongoose');
const Test = require('../models/Test');

async function fixParticipantsType() {
  try {
    const tests = await Test.find({});
    
    for (let test of tests) {
      // Convert string to number or set to 0 if invalid
      const numParticipants = parseInt(test.num_participants) || 0;
      
      await Test.findByIdAndUpdate(test._id, {
        $set: { num_participants: numParticipants }
      });
    }
    
    console.log('Successfully updated all test documents');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the fix
mongoose.connect('your_mongodb_connection_string')
  .then(() => fixParticipantsType()); 