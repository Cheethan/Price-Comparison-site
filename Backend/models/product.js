const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Name of the counter
  sequence_value: { type: Number, default: 0 } // Counter value
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
