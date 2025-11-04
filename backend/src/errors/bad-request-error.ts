import { HttpStatus } from '../utils/httpStatus'

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BadRequest;
  }
}

export default BadRequestError;
