import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "./AppError";

const asyncErrorHandler = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((error: AppError) =>
      next(error),
    );
  };
};

export default asyncErrorHandler;
