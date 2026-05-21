const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const sequelize = require("./config/database");

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
const transactionTypeRoutes = require('./routes/transactionType.route')


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

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
