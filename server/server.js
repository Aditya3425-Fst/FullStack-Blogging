const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

// -----------------------
// INITIAL SETUP
// -----------------------
const app = express();
const dirname = path.resolve();

console.log('--- Environment Check ---');
console.log({
  NODE_ENV: process.env.NODE_ENV,
  PORT_FROM_ENV: process.env.PORT,
  MONGO_URI_LOADED: !!process.env.MONGO_URI,
});
console.log('-------------------------');

// -----------------------
// CORS CONFIG
// -----------------------
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? true        // allow all in production
      : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// -----------------------
// BODY PARSERS
// -----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------
// ROUTES
// -----------------------
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

app.get('/', (req, res) => {
  res.send('Blog API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// -----------------------
// SERVE FRONTEND IN PRODUCTION (VERY IMPORTANT)
// -----------------------
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(dirname, 'client', 'dist')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(dirname, 'client', 'dist', 'index.html'));
//   });
// }

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(dirname, "../client/dist");

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, "client", "dist", "index.html"));
  });
}

// -----------------------
// ERROR HANDLING (must be last)
// -----------------------
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

// -----------------------
// DATABASE + SERVER START
// -----------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
