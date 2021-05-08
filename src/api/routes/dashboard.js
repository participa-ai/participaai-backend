const express = require('express');
const dashboardsController = require('../controllers/dashboard');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(dashboardsController.get);

module.exports = router;
