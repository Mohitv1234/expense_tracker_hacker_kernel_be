const router = require("express").Router();

const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, transactionController.createTransaction);
router.get("/", authMiddleware, transactionController.getTransactions);
router.get("/search", authMiddleware, transactionController.searchTransactions);
router.get("/:id", authMiddleware, transactionController.getTransactionById);
router.put("/:id", authMiddleware, transactionController.updateTransaction);
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
