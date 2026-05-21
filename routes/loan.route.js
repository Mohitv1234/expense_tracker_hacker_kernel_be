const router = require("express").Router();

const loanController = require("../controllers/loan.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, loanController.createLoan);
router.get("/", authMiddleware, loanController.getLoans);
router.get("/:id", authMiddleware, loanController.getLoanById);
router.post("/payment", authMiddleware, loanController.payLoanInstallment);
router.delete("/:id", authMiddleware, loanController.deleteLoan);

module.exports = router;
