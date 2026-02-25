import joi from 'joi';

export const postNewSchema = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
});

export const putNewSchema = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
});
