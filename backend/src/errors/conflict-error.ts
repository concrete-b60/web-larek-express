import { HttpStatus } from '../utils/httpStatus'

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.Conflict;
  }
}

export default ConflictError;
