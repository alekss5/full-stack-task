// models/Photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
