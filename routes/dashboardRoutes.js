const express=require('express');
const router=express.Router();

const dashboardController=require('../controllers/dashboardController');
const authMiddleware=require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware.verifyToken, dashboardController.fetchDashboard);
 
module.exports=router;