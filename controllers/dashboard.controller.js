// controllers/dashboard.controller.js

const {
  Transaction,
  Account,
  Category,
  TransactionType,
  sequelize
} = require('../models');

const {
  fn,
  col,
  literal,
  Op
} = require('sequelize');


// =====================================
// DASHBOARD STATS
// =====================================

exports.getDashboardStats = async (
  req,
  res
) => {

  try {

    // TOTAL BALANCE

    const totalBalance =
      await Account.sum('balance', {

        where: {
          user_id: req.user.id
        }

      });

    const types = await TransactionType.findAll();
    const incomeType = types.find(t => t.name.toLowerCase() === 'income');
    const expenseType = types.find(t => t.name.toLowerCase() === 'expense');

    // TOTAL INCOME
    const totalIncome = incomeType ? 
      await Transaction.sum('amount', {
        where: { user_id: req.user.id, transaction_type_id: incomeType.id }
      }) : 0;

    // TOTAL EXPENSE
    const totalExpense = expenseType ? 
      await Transaction.sum('amount', {
        where: { user_id: req.user.id, transaction_type_id: expenseType.id }
      }) : 0;

    // RECENT TRANSACTIONS

    const recentTransactions =
      await Transaction.findAll({

        where: {
          user_id: req.user.id
        },

        limit: 5,

        order: [
          ['transaction_date', 'DESC']
        ],

        include: [
          Account,
          Category
        ]

      });

    return res.json({

      success: true,

      data: {

        totalBalance:
          totalBalance || 0,

        totalIncome:
          totalIncome || 0,

        totalExpense:
          totalExpense || 0,

        recentTransactions

      }

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// MONTHLY EXPENSE ANALYTICS
// =====================================

exports.getMonthlyExpenseAnalytics =
  async (req, res) => {

  try {

    const types = await TransactionType.findAll();
    const expenseType = types.find(t => t.name.toLowerCase() === 'expense');

    if (!expenseType) {
      return res.json({ success: true, data: [] });
    }

    const analytics =
      await Transaction.findAll({

        where: {
          user_id: req.user.id,
          transaction_type_id: expenseType.id
        },

        attributes: [

          [
            fn(
              'MONTH',
              col('transaction_date')
            ),
            'month'
          ],

          [
            fn(
              'SUM',
              col('amount')
            ),
            'total'
          ]

        ],

        group: [
          literal(
            'MONTH(transaction_date)'
          )
        ],

        order: [
          literal(
            'MONTH(transaction_date)'
          )
        ]

      });

    return res.json({
      success: true,
      data: analytics
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};