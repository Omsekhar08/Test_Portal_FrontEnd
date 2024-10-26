const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'admin' }
});

adminSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

adminSchema.statics.getAllUsers = async function() {
  return this.find({}, '-password');
};

// Static method to get a user by ID
adminSchema.statics.getUserById = async function(id) {
  return this.findById(id, '-password');
};

// Static method to delete a user by ID
adminSchema.statics.deleteUserById = async function(id) {
  return this.findByIdAndDelete(id);
};

const Admin = mongoose.model('Admin', adminSchema);

// Function to create a test admin user
async function createTestAdmin() {
  try {
    const testAdmin = {
      username: 'testadmin',
      password: 'testpassword123',
      email: 'testadmin@example.com'
    };

    const existingAdmin = await Admin.findOne({ username: testAdmin.username });
    if (existingAdmin) {
      console.log('Test admin already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testAdmin.password, salt);

    const newAdmin = new Admin({
      ...testAdmin,
      password: hashedPassword
    });

    await newAdmin.save();
    console.log('Test admin created successfully');
  } catch (error) {
    console.error('Error creating test admin:', error);
  }
}

module.exports = {
  Admin,
  createTestAdmin
};
