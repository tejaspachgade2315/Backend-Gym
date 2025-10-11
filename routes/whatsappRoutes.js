const express = require('express');
const router = express.Router();

const { upload } = require('../config/cloudinary');

const whatsappController = require('../controllers/whatsappController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-message', authMiddleware.verifyToken, whatsappController.sendMessage);
router.post('/send-receipt', authMiddleware.verifyToken,upload.single("invoice"), whatsappController.sendWhatsAppTemplate);

module.exports = router;