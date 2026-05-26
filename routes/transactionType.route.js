const express = require("express");
const {
  getTransactionTypes,
  createTransactionType,
  deleteTransactionType,
} = require("../controllers/trabsactionType.controller");

const router = express.Router();

router.get("/", getTransactionTypes);
router.post("/", createTransactionType);
router.delete("/:id", deleteTransactionType);

module.exports = router;
