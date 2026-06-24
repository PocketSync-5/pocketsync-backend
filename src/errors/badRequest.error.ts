import { CustomError } from "./app.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = "Bad Request") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}