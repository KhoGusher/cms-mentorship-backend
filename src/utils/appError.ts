class AppError extends Error {
  statusCode: number;
  status: string; // Add the status property
  isOperational: boolean;

  constructor(message: string | undefined, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
