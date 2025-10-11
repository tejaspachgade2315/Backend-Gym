const express=require('express');
const router=express.Router();

const attendanceController=require('../controllers/attendanceController');
const authMiddleware=require('../middlewares/authMiddleware');

router.post('/attendance/checkin', authMiddleware.verifyToken, attendanceController.checkIn);
router.post('/attendance/checkout', authMiddleware.verifyToken, attendanceController.checkOut);
router.get('/attendance/yearly', authMiddleware.verifyToken, attendanceController.getYearlyAttendance);
router.get('/attenddance/stats', authMiddleware.verifyToken, attendanceController.getAttendanceStats);

module.exports=router;