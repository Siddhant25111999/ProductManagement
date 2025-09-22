const Joi = require("joi");

exports.validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required()
  });
  return schema.validate(data);
};

exports.validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    category: Joi.string().required(),
    description: Joi.string().allow("")
  });
  return schema.validate(data);
};
