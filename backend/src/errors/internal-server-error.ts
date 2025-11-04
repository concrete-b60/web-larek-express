import { HttpStatus } from '../utils/httpStatus'

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.InternalServerError;
  }
}

export default InternalServerError;
