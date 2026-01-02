const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic check (Mongoose does most validation)
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;