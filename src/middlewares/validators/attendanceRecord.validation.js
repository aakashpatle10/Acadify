
import Joi from 'joi';
import { AppError } from '../../utils/errors.js';

const markAttendanceSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'QR token is required',
    'any.required': 'QR token is required',
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(
        error.details.map((d) => d.message).join(', '),
        400
      )
    );
  }
  next();
};

export const markAttendanceValidator =
  validate(markAttendanceSchema);
