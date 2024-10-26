const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API endpoints for admin operations
 */

/**
 * @swagger
 * /api/admin/tests:
 *   post:
 *     summary: Create a new test
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               num_participants:
 *                 type: number
 *               duration:
 *                 type: number
 *               proctoring:
 *                 type: boolean
 *               mcqs:
 *                 type: array
 *                 items:
 *                   type: string   
 *               codingChallenges:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Test created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test:
 *                   $ref: '#/components/schemas/Test'
 *       500:   
 *         description: Error creating test
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post('/tests', adminController.createTest);

/**
 * @swagger
 * /api/admin/tests:
 *   get:
 *     summary: Get all tests
 *     tags:
 *       - Admin
 *     responses:   
 *       200:
 *         description: Tests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *       500:   
 *         description: Error fetching tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/tests', adminController.getTests);

/**
 * @swagger
 * /api/admin/tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags:
 *       - Admin
 *     parameters:  
 *       - name: id
 *         in: path
 *         description: ID of the test to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:   
 *         description: Test fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test:
 *                   $ref: '#/components/schemas/Test'
 *       500:   
 *          description: Error fetching test
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/tests/:id', adminController.getTestById);

/**
 * @swagger
 * /api/admin/tests/{id}:
 *   put:
 *     summary: Update a test by ID
 *     tags:
 *       - Admin
 *     parameters:  
 *       - name: id
 *         in: path
 *         description: ID of the test to update
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string 
 *               price:
 *                 type: number
 *               num_participants:
 *                 type: number
 *               duration:
 *                 type: number
 *               proctoring:
 *                 type: boolean
 *               mcqs:
 *                 type: array
 *                 items:
 *                   type: string   
 *               codingChallenges:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Test updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test:
 *                   $ref: '#/components/schemas/Test'
 *       500:   
 *         description: Error updating test
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put('/tests/:id', adminController.UpdateTest);

/**
 * @swagger
 * /api/admin/tests/{id}:
 *   delete:
 *     summary: Delete a test by ID
 *     tags:
 *       - Admin
 *     parameters:  
 *       - name: id
 *         in: path
 *         description: ID of the test to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:   
 *         description: Error deleting test
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.delete('/tests/:id', adminController.deleteTestById);
module.exports = router;