// User Model - for both Students and Admins
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    sparse: true, // Allows null values for students who don't have email
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Student-specific fields
  rollNumber: {
    type: String,
    sparse: true, // Allows null for admin users
    uppercase: true,
    trim: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  section: {
    type: String,
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Pre-save hook to hash passwords automatically if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const bcrypt = require('bcrypt');
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  try {
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
