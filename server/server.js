require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const auth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');
const cors = require('cors');
const executeCodeRoutes = require('./routes/execute-code');   
const mcqRoutes = require('./routes/mcqRoutes');
const codingChallengesRoutes = require('./routes/codingChallengesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,  
}));

// Connect to database
connectDB();

app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Platform API',
      version: '1.0.0',
      description: 'API for managing tests, MCQs, and coding challenges',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js', './swagger/schemas.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/execute-code', executeCodeRoutes);
app.use('/api/admin/mcq', mcqRoutes);
app.use('/api/coding-challenges', codingChallengesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', testRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add this line for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Add this at the end of your routes
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

