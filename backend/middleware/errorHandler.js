export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || res.statusCode || 500;
  let message = error.message || 'Server error';

  if (error.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value already exists';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(item => item.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
}
