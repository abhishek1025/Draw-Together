import AppError from './AppError';

const createError = ({
  message,
  statusCode,
}: {
  message: string;
  statusCode: number;
}): never => {
  throw new AppError(message, statusCode);
};

export default createError;

