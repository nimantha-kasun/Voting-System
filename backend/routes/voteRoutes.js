const express = require('express');
const router = express.Router();
const { castVote } = require('../controllers/voteController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Student'), castVote);

module.exports = router;