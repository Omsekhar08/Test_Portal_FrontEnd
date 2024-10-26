const express = require('express');
const MCQController = require('../controllers/MCQController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

console.log('MCQ routes loaded');

/**
 * @swagger
 * /api/admin/mcq/submit:
 *   post:
 *     summary: Submit MCQs (Admin only)
 *     tags: [MCQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mcqs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswers:
 *                       type: array
 *                       items:
 *                         type: number
 *                     isMultipleAnswer:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: MCQs submitted successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/submit', auth, isAdmin, MCQController.submitMCQs);

/**
 * @swagger
 * /api/admin/mcq:
 *   get:
 *     summary: Get all MCQs
 *     tags: [MCQs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved MCQs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', auth, MCQController.getMCQs);

/**
 * @swagger
 * /api/admin/mcq/{id}:
 *   get:
 *     summary: Get MCQs by ID
 *     tags: [MCQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved MCQs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', auth, MCQController.getMCQsById);

/**
 * @swagger
 * /api/admin/mcq/{id}:
 *   delete:
 *     summary: Delete MCQs by ID
 *     tags: [MCQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MCQs deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', auth, isAdmin, MCQController.deleteMCQsById);

/**
 * @swagger
 * /api/admin/mcq/update/{id}:
 *   put:
 *     summary: Update MCQs by ID
 *     tags: [MCQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mcqs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswers:
 *                       type: array
 *                       items:
 *                         type: number
 *                     isMultipleAnswer:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: MCQs updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/update/:id', auth, isAdmin, MCQController.updateMCQsById);



module.exports = router;
