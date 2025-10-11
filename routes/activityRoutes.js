const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');


router.post('/log-activity', activityController.logActivity);
router.get('/graph-data/:userId', activityController.graphData);
router.get('/streak-data/:userId', activityController.getStreakData);

module.exports = router;