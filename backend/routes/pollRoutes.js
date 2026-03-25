const express = require('express');
const router = express.Router();
const { createPoll, getAllPolls, getPollDetails, togglePollStatus, deletePoll } = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'Student'), getAllPolls);
router.get('/:id', protect, authorize('Admin', 'Student'), getPollDetails);
router.post('/', protect, authorize('Admin'), createPoll);
router.patch('/:id/status', protect, authorize('Admin'), togglePollStatus);
router.delete('/:id', protect, authorize('Admin'), deletePoll);

module.exports = router;