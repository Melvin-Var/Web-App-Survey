const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { createObjectCsvStringifier } = require('csv-writer');

// Submit a survey response
router.post('/survey/:surveyId', async (req, res) => {
  try {
    const { name, contactNumber, ageBracket, preferredDays, preferredTime, preferredSuburbs, groupTypes, studyApproach } = req.body;
    const surveyId = req.params.surveyId;
    
    if (!name || !contactNumber || !ageBracket || !preferredTime || !preferredSuburbs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify survey exists
    const surveyRef = await db.collection('surveys').doc(surveyId).get();
    if (!surveyRef.exists) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const now = new Date();
    const responseRef = await db.collection('survey_responses').add({
      surveyId,
      name,
      contactNumber,
      ageBracket,
      preferredDays: Array.isArray(preferredDays) ? preferredDays : [],
      preferredTime,
      preferredSuburbs,
      groupTypes: Array.isArray(groupTypes) ? groupTypes : [],
      studyApproach: Array.isArray(studyApproach) ? studyApproach : [],
      createdAt: now
    });

    res.status(201).json({ 
      id: responseRef.id,
      message: 'Response submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get all responses for a survey
router.get('/survey/:surveyId', async (req, res) => {
  try {
    console.log('Fetching responses for survey:', req.params.surveyId);
    
    const snapshot = await db.collection('survey_responses')
      .where('surveyId', '==', req.params.surveyId)
      .get();
    
    console.log('Found responses:', snapshot.size);
    
    const responses = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('Response data:', data);
      responses.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt.toISOString()) : null
      });
    });

    console.log('Sending responses:', responses);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get a single response
router.get('/:id', async (req, res) => {
  try {
    const responseRef = await db.collection('survey_responses').doc(req.params.id).get();
    
    if (!responseRef.exists) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({
      id: responseRef.id,
      ...responseRef.data()
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

// Delete a response
router.delete('/:id', async (req, res) => {
  try {
    const responseRef = db.collection('survey_responses').doc(req.params.id);
    const response = await responseRef.get();

    if (!response.exists) {
      return res.status(404).json({ error: 'Response not found' });
    }

    await responseRef.delete();
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
});

// Download responses as CSV
router.get('/survey/:surveyId/csv', async (req, res) => {
  try {
    // Get survey details
    const surveyRef = await db.collection('surveys').doc(req.params.surveyId).get();
    if (!surveyRef.exists) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Get responses
    const snapshot = await db.collection('survey_responses')
      .where('surveyId', '==', req.params.surveyId)
      .get();
    
    const responses = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      responses.push({
        ...data,
        createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt.toISOString()) : null
      });
    });

    // Prepare CSV headers
    const headers = [
      { id: 'name', title: 'Name' },
      { id: 'contactNumber', title: 'Contact Number' },
      { id: 'ageBracket', title: 'Age Bracket' },
      { id: 'preferredDays', title: 'Usage Days' },
      { id: 'preferredTime', title: 'Usage Time' },
      { id: 'preferredSuburbs', title: 'Store Location' },
      { id: 'createdAt', title: 'Submission Date' }
    ];

    // Create CSV stringifier
    const csvStringifier = createObjectCsvStringifier({
      header: headers
    });

    // Prepare CSV data
    const records = responses.map(response => ({
      name: response.name || '',
      contactNumber: response.contactNumber || '',
      ageBracket: response.ageBracket || '',
      preferredDays: Array.isArray(response.preferredDays) ? response.preferredDays.join(', ') : '',
      preferredTime: response.preferredTime || '',
      preferredSuburbs: response.preferredSuburbs || '',
      createdAt: response.createdAt ? new Date(response.createdAt).toLocaleString() : ''
    }));

    // Generate CSV string
    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=survey_responses_${req.params.surveyId}.csv`);

    // Send CSV
    res.send(csvString);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

// Delete all responses for a survey
router.delete('/survey/:surveyId', async (req, res) => {
  try {
    const snapshot = await db.collection('survey_responses')
      .where('surveyId', '==', req.params.surveyId)
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.json({ message: 'All responses deleted successfully' });
  } catch (error) {
    console.error('Error deleting responses:', error);
    res.status(500).json({ error: 'Failed to delete responses' });
  }
});

module.exports = router; 