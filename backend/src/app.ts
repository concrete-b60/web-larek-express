import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import { requestLogger, errorLogger, logger } from './middlewares/logger';
import routes from './routes';
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

app.use(routes);

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(DB_ADDRESS).then(() => {
  app.listen(PORT, () => {
    logger.info(`listening on port ${PORT}`);
  });
}).catch(error => {logger.info('Ошибка подключения к базе данных',error.message); });
