const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    senderRole: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    readByAdmin: { type: Boolean, default: false },
    readByUser: { type: Boolean, default: false }
}, { timestamps: true });

chatMessageSchema.index({ username: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
