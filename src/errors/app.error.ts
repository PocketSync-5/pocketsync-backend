export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // This ensures all our custom errors return a consistent JSON structure to the client
  abstract serializeErrors(): { message: string; field?: string }[];
}