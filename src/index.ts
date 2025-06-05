import express from 'express';
import dotenv from 'dotenv';
import router from './routes/route';
import { connectDB } from './config/db';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB
connectDB();

// API routes
app.use('/api', router);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Muve Email Subscription Service Api!');
});

// app not yet live
app.get('/link', (req, res) => {
  res.send('Muve is not yet live');
});

// Handle invalid HTTP methods for existing routes
app.use('/', (req, res, next): void => {
  const allowedMethods = ['GET', 'POST']; // Add allowed methods as needed
  if (!allowedMethods.includes(req.method)) {
    res.status(405).send('Method Not Allowed');
    return;
  }
  next();
});

// 404 - after all valid routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
