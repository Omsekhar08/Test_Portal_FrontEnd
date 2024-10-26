/**
 * @swagger
 * components:
 *   schemas:
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
 *     
 *     MCQ:
 *       type: object
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
 *     
 *     CodingChallenge:
 *       type: object
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
 *           additionalProperties:
 *             type: string
 *         testCases:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestCase'
 *         proctoring:
 *           type: boolean
 *     
 *     TestCase:
 *       type: object
 *       properties:
 *         input:
 *           type: string
 *         expectedOutput:
 *           type: string
 *         isVisible:
 *           type: boolean
 */
