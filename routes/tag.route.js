const router = require("express").Router();

const tagController = require("../controllers/tag.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, tagController.createTag);
router.get("/", authMiddleware, tagController.getTags);
router.delete("/:id", authMiddleware, tagController.deleteTag);

module.exports = router;
