/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The role of the user
 *
 *     MCQ:
 *       type: object
 *       required:
 *         - question
 *         - options
 *         - correctAnswers
 *       properties:
 *         question:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         correctAnswers:
 *           type: array
 *           items:
 *             type: number
 *         isMultipleAnswer:
 *           type: boolean
 *           default: false
 *
 *     CodingChallenge:
 *       type: object
 *       required:
 *         - name
 *         - problemStatement
 *         - constraints
 *         - languages
 *       properties:
 *         name:
 *           type: string
 *         problemStatement:
 *           type: string
 *         constraints:
 *           type: string
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         languageImplementations:
 *           type: object
 *         testCases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *               expectedOutput:
 *                 type: string
 *               isVisible:
 *                 type: boolean
 *                 default: true
 *         proctoring:
 *           type: boolean
 *           default: false
 *
 *     Test:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: number
 *         mcqs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MCQ'
 *         codingChallenges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CodingChallenge'
 */