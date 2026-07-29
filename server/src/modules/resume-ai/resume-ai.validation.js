/**
 * @file resume-ai.validation.js
 */
const Joi = require('joi');

const resumeIdParam = Joi.object({
  resumeId: Joi.string().uuid().required().messages({
    'string.empty': 'Resume ID is required',
    'string.guid': 'Resume ID must be a valid UUID',
  }),
});

module.exports = {
  resumeIdParam,
};