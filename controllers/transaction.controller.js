// controllers/transaction.controller.js

const { Transaction, Account, Category, TransactionType, sequelize } = require("../models");
const { Op } = require("sequelize");
const ErrorHander = require("../utils/errorHandler.util");

exports.createTransaction = async (req, res, next) => {  
  const t = await sequelize.transaction();
  try {
    const { account_id, category_id, transaction_type_id, amount, title, description, transaction_date } = req.body;
    const account = await Account.findOne({ where: { id: account_id, user_id: req.user.id }, transaction: t });

    if (!account) {
      await t.rollback();
      return next(new ErrorHander("Account not found", 404));
    }

    const category = await Category.findOne({
      where: {
        id: category_id,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!category) {
      await t.rollback();
      return next(new ErrorHander("Category not found", 404));
    }

    const transactionType = await TransactionType.findByPk(
      transaction_type_id,
      { transaction: t },
    );

    if (!transactionType) {
      await t.rollback();
      return next(new ErrorHander("TransactionType not found", 404));
    }

    const transaction = await Transaction.create(
      {
        user_id: req.user.id,
        account_id,
        category_id,
        transaction_type_id,
        amount,
        title,
        description,
        payment_method: "Cash",
        transaction_date,
      },
      { transaction: t },
    );

    const typeName = transactionType.name;

    if (typeName === "Income" || typeName === "Loan") {
      account.balance = Number(account.balance) + Number(amount);
    }

    else if (typeName === "Expense" || typeName === "Loan Repayment") {
      if (Number(account.balance) < Number(amount)) {
        await t.rollback();
        return next(new ErrorHander("Insufficient balance", 400));
      }
      account.balance = Number(account.balance) - Number(amount);
    }

    else if (typeName === "loan") {
      account.balance = Number(account.balance) + Number(amount);
    }

    await account.save({
      transaction: t,
    });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    await t.rollback();
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const transactions = await Transaction.findAndCountAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        { model: Account },
        { model: Category },
        { model: TransactionType },
      ],
      order: [["transaction_date", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      total: transactions.count,
      page,
      totalPages: Math.ceil(transactions.count / limit),
      data: transactions.rows,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [Account, Category, TransactionType],
    });

    if (!transaction) {
      return next(new ErrorHander("Transaction not found", 404));
    }

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.updateTransaction = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!transaction) {
      await t.rollback();
      return next(new ErrorHander("Transaction not found", 404));
    }

    const account = await Account.findByPk(transaction.account_id, {
      transaction: t,
    });

    const transactionType = await TransactionType.findByPk(
      transaction.transaction_type_id,
      { transaction: t },
    );

    if (transactionType.name === "income") {
      account.balance = Number(account.balance) - Number(transaction.amount);
    } else {
      account.balance = Number(account.balance) + Number(transaction.amount);
    }

    await transaction.update(req.body, {
      transaction: t,
    });

    if (transactionType.name === "income") {
      account.balance = Number(account.balance) + Number(transaction.amount);
    } else {
      account.balance = Number(account.balance) - Number(transaction.amount);
    }

    await account.save({
      transaction: t,
    });

    await t.commit();

    return res.json({
      success: true,
      message: "Transaction updated",
      data: transaction,
    });
  } catch (error) {
    await t.rollback();
    return next(new ErrorHander(error.message, 500));
  }
};

exports.deleteTransaction = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!transaction) {
      await t.rollback();
      return next(new ErrorHander("Transaction not found", 404));
    }

    const account = await Account.findByPk(transaction.account_id, {
      transaction: t,
    });

    const transactionType = await TransactionType.findByPk(
      transaction.transaction_type_id,
      { transaction: t },
    );

    if (transactionType.name === "income") {
      account.balance = Number(account.balance) - Number(transaction.amount);
    } else {
      account.balance = Number(account.balance) + Number(transaction.amount);
    }

    await account.save({
      transaction: t,
    });

    await transaction.destroy({
      transaction: t,
    });

    await t.commit();

    return res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    await t.rollback();
    return next(new ErrorHander(error.message, 500));
  }
};

exports.searchTransactions = async (req, res, next) => {
  try {
    const search = req.query.search || "";

    const transactions = await Transaction.findAll({
      where: {
        user_id: req.user.id,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      include: [Account, Category, TransactionType],
    });

    return res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
