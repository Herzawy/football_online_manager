const express = require('express');
const teamController = require('../controllers/team.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/my-team', teamController.getMyTeam);
router.put('/players/:id', teamController.updatePlayerTransferStatus);

module.exports = router;
