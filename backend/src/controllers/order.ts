import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены в базе'));
    }

    const invalidProducts = products.filter((p) => p.price === null);
    if (invalidProducts.length) {
      return next(new BadRequestError('Некоторые товары не продаются (цена = null)'));
    }

    const calculatedTotal = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    const finalTotal = total ?? calculatedTotal;
    if (calculatedTotal !== finalTotal) {
      return next(new BadRequestError(
        `Сумма заказа (${finalTotal}) не совпадает с вычисленной (${calculatedTotal})`,
      ));
    }

    const orderId = randomUUID();

    return res.send({
      id: orderId,
      total: finalTotal,
    });
  } catch (error) {
    return next(new InternalServerError('Ошибка при создании заказа'));
  }
};

export default createOrder;
