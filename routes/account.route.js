const router = require('express').Router();
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, accountController.createAccount);
router.get('/', authMiddleware, accountController.getAccounts); 
router.get('/:id', authMiddleware, accountController.getAccountById); 
router.put('/:id', authMiddleware, accountController.updateAccount); 
router.delete('/:id', authMiddleware, accountController.deleteAccount); 
router.get('/balance/:id', authMiddleware, accountController.getAccountBalance);

module.exports = router;