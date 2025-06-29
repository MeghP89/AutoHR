const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'IBM-Hackathon',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error: ', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
