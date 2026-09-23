const express = require('express');
const router = express.Router();
const {
  getMyStock,
  addOrUpdateStock,
  setStock,
  removeStock,
} = require('../controllers/farmerStockController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('farmer'));

router.get('/stock', getMyStock);
router.post('/stock', addOrUpdateStock);
router.put('/stock/:id', setStock);
router.delete('/stock/:id', removeStock);

module.exports = router;
