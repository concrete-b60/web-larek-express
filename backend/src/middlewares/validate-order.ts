import { celebrate, Joi, Segments } from 'celebrate';

const validateOrder = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().allow(null).required(),
    items: Joi.array().items(Joi.string().required()),
  }),
});

export default validateOrder;
