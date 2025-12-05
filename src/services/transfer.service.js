const prisma = require('../db');

const getTransfers = async (filters) => {
  const { teamName, playerName, minPrice, maxPrice } = filters;
  
  const where = {
    isOnTransferList: true
  };

  if (playerName) {
    where.name = { contains: playerName };
  }

  if (minPrice || maxPrice) {
    where.askingPrice = {};
    if (minPrice) where.askingPrice.gte = parseFloat(minPrice);
    if (maxPrice) where.askingPrice.lte = parseFloat(maxPrice);
  }

  if (teamName) {
    where.team = {
      name: { contains: teamName }
    };
  }

  return prisma.player.findMany({
    where,
    include: {
      team: {
        select: { name: true }
      }
    }
  });
};

const buyPlayer = async (playerId, buyerUserId) => {
  return prisma.$transaction(async (tx) => {
    const player = await tx.player.findUnique({
      where: { id: playerId },
      include: { team: true }
    });

    if (!player || !player.isOnTransferList) {
      throw new Error('Player not available for transfer');
    }

    const buyerTeam = await tx.team.findUnique({
      where: { userId: buyerUserId },
      include: { players: true }
    });

    if (!buyerTeam) {
      throw new Error('Buyer team not found');
    }

    if (buyerTeam.id === player.teamId) {
      throw new Error('Cannot buy your own player');
    }

    if (buyerTeam.players.length >= 25) {
      throw new Error('Team cannot have more than 25 players');
    }

    const sellerTeam = await tx.team.findUnique({
      where: { id: player.teamId },
      include: { players: true }
    });

    if (sellerTeam.players.length <= 15) {
      throw new Error('Seller team cannot have fewer than 15 players');
    }

    const cost = player.askingPrice * 0.95;

    if (buyerTeam.budget < cost) {
      throw new Error('Insufficient funds');
    }

    await tx.team.update({
      where: { id: buyerTeam.id },
      data: { budget: buyerTeam.budget - cost }
    });

    await tx.team.update({
      where: { id: sellerTeam.id },
      data: { budget: sellerTeam.budget + cost }
    });

    const updatedPlayer = await tx.player.update({
      where: { id: player.id },
      data: {
        teamId: buyerTeam.id,
        isOnTransferList: false,
        askingPrice: null,
        price: player.askingPrice
      }
    });

    return updatedPlayer;
  });
};

module.exports = {
  getTransfers,
  buyPlayer
};
