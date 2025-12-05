const teamService = require('../services/team.service');

const getMyTeam = async (req, res) => {
  try {
    const team = await teamService.getUserTeam(req.userId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found or being created' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlayerTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnTransferList, askingPrice } = req.body;
    
    if (isOnTransferList && (!askingPrice || askingPrice <= 0)) {
      return res.status(400).json({ message: 'Asking price is required and must be positive when putting on transfer list' });
    }

    const updatedPlayer = await teamService.updatePlayer(parseInt(id), req.userId, {
      isOnTransferList,
      askingPrice: isOnTransferList ? askingPrice : null
    });

    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyTeam,
  updatePlayerTransferStatus
};
