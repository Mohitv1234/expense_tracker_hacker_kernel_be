const { Account, Transaction } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.createAccount = async (req, res, next) => {
  try {
    const { name, account_type, balance } = req.body;

    const account = await Account.create({
      user_id: req.user.id,
      name,
      account_type,
      balance: balance || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Account created",
      data: account,
    });

  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      where: {
        user_id: req.user.id,
      },

      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
      return next(new ErrorHander(error.message, 500))
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!account) {
      return next(new ErrorHander("Account not found", 404));
    }

    return res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!account) {
      return next(new ErrorHander("Account not found", 404));
    }

    await account.update(req.body);

    return res.json({
      success: true,
      message: "Account updated",
      data: account,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!account) {
      return next(new ErrorHander("Account not found", 404))
    }

    // CHECK TRANSACTIONS

    const transactionCount = await Transaction.count({
      where: {
        account_id: account.id,
      },
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete account with transactions",
      });
    }

    await account.destroy();

    return res.json({
      success: true,
      message: "Account deleted",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
};

exports.getAccountBalance = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!account) {
      return next(new ErrorHander("Account not found", 404));
    }

    return res.json({
      success: true,
      balance: account.balance,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
};
