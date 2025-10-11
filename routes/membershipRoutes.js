const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Memberships
 *   description: Membership management
 */

/**
 * @swagger
 * /membership:
 *   get:
 *     summary: Retrieve a list of membership packages
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of membership packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 */
router.get('/membership', authMiddleware.verifyToken, membershipController.getAllPackages);

/**
 * @swagger
 * /membership:
 *   post:
 *     summary: Add a new membership package
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       201:
 *         description: Membership package created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/membership', authMiddleware.verifyToken, membershipController.addPackage);

router.delete('/membership/:id', authMiddleware.verifyToken, membershipController.deletePackage);

router.patch('/membership/:id', authMiddleware.verifyToken, membershipController.updatePackage);
module.exports = router;