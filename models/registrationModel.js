const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    interest: { type: String, required: true },
    message:  { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
