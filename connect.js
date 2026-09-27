const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/rolex_boutique');
let connectionPromise;

async function connect() {
    if (!mongoURI) throw new Error('MONGODB_URI must be configured in production.');
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(mongoURI).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }
    await connectionPromise;
    return mongoose.connection;
}

module.exports = connect;
