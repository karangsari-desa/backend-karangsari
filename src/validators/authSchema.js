import joi from 'joi';

export const putAuthSchema = joi.object({
  refreshToken: joi.string().required(),
});

export const deleteAuthSchema = joi.object({
  refreshToken: joi.string().required(),
});
