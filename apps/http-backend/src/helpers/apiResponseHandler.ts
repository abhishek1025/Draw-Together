import { Response } from 'express';
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

type SuccessResponseParams = {
  res: Response;
  data?: any;
  statusCode?: number;
  message?: string;
};

export const sendSuccessResponse = ({
  res,
  data,
  statusCode = StatusCodes.OK,
  message,
}: SuccessResponseParams) => {
  res.status(statusCode).json({
    status: 'ok',
    ...(data && { data }),
    ...(message && { message }),
  });
};

export default sendSuccessResponse;


