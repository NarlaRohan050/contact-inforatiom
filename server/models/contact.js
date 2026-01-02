const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: { type: String, required: true, trim: true },
  message: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);