const router = require("express").Router();

const attachmentController = require("../controllers/attachment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../config/multer.config");

router.post("/", authMiddleware, upload.single("file"), attachmentController.uploadAttachment);
router.get("/", authMiddleware, attachmentController.getAttachments);

module.exports = router;
