// controllers/transaction.controller.js

const {
  Transaction,
  Account,
  Category,
  TransactionType,
  sequelize
} = require('../models');

const { Op } = require('sequelize');


// =========================================
// CREATE TRANSACTION
// =========================================

exports.createTransaction = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const {
      account_id,
      category_id,
      transaction_type_id,
      amount,
      title,
      description,
      payment_method,
      transaction_date
    } = req.body;

    // ==============================
    // VALIDATE ACCOUNT
    // ==============================

    const account = await Account.findOne({
      where: {
        id: account_id,
        user_id: req.user.id
      },
      transaction: t
    });

    if (!account) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    // ==============================
    // VALIDATE CATEGORY
    // ==============================

    const category = await Category.findOne({
      where: {
        id: category_id,
        user_id: req.user.id
      },
      transaction: t
    });

    if (!category) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });

    }

    // ==============================
    // VALIDATE TRANSACTION TYPE
    // ==============================

    const transactionType =
      await TransactionType.findByPk(
        transaction_type_id,
        { transaction: t }
      );

    if (!transactionType) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Transaction type not found'
      });

    }

    // ==============================
    // CREATE TRANSACTION
    // ==============================

    const transaction =
      await Transaction.create({
        user_id: req.user.id,
        account_id,
        category_id,
        transaction_type_id,
        amount,
        title,
        description,
        payment_method,
        transaction_date
      }, {
        transaction: t
      });

    // ==============================
    // UPDATE ACCOUNT BALANCE
    // ==============================

    const typeName = transactionType.name;

    // INCOME

    if (typeName === 'income') {

      account.balance =
        Number(account.balance) +
        Number(amount);

    }

    // EXPENSE

    else if (typeName === 'expense') {

      if (Number(account.balance) < Number(amount)) {

        await t.rollback();

        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });

      }

      account.balance =
        Number(account.balance) -
        Number(amount);

    }

    // LOAN

    else if (typeName === 'loan') {

      account.balance =
        Number(account.balance) +
        Number(amount);

    }

    await account.save({
      transaction: t
    });

    // ==============================
    // COMMIT TRANSACTION
    // ==============================

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });

  } catch (error) {

    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================
// GET ALL TRANSACTIONS
// =========================================

exports.getTransactions = async (req, res) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const offset =
      (page - 1) * limit;

    const transactions =
      await Transaction.findAndCountAll({

        where: {
          user_id: req.user.id
        },

        include: [
          {
            model: Account
          },
          {
            model: Category
          },
          {
            model: TransactionType
          }
        ],

        order: [
          ['transaction_date', 'DESC']
        ],

        limit,
        offset
      });

    return res.json({
      success: true,
      total: transactions.count,
      page,
      totalPages: Math.ceil(
        transactions.count / limit
      ),
      data: transactions.rows
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================
// GET SINGLE TRANSACTION
// =========================================

exports.getTransactionById = async (
  req,
  res
) => {

  try {

    const transaction =
      await Transaction.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        },

        include: [
          Account,
          Category,
          TransactionType
        ]

      });

    if (!transaction) {

      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });

    }

    return res.json({
      success: true,
      data: transaction
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================
// UPDATE TRANSACTION
// =========================================

exports.updateTransaction = async (
  req,
  res
) => {

  const t = await sequelize.transaction();

  try {

    const transaction =
      await Transaction.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        },

        transaction: t

      });

    if (!transaction) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });

    }

    // ============================
    // GET ACCOUNT
    // ============================

    const account =
      await Account.findByPk(
        transaction.account_id,
        { transaction: t }
      );

    const transactionType =
      await TransactionType.findByPk(
        transaction.transaction_type_id,
        { transaction: t }
      );

    // ============================
    // REVERSE OLD BALANCE
    // ============================

    if (
      transactionType.name === 'income'
    ) {

      account.balance =
        Number(account.balance) -
        Number(transaction.amount);

    }

    else {

      account.balance =
        Number(account.balance) +
        Number(transaction.amount);

    }

    // ============================
    // UPDATE TRANSACTION
    // ============================

    await transaction.update(req.body, {
      transaction: t
    });

    // ============================
    // APPLY NEW BALANCE
    // ============================

    if (
      transactionType.name === 'income'
    ) {

      account.balance =
        Number(account.balance) +
        Number(transaction.amount);

    }

    else {

      account.balance =
        Number(account.balance) -
        Number(transaction.amount);

    }

    await account.save({
      transaction: t
    });

    await t.commit();

    return res.json({
      success: true,
      message: 'Transaction updated',
      data: transaction
    });

  } catch (error) {

    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================
// DELETE TRANSACTION
// =========================================

exports.deleteTransaction = async (
  req,
  res
) => {

  const t = await sequelize.transaction();

  try {

    const transaction =
      await Transaction.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        },

        transaction: t
      });

    if (!transaction) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });

    }

    const account =
      await Account.findByPk(
        transaction.account_id,
        { transaction: t }
      );

    const transactionType =
      await TransactionType.findByPk(
        transaction.transaction_type_id,
        { transaction: t }
      );

    // ============================
    // REVERSE BALANCE
    // ============================

    if (
      transactionType.name === 'income'
    ) {

      account.balance =
        Number(account.balance) -
        Number(transaction.amount);

    }

    else {

      account.balance =
        Number(account.balance) +
        Number(transaction.amount);

    }

    await account.save({
      transaction: t
    });

    await transaction.destroy({
      transaction: t
    });

    await t.commit();

    return res.json({
      success: true,
      message: 'Transaction deleted'
    });

  } catch (error) {

    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================
// SEARCH TRANSACTIONS
// =========================================

exports.searchTransactions = async (
  req,
  res
) => {

  try {

    const search =
      req.query.search || '';

    const transactions =
      await Transaction.findAll({

        where: {

          user_id: req.user.id,

          [Op.or]: [

            {
              title: {
                [Op.like]:
                  `%${search}%`
              }
            },

            {
              description: {
                [Op.like]:
                  `%${search}%`
              }
            }

          ]

        },

        include: [
          Account,
          Category,
          TransactionType
        ]

      });

    return res.json({
      success: true,
      data: transactions
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};