const sequelize = require('../config/database')

// ======================================
// GET ALL TRANSACTION TYPES
// ======================================

const getTransactionTypes =
    async (req, res) => {
        try {
            const [rows] =
                await sequelize.query(`
                    SELECT *
                    FROM transaction_types
                    ORDER BY id DESC
                `)

            return res.status(200).json({
                success: true,
                message:
                    'Transaction types fetched successfully',
                data: rows,
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                success: false,
                message:
                    'Failed to fetch transaction types',
                error: error.message,
            })
        }
    }

// ======================================
// CREATE TRANSACTION TYPE
// ======================================

const createTransactionType =
    async (req, res) => {
        try {
            const { name } = req.body

            if (!name) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            'Transaction type name is required',
                    })
            }

            // CHECK DUPLICATE

            const [exists] =
                await sequelize.query(
                    `
                    SELECT id
                    FROM transaction_types
                    WHERE name = :name
                `,
                    {
                        replacements:
                            { name },
                    }
                )

            if (exists.length > 0) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            'Transaction type already exists',
                    })
            }

            // INSERT

            const [result] =
                await sequelize.query(
                    `
                    INSERT INTO transaction_types (name)
                    VALUES (:name)
                `,
                    {
                        replacements:
                            { name },
                    }
                )

            return res.status(201).json({
                success: true,
                message:
                    'Transaction type created successfully',
                data: {
                    id:
                        result,
                    name,
                },
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                success: false,
                message:
                    'Failed to create transaction type',
                error: error.message,
            })
        }
    }

// ======================================
// DELETE TRANSACTION TYPE
// ======================================

const deleteTransactionType =
    async (req, res) => {
        try {
            const { id } = req.params

            const [exists] =
                await sequelize.query(
                    `
                    SELECT *
                    FROM transaction_types
                    WHERE id = :id
                `,
                    {
                        replacements:
                            { id },
                    }
                )

            if (exists.length === 0) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            'Transaction type not found',
                    })
            }

            await sequelize.query(
                `
                DELETE FROM transaction_types
                WHERE id = :id
            `,
                {
                    replacements: {
                        id,
                    },
                }
            )

            return res.status(200).json({
                success: true,
                message:
                    'Transaction type deleted successfully',
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                success: false,
                message:
                    'Failed to delete transaction type',
                error: error.message,
            })
        }
    }

module.exports = {
    getTransactionTypes,
    createTransactionType,
    deleteTransactionType,
}