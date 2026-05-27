const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const sequelize = require("./config/database.config");
const morgan = require('morgan');

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
const userSocketData = new Map();
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

global.io = io;
global.userSocketData = userSocketData;
io.use(socketAuthMiddleware);

io.on('connection', (socket) => {
    console.log('user connected');

      socket.on('register-user', ({ userId }) => {
        if (!userId) return;
        if (!userSocketData.has(userId)) {
          userSocketData.set(userId, new Set());
        }
        userSocketData.get(userId).add(socket.id);
        
        socket.userId = userId;

        console.log(
          `📢 Registered User: ${userId} (${socket.id})`
        );
      });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

const port = process.env.PORT
server.listen(port, () => console.log('Running with Socket.IO'));
