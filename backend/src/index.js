require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

console.log('Initializing Firebase with project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Using credentials from:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
});

// Test Firestore connection
const db = admin.firestore();
db.collection('test').doc('test').get()
  .then(() => console.log('Successfully connected to Firestore'))
  .catch(error => console.error('Firestore connection error:', error));

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://refuge-survey-frontend-257839159637.us-central1.run.app',
    'https://refuge-survey-frontend-kuyzzpzxyq-uc.a.run.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Refuge Survey API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount survey routes
const surveyRoutes = require('./routes/survey');
app.use('/api/surveys', surveyRoutes);

// Mount responses routes
const responseRoutes = require('./routes/responses');
app.use('/api/responses', responseRoutes);

// Mount admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 