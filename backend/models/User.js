const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'academic-supervisor', 'workplace-supervisor', 'admin'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For workplace supervisors: set when they are invited via student internship start
    inviteToken: String,
    inviteTokenExpiry: Date,
    isInviteAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
// ✅ The Fix: Remove 'next' from the arguments if using async
userSchema.pre('save', async function() {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return; // Just return, don't call next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // No next() needed here when using async!
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
