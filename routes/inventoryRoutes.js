const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const {upload} = require('../config/cloudinary');
/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Retrieve a list of inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: A list of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */

router.get('/inventory', authMiddleware.verifyToken, inventoryController.getAllInventoryItems);
/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: The created inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/inventory', authMiddleware.verifyToken,upload.single("image"), inventoryController.addInventoryItem);
router.get("/inventory/:id",authMiddleware.verifyToken,inventoryController.getInventoryItemById);
/**
 * @swagger
 * /inventory/{id}:
 *   patch:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: The updated inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.patch('/inventory/:id', authMiddleware.verifyToken,upload.single("image"), inventoryController.updateInventoryItem);

router.delete('/inventory/:id', authMiddleware.verifyToken, inventoryController.deleteInventoryItem);

module.exports = router;