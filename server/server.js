require('dotenv').config();
console.log('--- Dotenv loaded. process.env contents (partial): ---');
console.log({ 
  NODE_ENV: process.env.NODE_ENV, 
  PORT_FROM_ENV: process.env.PORT, 
  MONGO_URI_LOADED: !!process.env.MONGO_URI 
});
console.log('--------------------------------------------------');

const app = require('./app');
const mongoose = require('mongoose');

const PORT_RAW = process.env.PORT;
const PORT = PORT_RAW || 5000;
console.log(`--- Attempting to use PORT: ${PORT_RAW} (resolved to ${PORT}) ---`); // Debug log for port

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1);
  });
