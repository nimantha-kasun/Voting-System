const Poll = require('../models/Poll');
const Option = require('../models/Option');
const Vote = require('../models/Vote');

exports.createPoll = async (req, res) => {
    try {
        const { title, deadline, options } = req.body; // options is an array of strings

        const newPoll = new Poll({
            title,
            deadline,
            created_by: req.user.id
        });
        const savedPoll = await newPoll.save();

        // Create options for this poll
        const optionObjects = options.map(text => ({
            option_text: text,
            poll_id: savedPoll._id
        }));
        await Option.insertMany(optionObjects);

        res.status(201).json(savedPoll);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single poll with options
exports.getPollDetails = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        const options = await Option.find({ poll_id: req.params.id });
        res.json({ poll, options });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.togglePollStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const poll = await Poll.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!poll) return res.status(404).json({ message: 'Poll not found' });
        
        res.json({ message: `Poll status updated to ${status}`, poll });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getPollDetails = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        const options = await Option.find({ poll_id: req.params.id });
        
        const userVote = await Vote.findOne({ 
            user_id: req.user.id, 
            poll_id: req.params.id 
        });

        res.json({ 
            poll, 
            options, 
            userVotedOption: userVote ? userVote.option_id : null 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// controllers/pollController.js
exports.deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        await Poll.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};