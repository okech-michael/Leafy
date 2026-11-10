export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500)
  const response = { success: false, message: error.message || 'Internal server error' }

  if (error.name === 'ValidationError') {
    response.errors = Object.values(error.errors).map((item) => item.message)
  }
  if (error.code === 11000) {
    response.message = 'An account with that email already exists'
  }

  res.status(error.code === 11000 ? 409 : statusCode).json(response)
}
