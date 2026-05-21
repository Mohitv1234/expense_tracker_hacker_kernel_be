// controllers/report.controller.js

const {
  Transaction,
  Account,
  Category,
  TransactionType
} = require('../models');

const { Op } = require('sequelize');


// =====================================
// MONTHLY REPORT
// =====================================

exports.getMonthlyReport = async (
  req,
  res
) => {

  try {

    const {
      start_date,
      end_date
    } = req.query;

    const transactions =
      await Transaction.findAll({

        where: {

          user_id: req.user.id,

          transaction_date: {
            [Op.between]: [
              new Date(start_date).setHours(0, 0, 0, 0),
              new Date(end_date).setHours(23, 59, 59, 999)
            ]
          }

        },

        include: [
          Account,
          Category,
          TransactionType
        ],

        order: [
          ['transaction_date', 'DESC']
        ]

      });

    // TOTALS

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item => {

      if (
        item.TransactionType.name
        === 'income'
      ) {

        totalIncome +=
          Number(item.amount);

      }

      else if (
        item.TransactionType.name
        === 'expense'
      ) {

        totalExpense +=
          Number(item.amount);

      }

    });

    return res.json({

      success: true,

      data: {

        totalIncome,

        totalExpense,

        balance:
          totalIncome - totalExpense,

        transactions

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
// CATEGORY REPORT
// =====================================

exports.getCategoryReport = async (
  req,
  res
) => {

  try {

    const {
      start_date,
      end_date
    } = req.query;

    const report =
      await Transaction.findAll({

        where: {
          user_id: req.user.id,
          transaction_type_id: 2,
          transaction_date: {
            [Op.between]: [
              new Date(start_date).setHours(0, 0, 0, 0),
              new Date(end_date).setHours(23, 59, 59, 999)
            ]
          }
        },

        include: [
          Category
        ]

      });

    const categoryTotals = {};

    report.forEach(item => {

      const categoryName =
        item.Category?.name ||
        'Unknown';

      if (!categoryTotals[categoryName]) {

        categoryTotals[categoryName] = 0;

      }

      categoryTotals[categoryName] +=
        Number(item.amount);

    });

    return res.json({
      success: true,
      data: categoryTotals
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};