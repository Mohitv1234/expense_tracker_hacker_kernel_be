// controllers/category.controller.js

const { Category, TransactionType, Transaction } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.createCategory = async (req, res, next) => {
  try {
    const { transaction_type_id, name, icon, color } = req.body;
    const transactionType = await TransactionType.findByPk(transaction_type_id);

    if (!transactionType) return next(new ErrorHander("TransactionType is not found", 404));

    const category = await Category.create({
      user_id: req.user.id,
      transaction_type_id,
      name,
      icon,
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [TransactionType],
      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [TransactionType],
    });

    if (!category) return next(new ErrorHander("Category is not found", 404));

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!category) return next(new ErrorHander("Category is not found", 404));

    await category.update(req.body);

    return res.json({
      success: true,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!category) return next(new ErrorHander("Category is not found", 404));

    const transactionCount = await Transaction.count({
      where: {
        category_id: category.id,
      },
    });

    if (transactionCount > 0) {
      return next(new ErrorHander("Cannot delete category with transactions", 400));
    }

    await category.destroy();

    return res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
