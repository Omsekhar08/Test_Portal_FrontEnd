const Test = require('../models/Test');

const registerForTest = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email} = req.body;
  
      await Test.findByIdAndUpdate(id, { $inc: { num_participants: 1 } });
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error registering for test:', error);
      res.status(500).json({ message: 'Error registering for test', error: error.message });
    }
  };

module.exports = {
  registerForTest,
};
