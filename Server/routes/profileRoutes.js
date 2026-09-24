const express = require('express');
const router = express.Router();
const { getAdminProfile } = require('../controllers/AdminProfileController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/admin', getAdminProfile);

module.exports = router;