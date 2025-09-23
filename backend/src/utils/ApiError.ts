class ApiError extends Error {
  public statusCode: number;
  public errors: any;
  public success: boolean;
  public data: null;

  constructor(statusCode: number, message: string, errors: any[] = [], stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };