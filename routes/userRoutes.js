const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// Inactive Members
router.get(
  "/user/inactive",
  authMiddleware.verifyToken,
  userController.getInactiveMembers
);
router.patch(
  "/user/activate/:id",
  authMiddleware.verifyToken,
  userController.activateMember
);

// Members
router.get("/users", authMiddleware.verifyToken, userController.getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.get(
  "/user/generateqrcode",
  authMiddleware.verifyToken,
  userController.generateQRCode
);

/**
 *  @swagger
 *  /user/trainers:
 *    get:
 *      summary: Retrieve a list of trainers
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: A list of trainers
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 * */

/**
 * @swagger
 * /user/members:
 *   get:
 *     summary: Retrieve a list of members
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  "/user/members",
  authMiddleware.verifyToken,
  userController.getAllMembers
);
/**
 * @swagger
 *
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The registered user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/user/register",
  authMiddleware.verifyToken,
  upload.single("image"),
  userController.register
);
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve the user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/user", authMiddleware.verifyToken, userController.getUserInfo);

/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update the user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.patch(
  "/user/:id",
  authMiddleware.verifyToken,
  upload.single("image"),
  userController.updateUserById
);
router.post(
  "/user/changepassword",
  authMiddleware.verifyToken,
  userController.changePassword
);
router.post("/user/resetpassword", userController.resetPassword);
router.post("/user/requestpasswordreset", userController.requestPasswordReset);

/**
 * @swagger
 * /user/receptionists:
 *   get:
 *     summary: Retrieve a list of receptionists
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of receptionists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.get(
  "/user/receptionists",
  authMiddleware.verifyToken,
  userController.getAllReceptionists
);
router.get(
  "/staff",
  authMiddleware.verifyToken,
  userController.getstafftrainers
);
router.get(
  "/user/trainer",
  authMiddleware.verifyToken,
  userController.getAllTrainers
);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/user/:id", authMiddleware.verifyToken, userController.getUserById);
router.delete(
  "/user/:id",
  authMiddleware.verifyToken,
  userController.deleteMember
);

// Staff/Trainer
router.get(
  "/user/trainers",
  authMiddleware.verifyToken,
  userController.getAllTrainers
);
router.get(
  "/staff",
  authMiddleware.verifyToken,
  userController.getstafftrainers
);
router.post(
  "/user/registerstaff",
  authMiddleware.verifyToken,
  upload.single("image"),
  userController.registerStaff
);
router.get(
  "/user/receptionists",
  authMiddleware.verifyToken,
  userController.getAllReceptionists
);
router.patch(
  "/staff/:id",
  authMiddleware.verifyToken,
  upload.single("image"),
  userController.editStafftrainers
);
router.delete(
  "/staff/:id",
  authMiddleware.verifyToken,
  userController.deleteStaffTrainer
);
router.get(
  "/staff/:id",
  authMiddleware.verifyToken,
  userController.getStaffTrainerById
);

module.exports = router;
