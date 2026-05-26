const { Budget, Category, Transaction, sequelize, Loan } = require("../models");
const { Op, where } = require("sequelize");
const ErrorHander = require("../utils/errorHandler.util");

exports.createBudget = async (req, res, next) => {
  try {
    const { category_id, amount, start_date, end_date } = req.body;

    const category = await Category.findOne({
      where: {
        id: category_id,
        user_id: req.user.id,
      },
    });

    if (!category) return next(new ErrorHander("Category is not found", 404));

    const existingBudget = await Budget.findOne({
      where: {
        user_id: req.user.id,
        category_id: category.id,
        [Op.or]: [
          {
            start_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          {
            end_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          {
            [Op.and]: [
              {
                start_date: {
                  [Op.lte]: start_date,
                },
              },
              {
                end_date: {
                  [Op.gte]: end_date,
                },
              },
            ],
          },
        ],
      },
    });

    if (existingBudget) {
      const budget = await existingBudget.update({
        amount: (Number(existingBudget.amount) + Number(amount)).toFixed(2),
      });

      return res.status(201).json({
        success: true,
        message: "Budget created",
        data: budget,
      });
    }
    const budget = await Budget.create({
      user_id: req.user.id,
      category_id,
      amount,
      start_date,
      end_date,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created",
      data: budget,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const { Op } = require("sequelize");

    const budgets = await Budget.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    return res.json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getBudgetUsage = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const totalExpense = await Transaction.sum("amount", {
      where: {
        user_id: req.user.id,
        category_id: budget.category_id,
        transaction_date: {
          [Op.between]: [budget.start_date, budget.end_date],
        },
      },
    });

    const used = Number(totalExpense || 0);
    const remaining = Number(budget.amount) - used;
    const percentage = ((used / Number(budget.amount)) * 100).toFixed(2);

    return res.json({
      success: true,
      data: {
        budget_amount: budget.amount,
        used,
        remaining,
        percentage,
      },
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
