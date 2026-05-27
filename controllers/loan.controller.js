// controllers/loan.controller.js

const { where } = require("sequelize");
const {
  Loan,
  LoanPayment,
  Account,
  Transaction,
  TransactionType,
  Category,
  sequelize,
} = require("../models");
const { createTransaction } = require("./transaction.controller");
const ErrorHander = require("../utils/errorHandler.util");

exports.createLoan = async (req, res, next) => {
  try {
    const {
      person_name,
      loan_type,
      total_amount,
      interest_rate,
      start_date,
      due_date,
      notes,
    } = req.body;

    let account = await Account.findOne({
      where: {
        user_id: req.user.id,
        name: "Loan Account",
      },
    });

    let category = await Category.findOne({
      where: {
        user_id: req.user.id,
        name: "Loan",
      },
    });

    let transactionType = await TransactionType.findOne({
      where: {
        name: "Loan",
      },
    });

    let payloadForTransaction = {
      account_id: account.id,
      category_id: category.id,
      transaction_type_id: transactionType.id,
      amount: total_amount,
      title: "Loan",
      description: loan_type,
      payment_method: "Cash",
      transaction_date: start_date,
    };

    await createTransaction({ ...req, body: payloadForTransaction }, res);

    const loan = await Loan.create({
      user_id: req.user.id,
      person_name,
      loan_type,
      total_amount,
      interest_rate,
      start_date,
      due_date,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Loan created",
      data: loan,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getLoans = async (req, res, next) => {
  try {
    const loans = await Loan.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: loans,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getLoanById = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [LoanPayment],
    });

    if (!loan) return next(new ErrorHander("Loan not found", 404));

    return res.json({
      success: true,
      data: loan,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.payLoanInstallment = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { loan_id, account_id, amount, payment_date, notes } = req.body;

    const loan = await Loan.findOne({
      where: {
        id: loan_id,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!loan) {
      await t.rollback();
      return next(new ErrorHander("Loan not Found", 404));
    }

    const account = await Account.findByPk(account_id, { transaction: t });

    if (!account) {
      await t.rollback();
      return next(new ErrorHander("Account not found", 404));
    }

    if (Number(account.balance) < Number(amount)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }
    const transactionType = await TransactionType.findOne({
      where: {
        name: "expense",
      },
      transaction: t,
    });

    const transaction = await Transaction.create(
      {
        user_id: req.user.id,
        account_id,
        transaction_type_id: transactionType.id,
        amount,
        title: `Loan Payment - ${loan.person_name}`,
        description: notes,
        transaction_date: payment_date,
      },
      { transaction: t },
    );

    account.balance = Number(account.balance) - Number(amount);
    await account.save({
      transaction: t,
    });

    const payment = await LoanPayment.create(
      {
        loan_id,
        transaction_id: transaction.id,
        amount,
        payment_date,
        notes,
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Loan payment successful",
      data: payment,
    });
  } catch (error) {
    await t.rollback();
    return next(new ErrorHander(error.message, 500));
  }
};

exports.deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!loan) return next(new ErrorHander("Loan not found", 404));

    await loan.destroy();

    return res.json({
      success: true,
      message: "Loan deleted",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.sendRemider = async (req, res, next) => {
  if(global.io){
    global.io.emit('users','hello')
  }
};
