//backend/models/society.js

const mongoose = require('mongoose');
const SocietySchema = new mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    blocks: [{
        name: String,
        flats: [Number]
    }]
});
module.exports = mongoose.model('Society', SocietySchema);