import Joi from "joi";

export const idSchema = Joi.object({
  employeeId: Joi.string().alphanum().min(6).required(),
});

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().length(10).required(),
  status: Joi.boolean().required(),
  department: Joi.string().required(),
  address: Joi.object({
    state: Joi.string().required(),
    city: Joi.string().required(),
  }).required(),
});



export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  phone: Joi.string().length(10).optional(),
  status: Joi.boolean().optional(),
  department: Joi.string().optional(),
  address: Joi.object({
    state: Joi.string().optional(),
    city: Joi.string().optional(),
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});