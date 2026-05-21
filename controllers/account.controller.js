// controllers/account.controller.js

const {
  Account,
  Transaction
} = require('../models');


// =====================================
// CREATE ACCOUNT
// =====================================

exports.createAccount = async (
  req,
  res
) => {

  try {

    const {
      name,
      account_type,
      balance
    } = req.body;

    const account =
      await Account.create({

        user_id: req.user.id,

        name,

        account_type,

        balance: balance || 0

      });

    return res.status(201).json({
      success: true,
      message: 'Account created',
      data: account
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET ALL ACCOUNTS
// =====================================

exports.getAccounts = async (
  req,
  res
) => {

  try {

    const accounts =
      await Account.findAll({

        where: {
          user_id: req.user.id
        },

        order: [
          ['created_at', 'DESC']
        ]

      });

    return res.json({
      success: true,
      data: accounts
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET SINGLE ACCOUNT
// =====================================

exports.getAccountById = async (
  req,
  res
) => {

  try {

    const account =
      await Account.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!account) {

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    return res.json({
      success: true,
      data: account
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// UPDATE ACCOUNT
// =====================================

exports.updateAccount = async (
  req,
  res
) => {

  try {

    const account =
      await Account.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!account) {

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    await account.update(req.body);

    return res.json({
      success: true,
      message: 'Account updated',
      data: account
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// DELETE ACCOUNT
// =====================================

exports.deleteAccount = async (
  req,
  res
) => {

  try {

    const account =
      await Account.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!account) {

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    // CHECK TRANSACTIONS

    const transactionCount =
      await Transaction.count({

        where: {
          account_id: account.id
        }

      });

    if (transactionCount > 0) {

      return res.status(400).json({
        success: false,
        message:
          'Cannot delete account with transactions'
      });

    }

    await account.destroy();

    return res.json({
      success: true,
      message: 'Account deleted'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// ACCOUNT BALANCE
// =====================================

exports.getAccountBalance = async (
  req,
  res
) => {

  try {

    const account =
      await Account.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!account) {

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    return res.json({
      success: true,
      balance: account.balance
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};