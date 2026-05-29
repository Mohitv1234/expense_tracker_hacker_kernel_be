const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const sequelize = require("./config/database.config");
const morgan = require('morgan');
const { createClient } = require('redis');

// Routes Import
const authRoutes = require('./routes/auth.route')
const accountRoutes = require('./routes/account.route')
const attechmentRoutes = require('./routes/attachment.route')
const budgetRoutes = require('./routes/budget.route')
const categoryRoutes = require('./routes/category.route')
const dashboardRoutes = require('./routes/dashboard.route')
const loanRoutes = require('./routes/loan.route')
const reportRoutes = require('./routes/report.route')
const tagRoutes = require('./routes/tag.route')
const transacctionRoutes = require('./routes/transacction.route')
const userRoutes = require('./routes/user.route')
const transactionTypeRoutes = require('./routes/transactionType.route');

const errorhandleMiddleware = require('./middleware/errorhandle.middleware');
const notfoundMiddleware = require('./middleware/notfound.middleware');
const socketAuthMiddleware = require('./middleware/socketAuth.middleware');
const client = require('./config/redis.config');

sequelize.sync()
  .then(() => {
    console.log("Tables created");
  });

app.use(cors({
  origin: true, // Allow all origins (for development)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/attechment', attechmentRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/transaction', transacctionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction-type', transactionTypeRoutes);
app.use(morgan('dev'));

app.use(errorhandleMiddleware);
app.use(notfoundMiddleware);

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

global.io = io;
io.use(socketAuthMiddleware);

io.on('connection', (socket) => {
    console.log('user connected');

      socket.on('register-user', async () => {
        if (!socket.data.user) return;
          await client.set(`user:${socket.data.user.id}`, socket.id);
          socket.userId = socket.data.user.id;
          console.log(`📢 Registered User: ${socket.data.user.id} (${socket.id})`);
      });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        if (socket.userId) {
            await client.del(`user:${socket.userId}`);
            console.log(`🗑️ Removed User Registration from Redis: ${socket.userId}`);
        }
    });
})

const port = process.env.PORT || 3000;
async function startServer() {
  try {
    // Keep this here, it will safely connect the shared client!
    await client.connect(); 
    console.log("✅ Connected to Redis successfully.");

    await sequelize.sync();
    console.log("✅ Database tables synchronized.");

    server.listen(port, () => console.log(`🚀 Server running on port ${port} with Socket.IO`));
  } catch (error) {
    console.error("❌ Failed to start the server applications:", error);
    process.exit(1);
  }
}

startServer();
