const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Salaries
 *   description: Salary management
 */

/**
 * @swagger
 * /salaries:
 *   post:
 *     summary: Create a new salary record
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salary'
 *     responses:
 *       201:
 *         description: Salary record created successfully
 *       400:
 *         description: Bad request
 */
router.post('/salaries', authMiddleware.verifyToken, salaryController.createSalary);

/**
 * @swagger
 * /salaries:
 *   get:
 *     summary: Retrieve a list of salary records
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of salary records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 */
router.get('/salaries/awaiting', authMiddleware.verifyToken, salaryController.awaitingSalaries);
router.get('/salaries/paid', authMiddleware.verifyToken, salaryController.paidSalaries);
router.get('/salaries/previous', authMiddleware.verifyToken, salaryController.previousSalaries);
router.post('/salariesByQuery', authMiddleware.verifyToken, salaryController.getSalariesByQuery);
// /**
//  * @swagger
//  * /salaries/{id}:
//  *   get:
//  *     summary: Retrieve a salary record by ID
//  *     tags: [Salaries]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The salary record ID
//  *     responses:
//  *       200:
//  *         description: A salary record
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Salary'
//  *       404:
//  *         description: Salary record not found
//  */
// router.get('/salaries/:id', authMiddleware.verifyToken, salaryController.getSalaryById);

// /**
//  * @swagger
//  * /salaries/{id}:
//  *   patch:
//  *     summary: Update a salary record by ID
//  *     tags: [Salaries]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The salary record ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Salary'
//  *     responses:
//  *       200:
//  *         description: Salary record updated successfully
//  *       404:
//  *         description: Salary record not found
//  */
// router.patch('/salaries/:id', authMiddleware.verifyToken, salaryController.updateSalary);

// /**
//  * @swagger
//  * /salaries/{id}:
//  *   delete:
//  *     summary: Delete a salary record by ID
//  *     tags: [Salaries]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The salary record ID
//  *     responses:
//  *       200:
//  *         description: Salary record deleted successfully
//  *       404:
//  *         description: Salary record not found
//  */
// router.delete('/salaries/:id', authMiddleware.verifyToken, salaryController.deleteSalary);

module.exports = router;