import AppError from './AppError';

const handleDatabaseError = (error: AppError): AppError => {
  // Handle MongoDB errors
  if (error.name === 'MongoError') {
    switch (error.code) {
      case 11000:
        error.message =
          'Duplicate entry detected. Please ensure unique values are used.';
        error.statusCode = 400;
        break;
      case 121:
        error.message =
          'Document validation failed. Please check the data format.';
        error.statusCode = 400;
        break;
      default:
        error.message = 'Database error occurred. Please try again.';
        error.statusCode = 500;
    }
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    // error.message = 'Validation error. Please check the data provided.';
    error.statusCode = 400;
  }

  return error;
};

const handleJwtError = (error: AppError): AppError => {
  switch (error.name) {
    case 'TokenExpiredError':
      error.message = 'Session expired. Please log in again.';
      error.statusCode = 401;
      break;
    case 'JsonWebTokenError':
      error.message = 'Invalid token. Please log in again.';
      error.statusCode = 401;
      break;
    case 'NotBeforeError':
      error.message = 'Token is not yet active. Please try again later.';
      error.statusCode = 403;
      break;
    default:
      error.message = 'Authentication error occurred. Please try again.';
      error.statusCode = 400;
  }
  return error;
};

export const filterError = (error: AppError): AppError => {
  error.statusCode = error.statusCode || 500;
  error.message =
    error.message || 'Unexpected error occurred. Please try again.';

  // Handle database errors (MongoDB and Mongoose)
  if (['MongoError', 'ValidationError'].includes(error.name)) {
    return handleDatabaseError(error);
  }

  // Handle JWT errors
  if (
    ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(
      error.name
    )
  ) {
    return handleJwtError(error);
  }

  return error; // Return the error if no specific handler is found
};

