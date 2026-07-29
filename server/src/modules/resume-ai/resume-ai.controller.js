/**
 * @file resume-ai.controller.js
 */
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const resumeAiService = require('./resume-ai.service');

const queueAnalysis = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.id; // Assumes auth.middleware attaches req.user

  const result = await resumeAiService.queueAnalysis(resumeId, userId);

  return res.status(202).json(
    new ApiResponse(202, result, 'Resume analysis has been queued successfully.')
  );
});

const getAnalysisStatus = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.id;

  const result = await resumeAiService.getAnalysisStatus(resumeId, userId);

  return res.status(200).json(
    new ApiResponse(200, result, 'Analysis status retrieved successfully.')
  );
});

const getAnalysisReport = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.id;

  const result = await resumeAiService.getAnalysisReport(resumeId, userId);

  return res.status(200).json(
    new ApiResponse(200, result, 'Analysis report retrieved successfully.')
  );
});

module.exports = {
  queueAnalysis,
  getAnalysisStatus,
  getAnalysisReport,
};