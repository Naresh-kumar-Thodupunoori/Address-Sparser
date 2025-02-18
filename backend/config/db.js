//backend/config/db.js
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

// console.log("MongoDB URI:", process.env.MONGODB_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
module.exports = connectDB;