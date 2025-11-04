import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../utils/httpStatus'

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode = HttpStatus.InternalServerError, message } = err;
  res.status(statusCode).send({
    message: statusCode === HttpStatus.InternalServerError
      ? 'На сервере произошла ошибка'
      : message,
  });
};

export default errorHandler;
