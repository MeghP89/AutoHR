const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://easiesttofollow:0pY742fZn0Tl9KPE@cluster0.wo3ilvn.mongodb.net/', {
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
