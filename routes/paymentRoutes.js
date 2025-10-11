const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/payment', authMiddleware.verifyToken, paymentController.submitPaymentForm);
router.get('/payment', authMiddleware.verifyToken, paymentController.getAllPayments);
router.get('/payment/awaiting', authMiddleware.verifyToken, paymentController.awaitingPayments);
router.get('/payment/paid', authMiddleware.verifyToken, paymentController.paidPayments);
router.get('/payment/:id', authMiddleware.verifyToken, paymentController.getPaymentById);
router.patch('/payment/:id', authMiddleware.verifyToken, paymentController.updatePaymentById);
module.exports = router;