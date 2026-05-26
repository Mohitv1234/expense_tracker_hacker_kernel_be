// controllers/dashboard.controller.js

const { getTransactionSummary } = require("../helpers/chartData.helper");
const {
  Transaction,
  Account,
  Category,
  TransactionType,
  sequelize,
} = require("../models");

const { fn, col, literal, Op } = require("sequelize");
const ErrorHander = require("../utils/errorHandler.util");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalBalance = await Account.sum("balance", {
      where: {
        user_id: req.user.id,
      },
    });

    const types = await TransactionType.findAll();
    const incomeType = types.find((t) => t.name.toLowerCase() === "income");
    const expenseType = types.find((t) => t.name.toLowerCase() === "expense");

    const totalIncome = incomeType ? 
                        await Transaction.sum("amount", { where: { user_id: req.user.id, transaction_type_id: incomeType.id }}) 
                        : 0 ;

    const totalExpense =  expenseType ? 
                          await Transaction.sum("amount", { where: { user_id: req.user.id, transaction_type_id: expenseType.id } }) 
                          : 0;

    const recentTransactions = await Transaction.findAll({
      where: {
        user_id: req.user.id,
      },
      limit: 5,
      order: [["transaction_date", "DESC"]],
      include: [Account, Category, TransactionType],
    });

    const expenseTransactions = await Transaction.findAll({
      where: {
        user_id: req.user.id,
        transaction_type_id: expenseType?.id,
      },
      include: [Category],
    });

    const categoryMap = {};

    expenseTransactions.forEach((item) => {
      const categoryName = item.Category?.name || "Other";

      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = 0;
      }

      categoryMap[categoryName] += Number(item.amount);
    });

    const categoryData = Object.keys(categoryMap).map((name) => ({
      category: name,
      amount: categoryMap[name],
    }));

    let weeklyData = await getTransactionSummary(req, res, next);

    return res.json({
      success: true,
      data: {
        totalBalance: totalBalance || 0,
        totalIncome: totalIncome || 0,
        totalExpense: totalExpense || 0,
        savings: (totalIncome || 0) - (totalExpense || 0),
        recentTransactions,
        weeklyData: weeklyData,
        categoryData,
      },
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getMonthlyExpenseAnalytics = async (req, res, next) => {
  try {
    const types = await TransactionType.findAll();
    const expenseType = types.find((t) => t.name === "Expense");

    if (!expenseType) {
      return res.json({ success: true, data: [] });
    }

    const analytics = await Transaction.findAll({
      where: {
        user_id: req.user.id,
        transaction_type_id: expenseType.id,
      },
      attributes: [
        [fn("MONTH", col("transaction_date")), "month"],
        [fn("SUM", col("amount")), "total"],
      ],
      group: [literal("MONTH(transaction_date)")],
      order: [literal("MONTH(transaction_date)")],
    });

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
