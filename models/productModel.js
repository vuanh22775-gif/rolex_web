const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:         { type: String, required: true, unique: true, trim: true },
    name:       { type: String, required: true, trim: true },
    model:      { type: String, required: true, trim: true },
    price:      { type: Number, required: true, min: 0 },
    stock:      { type: Number, required: true, min: 0, default: 0 },
    collection: { type: String, required: true, enum: ['classic', 'luxury', 'diving', 'sport'] },
    image:      { type: String, default: '' },
    status:     { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' }
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model('Product', productSchema);
