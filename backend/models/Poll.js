const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);