import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!payment || !email || !phone || !address || !Array.isArray(items)) {
      return next(new BadRequestError('Отсутствуют обязательные поля'));
    }
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Некорректный способ оплаты'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new BadRequestError('Некорректный email'));
    }

    const itemIds = items.filter(Boolean);

    if (!items.length) {
      return res.status(400).send({ message: 'Массив товаров не может быть пустым' });
    }

    const products = await Product.find({ _id: { $in: itemIds } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены в базе'));
    }

    const invalidProducts = products.filter((p) => p.price === null);
    if (invalidProducts.length) {
      return next(new BadRequestError('Некоторые товары не продаются (цена = null)'));
    }

    const calculatedTotal = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    const finalTotal = total ?? calculatedTotal;
    if (Number.isNaN(finalTotal)) {
      return next(new BadRequestError('Некорректная сумма заказа'));
    }
    if (calculatedTotal !== finalTotal) {
      return next(new BadRequestError(
        `Сумма заказа (${finalTotal}) не совпадает с вычисленной (${calculatedTotal})`,
      ));
    }

    const orderId = randomUUID();

    return res.status(200).send({
      id: orderId,
      total: finalTotal,
    });
  } catch (error) {
    return next(new InternalServerError('Ошибка при создании заказа'));
  }
};

export default createOrder;
