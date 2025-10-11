const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');
/**
 * @swagger
 * tags:
 *   name: GymProfile
 *   description: Gym profile management
 */

/**
 * @swagger
 * /gym-profile:
 *   get:
 *     summary: Retrieve the gym profile
 *     tags: [GymProfile]
 *     responses:
 *       200:
 *         description: The gym profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GymProfile'
 */
router.get('/gymprofile', authMiddleware.verifyToken, gymController.getGymProfile);

router.post('/gymprofile', authMiddleware.verifyToken,upload.single("image"),gymController.addGymProfile);
/**
 * @swagger
 * /gym-profile:
 *   post:
 *     summary: Update the gym profile
 *     tags: [GymProfile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GymProfile'
 *     responses:
 *       200:
 *         description: The updated gym profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GymProfile'
 */
router.patch('/gymprofile/:id', authMiddleware.verifyToken,upload.single('image'), gymController.updateGymProfile);

router.delete('/gymprofile/:id', authMiddleware.verifyToken, gymController.deleteGymProfile);
module.exports = router;
