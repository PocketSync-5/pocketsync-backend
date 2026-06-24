import { CustomError } from "./app.error";

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string = "Conflict") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}