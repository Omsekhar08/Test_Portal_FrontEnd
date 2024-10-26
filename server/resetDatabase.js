require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  const db = await connectDB();

  try {
    // Drop the codingchallenges collection
    await db.collection('codingchallenges').drop();
    console.log('Dropped codingchallenges collection');

    // Recreate the collection without indexes
    await db.createCollection('codingchallenges');
    console.log('Recreated codingchallenges collection');

    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

resetDatabase();
