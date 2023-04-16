const Joi = require('@hapi/joi');

const schema = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.required(),
    id: Joi.number(),
  }),
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  }),
  resetPasswordSchema: Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required()
  }),
  changePasswordSchema: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required()
  }),
  productSchema: Joi.object({
    products: Joi.alternatives().try(
      Joi.object({
        products_name: Joi.string().required()
      }),
      Joi.array().items(
        Joi.object({
          products_name: Joi.string().required()
        })
      ).min(2).required()
    ).required()
  }),
  updateProduct: Joi.object({
    products_name: Joi.string().required(),
  })
};

module.exports = schema;



