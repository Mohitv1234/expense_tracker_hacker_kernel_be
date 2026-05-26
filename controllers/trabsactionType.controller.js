const sequelize = require("../config/database.config");
const ErrorHander = require("../utils/errorHandler.util");

const getTransactionTypes = async (req, res, next) => {
  try {
    const [rows] = await sequelize.query(` SELECT * FROM transaction_types ORDER BY id DESC`);

    return res.status(200).json({
      success: true,
      message: "Transaction types fetched successfully",
      data: rows,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
}
};

const createTransactionType = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) return next(new ErrorHander("Transaction type name is required", 400));

    const [exists] = await sequelize.query(`SELECT id FROM transaction_types WHERE name = :name`, { replacements: { name } });

    if (exists.length > 0) return next(new ErrorHander("Transaction type already exists", 400));

    const [result] = await sequelize.query(`INSERT INTO transaction_types (name) VALUES (:name)`, { replacements: { name } } );

    return res.status(201).json({
      success: true,
      message: "Transaction type created successfully",
      data: {
        id: result,
        name,
      },
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

const deleteTransactionType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await sequelize.query(`SELECT * FROM transaction_types WHERE id = :id`, { replacements: { id } });

    if (exists.length === 0) {
        return next(new ErrorHander("TransactionType not found", 404));
    }

    await sequelize.query(`DELETE FROM transaction_types WHERE id = :id`, { replacements: { id } });

    return res.status(200).json({
      success: true,
      message: "Transaction type deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

module.exports = {
  getTransactionTypes,
  createTransactionType,
  deleteTransactionType,
};
