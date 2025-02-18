//backend/scripts/seedDb.js

const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const Society = require('../models/Society');
const societies = require('../data/societies');
const mongoose = require('mongoose');

connectDB();

const importData = async () => {
    try {
        await Society.deleteMany();
        await Society.insertMany(societies);
        console.log('Society data imported successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();