const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  poll_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  option_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true }
}, { timestamps: true });


voteSchema.index({ user_id: 1, poll_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);