const express = require('express')
const { getTransactionTypes, createTransactionType, deleteTransactionType } = require('../controllers/trabsactionType.controller')

const router = express.Router()



// ======================================
// GET ALL TRANSACTION TYPES
// ======================================

router.get(
    '/',
    getTransactionTypes
)

// ======================================
// CREATE TRANSACTION TYPE
// ======================================

router.post(
    '/',
    createTransactionType
)

// ======================================
// DELETE TRANSACTION TYPE
// ======================================

router.delete(
    '/:id',
    deleteTransactionType
)

module.exports = router