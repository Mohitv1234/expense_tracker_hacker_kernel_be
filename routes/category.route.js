const router = require('express').Router();

const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;