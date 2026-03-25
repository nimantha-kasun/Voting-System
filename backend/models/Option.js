const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option_text: { type: String, required: true },
  poll_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  vote_count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Option', optionSchema);