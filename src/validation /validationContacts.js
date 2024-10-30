import Joi from 'joi';
import { contactTypeList, phoneNumberRegexp } from '../constants/index.js';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).pattern(phoneNumberRegexp).required().messages({
        'string.pattern.base': 'Phone number must be in the format +380XXXXXXXXX',
    }),
    email: Joi.string().email().min(3).max(30),
    isFavorite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList).min(3).max(20).required(),
});


export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20).pattern(phoneNumberRegexp).messages({
        'string.pattern.base': 'Phone number must be in the format +380XXXXXXXXX',
    }),
    email: Joi.string().email().min(3).max(20),
    isFavorite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList).min(3).max(20),
});
