import { ErrorRequestHandler, NextFunction, Response } from "express";
import { AppError, filterError } from "../helpers";

const handleError: ErrorRequestHandler = (error, req, res, next) => {
  // Filter and modify the error
  const appError = filterError(error as AppError) as AppError;

  console.log(appError);

  // Send the error response to the client
  res.status(appError.statusCode).json({
    status: appError.statusCode,
    message: appError.message,
  });
};

export default handleError;
