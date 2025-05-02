const express = require('express');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check if the password matches
    if (password === 'church2025') {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

module.exports = router; 