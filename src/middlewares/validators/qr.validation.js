// middlewares/validators/qr.validation.js
import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const generateQrSchema = Joi.object({
  timetableId: Joi.string().required().messages({
    "string.empty": "Timetable ID is required",
    "any.required": "Timetable ID is required",
  }),
  // optional: agar tum custom seconds bhejna chaho
  expiresInSeconds: Joi.number().integer().min(5).max(120).messages({
    "number.base": "expiresInSeconds must be a number",
    "number.min": "expiresInSeconds must be at least 5 seconds",
    "number.max": "expiresInSeconds cannot be more than 120 seconds",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(
        error.details.map((d) => d.message).join(", "),
        400
      )
    );
  }
  next();
};

export const generateQrValidator = validate(generateQrSchema);
