/**
 * @file resume-ai.routes.js
 */
const express = require('express');
const router = express.Router();

const resumeAiController = require('./resume-ai.controller');
const validate = require('../../middleware/validate.middleware');
const { resumeIdParam } = require('./resume-ai.validation');
const { verifyJWT, authorizeRoles } = require('../../middleware/auth.middleware');

// Apply authentication to all routes in this module
router.use(verifyJWT);
router.use(authorizeRoles('USER'));

router.post(
  '/:resumeId/analyze',
  validate(resumeIdParam, 'params'),
  resumeAiController.queueAnalysis
);

router.get(
  '/:resumeId/status',
  validate(resumeIdParam, 'params'),
  resumeAiController.getAnalysisStatus
);

router.get(
  '/:resumeId/report',
  validate(resumeIdParam, 'params'),
  resumeAiController.getAnalysisReport
);

module.exports = router;