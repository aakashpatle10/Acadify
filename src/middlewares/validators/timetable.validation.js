// middlewares/validators/timetable.validation.js
import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const timetableImportSchema = Joi.array()
  .items(
    Joi.object({
      className: Joi.string().required().messages({
        "string.empty": "Class name is required",
        "any.required": "Class name is required"
      }),

      day: Joi.string()
        .valid(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        )
        .required()
        .messages({
          "any.only": "Day must be a valid weekday (Monday to Saturday)",
          "any.required": "Day is required",
          "string.empty": "Day is required"
        }),

      subject: Joi.string().required().messages({
        "string.empty": "Subject is required",
        "any.required": "Subject is required"
      }),

      teacherCode: Joi.string().required().messages({
        "string.empty": "Teacher code is required",
        "any.required": "Teacher code is required"
      }),

      startTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
          "string.pattern.base": "Start time must be in format HH:MM",
          "any.required": "Start time is required",
          "string.empty": "Start time is required"
        }),

      endTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
          "string.pattern.base": "End time must be in format HH:MM",
          "any.required": "End time is required",
          "string.empty": "End time is required"
        })
    })
  )
  .required()
  .messages({
    "array.base": "Input must be an array of timetable records",
    "any.required": "Timetable JSON is required"
  });


// 🔥 SAME VALIDATE FUNCTION AS YOUR CODE
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  next();
};

// EXPORT
export const importTimetableValidator = validate(timetableImportSchema);
