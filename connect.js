const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/rolex_boutique';

async function connect() {
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối MongoDB thành công');
}

module.exports = connect;
