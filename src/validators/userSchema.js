import joi from 'joi';

export const postUserSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).max(255).required(),
});

export const changePasswordSchema = joi.object({
  oldPassword: joi.string().min(6).max(255).required(),
  newPassword: joi.string().min(6).max(255).required(),
  confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
});
