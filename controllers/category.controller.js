// controllers/category.controller.js

const {
  Category,
  TransactionType,
  Transaction
} = require('../models');


// =====================================
// CREATE CATEGORY
// =====================================

exports.createCategory = async (
  req,
  res
) => {

  try {

    const {
      transaction_type_id,
      name,
      icon,
      color
    } = req.body;

    const transactionType =
      await TransactionType.findByPk(
        transaction_type_id
      );

    if (!transactionType) {

      return res.status(404).json({
        success: false,
        message: 'Transaction type not found'
      });

    }

    const category =
      await Category.create({

        user_id: req.user.id,

        transaction_type_id,

        name,

        icon,

        color

      });

    return res.status(201).json({
      success: true,
      message: 'Category created',
      data: category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET ALL CATEGORIES
// =====================================

exports.getCategories = async (
  req,
  res
) => {

  try {

    const categories =
      await Category.findAll({

        where: {
          user_id: req.user.id
        },

        include: [
          TransactionType
        ],

        order: [
          ['created_at', 'DESC']
        ]

      });

    return res.json({
      success: true,
      data: categories
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET CATEGORY BY ID
// =====================================

exports.getCategoryById = async (
  req,
  res
) => {

  try {

    const category =
      await Category.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        },

        include: [
          TransactionType
        ]

      });

    if (!category) {

      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });

    }

    return res.json({
      success: true,
      data: category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// UPDATE CATEGORY
// =====================================

exports.updateCategory = async (
  req,
  res
) => {

  try {

    const category =
      await Category.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!category) {

      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });

    }

    await category.update(req.body);

    return res.json({
      success: true,
      message: 'Category updated',
      data: category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// DELETE CATEGORY
// =====================================

exports.deleteCategory = async (
  req,
  res
) => {

  try {

    const category =
      await Category.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!category) {

      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });

    }

    // CHECK TRANSACTIONS

    const transactionCount =
      await Transaction.count({

        where: {
          category_id: category.id
        }

      });

    if (transactionCount > 0) {

      return res.status(400).json({
        success: false,
        message:
          'Cannot delete category with transactions'
      });

    }

    await category.destroy();

    return res.json({
      success: true,
      message: 'Category deleted'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};