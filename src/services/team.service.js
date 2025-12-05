const prisma = require('../db');

const positions = {
  GOALKEEPER: 'Goalkeeper',
  DEFENDER: 'Defender',
  MIDFIELDER: 'Midfielder',
  ATTACKER: 'Attacker'
};

const generateRandomPlayer = (position) => {
  const names = ['John', 'Mike', 'David', 'Chris', 'James', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'];
  
  const randomName = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const price = Math.floor(Math.random() * 900000) + 100000;

  return {
    name: randomName,
    position,
    price
  };
};

const createInitialTeam = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 5000));

  const teamData = {
    name: `Team ${userId}`,
    budget: 5000000,
    userId,
    players: {
      create: [
        ...Array(3).fill(null).map(() => generateRandomPlayer(positions.GOALKEEPER)),
        ...Array(6).fill(null).map(() => generateRandomPlayer(positions.DEFENDER)),
        ...Array(6).fill(null).map(() => generateRandomPlayer(positions.MIDFIELDER)),
        ...Array(5).fill(null).map(() => generateRandomPlayer(positions.ATTACKER))
      ]
    }
  };

  try {
    await prisma.team.create({
      data: teamData
    });
  } catch (error) {
    console.error(error);
  }
};

const getUserTeam = async (userId) => {
  return prisma.team.findUnique({
    where: { userId },
    include: { players: true }
  });
};

const updatePlayer = async (playerId, userId, data) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { team: true }
  });

  if (!player || player.team.userId !== userId) {
    throw new Error('Player not found or unauthorized');
  }

  return prisma.player.update({
    where: { id: playerId },
    data
  });
};

module.exports = {
  createInitialTeam,
  getUserTeam,
  updatePlayer
};
