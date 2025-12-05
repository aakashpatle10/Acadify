// middlewares/validators/student.validator.js
import Joi from 'joi';
import { AppError } from '../../utils/errors.js';

const loginSchema = Joi.object({
    enrollmentNumber: Joi.string().required().messages({
        'any.required': 'Enrollment number is required',
        'string.empty': 'Enrollment number is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        'string.empty': 'Password is required'
    })
});

const resetPasswordSchema = Joi.object({
    enrollmentNumber: Joi.string().required().messages({
        'any.required': 'Enrollment number is required',
        'string.empty': 'Enrollment number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'A valid email address is required',
        'any.required': 'Email is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'New password is required'
    })
});

const createStudentSchema = Joi.object({
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
    enrollmentNumber: Joi.string().required().trim().messages({
        'string.empty': 'Enrollment number is required',
        'any.required': 'Enrollment number is required'
    }),
    department: Joi.string().required().trim().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required'
    }),
    course: Joi.string().required().trim().messages({
        'string.empty': 'Course is required',
        'any.required': 'Course is required'
    }),
    year: Joi.number().required().messages({
        'number.base': 'Year must be a number',
        'any.required': 'Year is required'
    }),
    semester: Joi.number().required().messages({
        'number.base': 'Semester must be a number',
        'any.required': 'Semester is required'
    }),
    phoneNumber: Joi.string().required().pattern(/^[0-9]{10}$/).messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
        'string.pattern.base': 'Phone number must be 10 digits'
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
export const resetPasswordValidator = validate(resetPasswordSchema);
export const createStudentValidator = validate(createStudentSchema);
