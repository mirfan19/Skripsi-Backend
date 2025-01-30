const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');

router.post('/', activityLogController.createActivityLog);
router.get('/', activityLogController.getAllActivityLogs);
router.get('/:id', activityLogController.getActivityLogById);
router.put('/:id', activityLogController.updateActivityLog);
router.delete('/:id', activityLogController.deleteActivityLog);

module.exports = router;
