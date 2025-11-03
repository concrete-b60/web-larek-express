import { celebrate, Joi, Segments } from 'celebrate';

const validateObjId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

export default validateObjId;
