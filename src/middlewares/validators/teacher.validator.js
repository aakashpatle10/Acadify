// middlewares/validators/teacher.validator.js
import Joi from 'joi';
import { AppError } from '../../utils/errors.js';

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'A valid email address is required',
        'any.required': 'Email is required',
        'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        'string.empty': 'Password is required'
    })
});

const createTeacherSchema = Joi.object({
    email: Joi.string().email().required().trim().messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().min(6).messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters long'
    }),
    firstName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().trim().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    phoneNumber: Joi.string().required().pattern(/^[0-9]{10}$/).messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
        'string.pattern.base': 'Phone number must be 10 digits'
    }),
    department: Joi.string().required().trim().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required'
    }),
    designation: Joi.string().required().trim().messages({
        'string.empty': 'Designation is required',
        'any.required': 'Designation is required'
    }),
    employeeId: Joi.string().required().trim().messages({
        'string.empty': 'Employee ID is required',
        'any.required': 'Employee ID is required'
    })
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(
            new AppError(error.details.map((d) => d.message).join(', '), 400)
        );
    }
    next();
};

export const loginValidator = validate(loginSchema);
export const createTeacherValidator = validate(createTeacherSchema);
