export function errorHandler(err, req, res, next) {
  console.error('[API Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
    errors: err.errors || null,
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
}

export default {
  errorHandler,
  notFoundHandler,
};
