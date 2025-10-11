const express=require('express');
const router=express.Router();
const leadController=require('../controllers/leadController');
const authMiddleware=require('../middlewares/authMiddleware');

router.post('/lead',authMiddleware.verifyToken,leadController.createLead);
router.get('/lead/pending',authMiddleware.verifyToken,leadController.getAllLeads);
router.get('/lead/converted',authMiddleware.verifyToken,leadController.getConvertedLeads);
router.get('/lead/loss',authMiddleware.verifyToken,leadController.getLossLeads);
router.get('/lead/:id',authMiddleware.verifyToken,leadController.getLeadById);
router.patch('/lead/:id',authMiddleware.verifyToken,leadController.updateLead);

module.exports=router;