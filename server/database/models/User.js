const { google } = require('googleapis');
const mongoose = require('mongoose');
const { any } = require('zod');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
    },
    accessToken: {
      type: String,
      required: true,
      default: '',
    },
    refreshToken: {
      type: String,
      required: false,
      default: undefined,
    },
    googleId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'Users',
  }
);

module.exports = mongoose.model('User', userSchema);
