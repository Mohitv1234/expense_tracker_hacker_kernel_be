const router = require("express").Router();

const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/monthly", authMiddleware, reportController.getMonthlyReport);
router.get("/category", authMiddleware, reportController.getCategoryReport);

module.exports = router;
