const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all vendor routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('vendor'));

// Test routes

/**
 * Vendor Test Routes
 */
/** 
 * @swagger
 * tags:
 *   name: Vendor Tests
 *   description: API endpoints for managing vendor tests   
 */
/** 
 * @swagger
 * /vendor/api/tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Vendor Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:   
 *       201:
 *         description: Test created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       400:
 *         description: Bad request - Invalid input data  
 *       500:
 *         description: Internal server error - Failed to create test
 */

router.post('/api/tests', vendorController.createTest);

/** 
 * @swagger
 * /vendor/api/tests/{vendorId}:
 *   get:
 *     summary: Get all tests for a vendor
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Tests fetched successfully
 *       500:
 *         description: Internal server error - Failed to fetch tests
 */
router.get('/api/tests/:vendorId', vendorController.getVendorTests);

/** 
 * @swagger
 * /vendor/api/tests/test/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test
 */
router.get('/api/tests/test/:id', vendorController.getTestById);

/** 
 * @swagger
 * /vendor/api/tests/test/status/{id}:
 *   get:
 *     summary: Get a test status by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test status fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test status
 */
router.get('/api/tests/test/status/:id', vendorController.getTestStatus);

/** 
 * @swagger
 * /vendor/api/tests/test/participants/{id}:
 *   get:
 *     summary: Get a test participants by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test participants fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test participants
 */
router.get('/api/tests/test/participants/:id', vendorController.getTestParticipants);

/** 
 * @swagger
 * /vendor/api/tests/test/results/{id}:
 *   get:
 *     summary: Get a test results by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test results fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test results
 */
router.get('/api/tests/test/results/:id', vendorController.getTestResults);

/** 
 * @swagger
 * /vendor/api/tests/test/analytics/{id}:
 *   get:
 *     summary: Get a test analytics by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test analytics fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test analytics
 */
router.get('/api/tests/test/analytics/:id', vendorController.getTestAnalytics);

/** 
 * @swagger
 * /vendor/api/tests/test/analytics/participants/{id}:
 *   get:
 *     summary: Get a test analytics participants by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test analytics participants fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test analytics participants
 */
router.get('/api/tests/test/analytics/participants/:id', vendorController.getTestAnalyticsParticipants);

/** 
 * @swagger
 * /vendor/api/tests/test/analytics/results/{id}:
 *   get:
 *     summary: Get a test analytics results by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test analytics results fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test analytics results
 */
router.get('/api/tests/test/analytics/results/:id', vendorController.getTestAnalyticsResults);

/** 
 * @swagger
 * /vendor/api/tests/test/completed/users/{id}:
 *   get:
 *     summary: Get a test completed users by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test completed users fetched successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to fetch test completed users
 */
router.get('/api/tests/test/completed/users/:id', vendorController.getTestCompletedUsers);

/** 
 * @swagger
 * /vendor/api/tests/:id:
 *   put:
 *     summary: Update a test by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test updated successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to update test
 */
router.put('/api/tests/:id', vendorController.updateTest);

/** 
 * @swagger
 * /vendor/api/tests/:id:
 *   delete:
 *     summary: Delete a test by ID
 *     tags: [Vendor Tests]
 *     responses:
 *       200:
 *         description: Test deleted successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error - Failed to delete test
 */
router.delete('/api/tests/:id', vendorController.deleteTest);

module.exports = router; 