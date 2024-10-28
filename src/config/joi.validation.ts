import * as Joi from 'joi';

export const JoiVlidationSchema = Joi.object({
  MONGO_DB: Joi.required(),
  PORT: Joi.number().default(3000),
  DEFAULTLIMIT: Joi.number().default(10),
});
