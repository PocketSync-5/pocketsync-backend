import { CustomError } from "./app.error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string = "Not Found") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}