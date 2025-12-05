const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const teamService = require('./team.service');

const handleLoginOrRegister = async (email, password) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });
    
    teamService.createInitialTeam(user.id);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '24h' });
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email
    }
  };
};

module.exports = {
  handleLoginOrRegister
};
