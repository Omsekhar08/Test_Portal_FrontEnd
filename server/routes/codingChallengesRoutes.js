const express = require('express');
const codingChallengeController = require('../controllers/codingChallengeController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Coding Challenges
 *   description: API endpoints for managing coding challenges
 */

/**
 * @swagger
 * /api/coding-challenges/submit:
 *   post:
 *     summary: Submit a new coding challenge
 *     tags:
 *       - Coding Challenges
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: string
 *                     output:
 *                       type: string
 *     responses:
 *       201:
 *         description: Coding challenge submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 challenge:
 *                   $ref: '#/components/schemas/CodingChallenge'
 *       500:
 *         description: Error submitting coding challenge
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

/**
 * @swagger
 * /api/coding-challenges:
 *   get:
 *     summary: Get all coding challenges
 *     tags:
 *       - Coding Challenges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coding challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenges:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CodingChallenge'
 *       500:
 *         description: Error fetching coding challenges
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

/**
 * @swagger
 * /api/coding-challenges/{id}:
 *   delete:
 *     summary: Delete a coding challenge by ID
 *     tags:
 *       - Coding Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the coding challenge to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coding challenge deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error deleting coding challenge
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

/**
 * @swagger
 * /api/coding-challenges/{id}:
 *   put:
 *     summary: Update a coding challenge by ID
 *     tags:
 *       - Coding Challenges

 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the coding challenge to update
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: string
 *                     output:
 *                       type: string
 *     responses:
 *       200:
 *         description: Coding challenge updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 challenge:
 *                   $ref: '#/components/schemas/CodingChallenge'
 *       500:
 *         description: Error updating coding challenge
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

/**
 * @swagger
 * /api/coding-challenges/{id}/submit:
 *   post:
 *     summary: Submit a solution for a specific coding challenge
 *     tags:
 *       - Coding Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the coding challenge
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
 *               code:
 *                 type: string
 *                 description: The submitted code solution
 *               language:
 *                 type: string
 *                 description: The programming language of the solution
 *               testResults:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     passed:
 *                       type: boolean
 *                     input:
 *                       type: string
 *                     expectedOutput:
 *                       type: string
 *                     actualOutput:
 *                       type: string
 *               passed:
 *                 type: boolean
 *                 description: Whether all test cases passed
 *     responses:
 *       200:
 *         description: Solution submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   type: object
 *                   properties:
 *                     challengeId:
 *                       type: string
 *                     code:
 *                       type: string
 *                     language:
 *                       type: string
 *                     testResults:
 *                       type: array
 *                     passed:
 *                       type: boolean
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error submitting solution
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

router.post('/submit', auth, isAdmin, codingChallengeController.submitCodingChallenge);
router.get('/', auth, isAdmin, codingChallengeController.getCodingChallenges);
router.delete('/:id', auth, isAdmin, codingChallengeController.deleteCodingChallengeById);
router.put('/:id', auth, isAdmin, codingChallengeController.updateCodingChallengeById);
router.post('/:id/submit', auth, codingChallengeController.submitCodingChallengeSolution);

module.exports = router;
