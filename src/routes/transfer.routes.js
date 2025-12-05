const express = require('express');
const transferController = require('../controllers/transfer.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', transferController.getTransfers);
router.post('/buy/:id', transferController.buyPlayer);

module.exports = router;
