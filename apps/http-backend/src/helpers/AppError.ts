class AppError extends Error {
  statusCode: number;
  status: string;
  isOperationalError: boolean;
  code?: number; // To handle MongoDB error codes

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperationalError = true;

    // Set the prototype explicitly for extending built-ins
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;

