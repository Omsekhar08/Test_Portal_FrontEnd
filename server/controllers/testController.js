const Test = require('../models/Test');

const registerForTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        // First check if the test exists
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Ensure num_participants is a number
        const currentParticipants = parseInt(test.num_participants) || 0;

        // Update the test participant count
        await Test.findByIdAndUpdate(id, { 
            $set: { num_participants: currentParticipants + 1 }, // Use $set instead of $inc
            $push: { participants: { name, email } }
        });

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error registering for test:', error);
        res.status(500).json({ 
            message: 'Error registering for test', 
            error: error.message 
        });
    }
};

module.exports = {
    registerForTest,
};
