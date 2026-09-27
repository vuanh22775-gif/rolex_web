const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username:      { type: String, required: true },
    fullName:      { type: String, required: true },
    email:         { type: String, required: true },
    phone:         { type: String, required: true },
    address:       { type: String, required: true },
    note:          { type: String, default: '' },
    paymentMethod: { type: String, default: 'cod' },
    items: [{
        id:        String,
        name:      String,
        price:     Number,
        qty:       Number,
        lineTotal: Number
    }],
    total:  { type: Number, default: 0 },
    stockDeducted: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'confirmed', 'shipping', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
