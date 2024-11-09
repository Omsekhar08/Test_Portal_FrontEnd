const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Add this line to import the User model
const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user or log in existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               userId:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered or logged in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email || username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, userController.getProfile);

/**
 * @swagger
 * /api/users/test:
 *   get:
 *     summary: Retrieve all tests
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.get('/test', auth, userController.getTest);

/** 
 * @swagger
 * /api/users/test/{id}:
 *   get:
 *     summary: Get test by ID
 *     tags: [Tests]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the test to retrieve
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Test not found
 */
router.get('/test/:id', auth, userController.getTestById);

/**
 * @swagger
 * /api/users/mcq/test/{testId}/{mcqId}/submit:
 *   post:
 *     summary: Submit MCQs for a test
 *     tags: [MCQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: testId
 *         in: path
 *         description: ID of the test
 *       - name: mcqId
 *         in: path
 *         description: ID of the MCQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 questionId:
 *                   type: string
 *                 selectedAnswers:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       200:
 *         description: MCQs submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 totalQuestions:
 *                   type: number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorize
 *       404:
 *         description: Test or MCQ not found
 */
router.post('/mcq/test/:testId/submit', auth, userController.submitMCQs);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/profile', auth, userController.updateProfile);

/**
 * @swagger
 * /api/users/test-judge0:
 *   post:
 *     summary: Test Judge0 code execution
 *     tags: [Code Execution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - code
 *               - input
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [c, cpp, java, python, javascript]
 *               code:
 *                 type: string
 *               input:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stdout:
 *                   type: string
 *                 stderr:
 *                   type: string
 *                 compile_output:
 *                   type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/test-judge0', async (req, res) => {
    try {
      const { language, code, input } = req.body;
      console.log('Received request:', { language, code, input });
  
      const languageToJudge0 = {
        'c': 50,
        'cpp': 54,
        'java': 62,
        'python': 71,
        'javascript': 63
      };
  
      const languageId = languageToJudge0[language.toLowerCase()];
      if (!languageId) {
        return res.status(400).json({ error: 'Unsupported language' });
      }
  
      // Encode code and input as base64
      const base64Code = Buffer.from(code).toString('base64');
      const base64Input = Buffer.from(input).toString('base64');
  
      const response = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=true`, {
        source_code: base64Code,
        language_id: languageId,
        stdin: base64Input
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const { token } = response.data;
      console.log('Submission token:', token);
  
      // Poll for the result
      let result;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        const statusResponse = await axios.get(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`);
        result = statusResponse.data;
        console.log('Polling status:', result.status);
      } while (result.status.id <= 2); // 1: In Queue, 2: Processing
  
      console.log('Final result:', result);
  
      // Decode base64 outputs
      const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : null;
      const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : null;
      const compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : null;
  
      res.status(200).json({
        stdout,
        stderr,
        compile_output,
        message: result.message,
        status: result.status,
        time: result.time,
        memory: result.memory,
      });
    } catch (error) {
      console.error('Error testing Judge0:', error);
      res.status(500).json({ error: error.message });
    }
  });

/**
 * @swagger
 * /api/execute-code:
 *   post:
 *     summary: Execute code for a coding challenge
 *     tags: [Code Execution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - code
 *               - inputs
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [c, cpp, java, python, javascript]
 *               code:
 *                 type: string
 *               inputs:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/execute-code', async (req, res) => {
    try {
      const { language, code, inputs } = req.body;
      console.log('Received request:', { language, code, inputs });
  
      const languageToFaas = {
        'c': 'c-runner',
        'cpp': 'cpp-runner',
        'java': 'java-runner',
        'python': 'python3-runner',
        'javascript': 'js-runner'
      };
  
      const faasFunction = languageToFaas[language.toLowerCase()];
      if (!faasFunction) {
        throw new Error('Unsupported language');
      }
  
      console.log('Sending request to OpenFaaS:', { faasFunction, code, inputs });
  
      const response = await axios.post(
        `https://interpreter.hysterchat.com/function/${faasFunction}`,
        {
          code,
          inputs,
          requestId: Date.now().toString()
        },
        {
          headers: { 
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('Received response from OpenFaaS:', response.data);
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error executing code:', error);
      
      let errorMessage = error.message;
      let errorDetails = {};
  
      if (error.response && error.response.data) {
        try {
          const parsedError = JSON.parse(error.response.data.split('\n')[1]);
          errorMessage = "Compilation Error";
          errorDetails = {
            result: parsedError.result,
            error: parsedError.error,
            requestId: parsedError.requestId
          };
        } catch (parseError) {
          errorMessage = "Error parsing OpenFaaS response";
          errorDetails = { rawError: error.response.data };
        }
      }
  
      res.status(500).json({
        message: errorMessage,
        details: errorDetails
      });
    }
  });

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh user token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401: 
 *         description: Unauthorized
 */
router.post('/refresh-token', auth, userController.refreshToken);

module.exports = router;