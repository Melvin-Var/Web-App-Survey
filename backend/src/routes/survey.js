const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Create a new survey
router.post('/', async (req, res) => {
  try {
    const { name, questions } = req.body;
    
    if (!name || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid survey data' });
    }

    const surveyRef = await db.collection('surveys').add({
      name,
      questions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      id: surveyRef.id,
      name,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// Get all surveys
router.get('/', async (req, res) => {
  try {
    const surveysSnapshot = await db.collection('surveys').get();
    const surveys = [];
    surveysSnapshot.forEach(doc => {
      surveys.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// Get a single survey
router.get('/:id', async (req, res) => {
  try {
    const surveyRef = await db.collection('surveys').doc(req.params.id).get();
    if (!surveyRef.exists) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json({
      id: surveyRef.id,
      ...surveyRef.data()
    });
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

// Update a survey
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, questions } = req.body;
    
    if (!name || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid survey data' });
    }

    await db.collection('surveys').doc(id).update({
      name,
      questions,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ id, name, questions });
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ 
      error: 'Failed to update survey',
      details: error.message,
      code: error.code
    });
  }
});

// Delete a survey
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('surveys').doc(id).delete();
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ 
      error: 'Failed to delete survey',
      details: error.message,
      code: error.code
    });
  }
});

// Submit survey responses
router.post('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactNumber, ageBracket, preferredDays, preferredTime, preferredSuburbs } = req.body;
    
    console.log('Received survey response:', { id, name, contactNumber, ageBracket, preferredDays, preferredTime, preferredSuburbs });

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!contactNumber) {
      return res.status(400).json({ error: 'Contact number is required' });
    }
    if (!ageBracket) {
      return res.status(400).json({ error: 'Age bracket is required' });
    }
    if (!preferredTime) {
      return res.status(400).json({ error: 'Preferred time is required' });
    }
    if (!preferredSuburbs) {
      return res.status(400).json({ error: 'Store location is required' });
    }

    // First verify the survey exists
    const surveyDoc = await db.collection('surveys').doc(id).get();
    if (!surveyDoc.exists) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const now = new Date();
    // Store the response
    const responseRef = await db.collection('survey_responses').add({
      surveyId: id,
      name,
      contactNumber,
      ageBracket,
      preferredDays: Array.isArray(preferredDays) ? preferredDays : [],
      preferredTime,
      preferredSuburbs,
      createdAt: now
    });

    console.log('Successfully stored response:', responseRef.id);

    res.status(201).json({
      message: 'Survey response submitted successfully',
      id: responseRef.id
    });
  } catch (error) {
    console.error('Error submitting survey response:', error);
    res.status(500).json({ 
      error: 'Failed to submit survey response',
      details: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 