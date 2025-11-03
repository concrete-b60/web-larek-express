import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.status(200).send({
    items: products,
    total: products.length,
  }))
  .catch(() => next(new InternalServerError('На сервере произошла ошибка')));

export const createProduct = (req: Request, res: Response, next: NextFunction) => Product
  .create(req.body)
  .then((product) => res.status(201).send({ _id: product.id }))
  .catch((error) => {
    if (error && (error).code === 11000) {
      return next(new ConflictError('Товар с таким title уже существует'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }

    return next(new InternalServerError('Ошибка при создании товара'));
  });
