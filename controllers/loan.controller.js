// controllers/loan.controller.js

const {
  Loan,
  LoanPayment,
  Account,
  Transaction,
  TransactionType,
  sequelize
} = require('../models');


// =====================================
// CREATE LOAN
// =====================================

exports.createLoan = async (
  req,
  res
) => {

  try {

    const {
      person_name,
      loan_type,
      total_amount,
      interest_rate,
      start_date,
      due_date,
      notes
    } = req.body;

    const loan =
      await Loan.create({

        user_id: req.user.id,

        person_name,

        loan_type,

        total_amount,

        interest_rate,

        start_date,

        due_date,

        notes

      });

    return res.status(201).json({
      success: true,
      message: 'Loan created',
      data: loan
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET LOANS
// =====================================

exports.getLoans = async (
  req,
  res
) => {

  try {

    const loans =
      await Loan.findAll({

        where: {
          user_id: req.user.id
        },

        order: [
          ['created_at', 'DESC']
        ]

      });

    return res.json({
      success: true,
      data: loans
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET LOAN BY ID
// =====================================

exports.getLoanById = async (
  req,
  res
) => {

  try {

    const loan =
      await Loan.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        },

        include: [
          LoanPayment
        ]

      });

    if (!loan) {

      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });

    }

    return res.json({
      success: true,
      data: loan
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// PAY LOAN INSTALLMENT
// =====================================

exports.payLoanInstallment = async (
  req,
  res
) => {

  const t = await sequelize.transaction();

  try {

    const {
      loan_id,
      account_id,
      amount,
      payment_date,
      notes
    } = req.body;

    const loan =
      await Loan.findOne({

        where: {
          id: loan_id,
          user_id: req.user.id
        },

        transaction: t

      });

    if (!loan) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });

    }

    const account =
      await Account.findByPk(
        account_id,
        { transaction: t }
      );

    if (!account) {

      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });

    }

    // CHECK BALANCE

    if (
      Number(account.balance) <
      Number(amount)
    ) {

      await t.rollback();

      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });

    }

    // GET EXPENSE TYPE

    const transactionType =
      await TransactionType.findOne({

        where: {
          name: 'expense'
        },

        transaction: t

      });

    // CREATE TRANSACTION

    const transaction =
      await Transaction.create({

        user_id: req.user.id,

        account_id,

        transaction_type_id:
          transactionType.id,

        amount,

        title:
          `Loan Payment - ${loan.person_name}`,

        description: notes,

        transaction_date:
          payment_date

      }, {
        transaction: t
      });

    // UPDATE ACCOUNT BALANCE

    account.balance =
      Number(account.balance) -
      Number(amount);

    await account.save({
      transaction: t
    });

    // CREATE LOAN PAYMENT

    const payment =
      await LoanPayment.create({

        loan_id,

        transaction_id:
          transaction.id,

        amount,

        payment_date,

        notes

      }, {
        transaction: t
      });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Loan payment successful',
      data: payment
    });

  } catch (error) {

    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// DELETE LOAN
// =====================================

exports.deleteLoan = async (
  req,
  res
) => {

  try {

    const loan =
      await Loan.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!loan) {

      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });

    }

    await loan.destroy();

    return res.json({
      success: true,
      message: 'Loan deleted'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};