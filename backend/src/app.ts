import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import { requestLogger, errorLogger, logger } from './middlewares/logger';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/errorHandler';

const { PORT = 3000 } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public')));

app.use(requestLogger);

mongoose.connect(DB_ADDRESS);

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
