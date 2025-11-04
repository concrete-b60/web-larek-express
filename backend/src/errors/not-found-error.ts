import { HttpStatus } from '../utils/httpStatus'

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.NotFound;
  }
}

export default NotFoundError;
