const transferService = require('../services/transfer.service');

const getTransfers = async (req, res) => {
  try {
    const transfers = await transferService.getTransfers(req.query);
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buyPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await transferService.buyPlayer(parseInt(id), req.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTransfers,
  buyPlayer
};
