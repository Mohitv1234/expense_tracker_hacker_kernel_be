// controllers/budget.controller.js

const {
  Budget,
  Category,
  Transaction,
  sequelize
} = require('../models');

const { Op } = require('sequelize');


// =====================================
// CREATE BUDGET
// =====================================

exports.createBudget = async (
  req,
  res
) => {

  try {

    const {
      category_id,
      amount,
      start_date,
      end_date
    } = req.body;

    const category =
      await Category.findOne({

        where: {
          id: category_id,
          user_id: req.user.id
        }

      });

    if (!category) {

      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });

    }

    const budget =
      await Budget.create({

        user_id: req.user.id,

        category_id,

        amount,

        start_date,

        end_date

      });

    return res.status(201).json({
      success: true,
      message: 'Budget created',
      data: budget
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET BUDGETS
// =====================================

exports.getBudgets = async (
  req,
  res
) => {

  try {

    const budgets =
      await Budget.findAll({

        where: {
          user_id: req.user.id
        },

        include: [
          Category
        ]

      });

    return res.json({
      success: true,
      data: budgets
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET BUDGET USAGE
// =====================================

exports.getBudgetUsage = async (
  req,
  res
) => {

  try {

    const budget =
      await Budget.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!budget) {

      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });

    }

    // CALCULATE SPENDING

    const totalExpense =
      await Transaction.sum('amount', {

        where: {

          user_id: req.user.id,

          category_id:
            budget.category_id,

          transaction_date: {

            [Op.between]: [
              budget.start_date,
              budget.end_date
            ]

          }

        }

      });

    const used =
      Number(totalExpense || 0);

    const remaining =
      Number(budget.amount) - used;

    const percentage =
      (
        (used / Number(budget.amount))
        * 100
      ).toFixed(2);

    return res.json({
      success: true,

      data: {

        budget_amount:
          budget.amount,

        used,

        remaining,

        percentage

      }

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};