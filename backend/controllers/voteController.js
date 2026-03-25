const Vote = require('../models/Vote');
const Option = require('../models/Option');
const Poll = require('../models/Poll');

exports.castVote = async (req, res) => {
    try {
        const { poll_id, option_id } = req.body;
        const user_id = req.user.id;

        // 1. Check if poll is still open
        const poll = await Poll.findById(poll_id);
        if (new Date() > new Date(poll.deadline)) {
            return res.status(400).json({ message: 'Poll has ended' });
        }

        // 2. Check if already voted (Database unique index will also catch this)
        const existingVote = await Vote.findOne({ user_id, poll_id });
        if (existingVote) return res.status(400).json({ message: 'You have already voted on this poll' });

        // 3. Create Vote
        const newVote = new Vote({ user_id, poll_id, option_id });
        await newVote.save();

        // 4. Update Vote Count in Option Table
        await Option.findByIdAndUpdate(option_id, { $inc: { vote_count: 1 } });

        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};