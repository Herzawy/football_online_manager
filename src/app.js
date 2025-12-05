const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const transferRoutes = require('./routes/transfer.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/transfers', transferRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
