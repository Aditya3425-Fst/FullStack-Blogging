const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware'); // Import error handlers
const path = require('path');
const app = express();

// Explicit CORS Options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // If you need to send cookies or authorization headers
};

// Middlewares
app.use(cors(corsOptions)); // Use configured CORS options
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Basic Route
app.get('/', (req, res) => {
  res.send('Blog API is running!');
});

// --- Mount Routes ---
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
// TODO: Import other routes (user)

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes); // Routes like /api/blogs/:id will be handled here
app.use('/api/comments', commentRoutes); // Routes like /api/comments/:commentId will be handled here
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
// TODO: Mount other routes

const dirname = path.resolve();
// --- Error Handling Middlewares ---
// Must be after all routes
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(dirname, "../client/dist")));

  app.get('*', (req, res) => {
    res.sendFile(path.join(dirname, "../client/dist/index.html"));
  });
}
module.exports = app;
