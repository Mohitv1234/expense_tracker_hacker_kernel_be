const router = require("express").Router();

const budgetController = require("../controllers/budget.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, budgetController.createBudget);
router.get("/", authMiddleware, budgetController.getBudgets);
router.get("/usage/:id", authMiddleware, budgetController.getBudgetUsage);

module.exports = router;
