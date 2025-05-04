// Middleware to handle errors passed via next(error)
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error('-----------------------------');
    console.error('ERROR:', err.message);
    console.error('STACK:', err.stack);
    console.error('-----------------------------');

    // Default error status and message
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status code if set, else 500
    let message = 'Server Error';

    // Mongoose Bad ObjectId Error
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = `Resource not found (Invalid ID: ${err.value})`;
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for '${field}'. Please use another value.`;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Combine multiple validation errors into one message
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Invalid input data: ${errors.join('. ')}`;
    }

    // JWT Authentication Errors (customize based on errors thrown in protect middleware)
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Not authorized, token failed (invalid signature)';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Not authorized, token expired';
    }

    // Custom Application Errors (if you create errors with statusCode property)
    if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        message: message,
        // Optionally include stack trace in development environment
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Middleware for handling routes that don't exist
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the global error handler
};

module.exports = { errorHandler, notFound }; 