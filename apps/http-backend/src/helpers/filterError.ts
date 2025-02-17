import AppError from './AppError';
import { prismaClient } from '@repo/db/prismaClient';

const handlePrismaError = (error: any): AppError => {
  switch (error.code) {
    case 'P2002':
      return new AppError(
        'Duplicate entry detected. A record with the same unique value already exists.',
        400
      );

    case 'P2003':
      return new AppError(
        'Foreign key constraint failed. Please check the referenced records.',
        400
      );

    case 'P2025':
      return new AppError(
        'Record not found. The requested resource does not exist.',
        404
      );

    default:
      return error;
  }
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

  // Handle JWT errors
  if (
    ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(
      error.name
    )
  ) {
    return handleJwtError(error);
  }

  return handlePrismaError(error);
  // return error;
};

