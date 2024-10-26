const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');



/**
 * @swagger
 * /api/users/tests/{id}/register:
 *   post:
 *     summary: Register for a test
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the test to register for  
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
 *               email:
 *                 type: string
 *     responses:
 *       200:   
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:   
 *         description: Error registering for test
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
router.post('/tests/:id/register', testController.registerForTest);
module.exports = router;
