const router = require("express").Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/stats", authMiddleware, dashboardController.getDashboardStats);
router.get("/monthly-expense", authMiddleware, dashboardController.getMonthlyExpenseAnalytics);

module.exports = router;
