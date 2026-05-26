const { Op } = require("sequelize");
const getDateRange = require("./dateRange.helper");
const { Transaction, TransactionType } = require("../models");

exports.getTransactionSummary = async (req, res, next) => {
  try {
    const { type = "week" } = req.query;
    const { start_date, end_date } = getDateRange(type);

    const transactions = await Transaction.findAll({
      where: {
        user_id: req.user.id,
        transaction_date: {
          [Op.between]: [start_date, end_date],
        },
      },
      include: [
        {
          model: TransactionType,
          where: {
            name: {
              [Op.in]: ["Expense", "Loan Repayment"],
            },
          },
          attributes: [],
          required: true,
        },
      ],
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0};
    const weeklyData = days.map((day) => ({ day, amount: weeklyMap[day]}));
    
    transactions.forEach((item) => {
      const date = new Date(item.transaction_date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      weeklyMap[day] += Number(item.amount);
    });


    return weeklyData;
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
