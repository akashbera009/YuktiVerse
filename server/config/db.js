// db.js

import mongoose from 'mongoose';
// const dotenv = require('dotenv');
// dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed:`, error.message);
    process.exit(1);
  }
};

// module.exports = connectDB;
export default connectDB; // ✅ ESM compatible

