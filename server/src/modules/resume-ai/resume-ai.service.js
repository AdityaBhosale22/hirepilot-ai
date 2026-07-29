/**
 * @file resume-ai.service.js
 */
const resumeAiRepository = require('./resume-ai.repository');
const ApiError = require('../../utils/ApiError');
const { aiQueue } = require('../../ai/ai.queue');
const { RESUME_AI_EVENTS } = require('./resume-ai.events');
// Assume notification module exists per architecture
const notificationService = require('../notification/notification.service'); 

class ResumeAiService {
  async queueAnalysis(resumeId, userId) {
    // 1. Verify ownership & existence
    const resume = await resumeAiRepository.findResumeByIdAndUser(resumeId, userId);
    if (!resume) {
      throw new ApiError(404, 'Resume not found or unauthorized');
    }

    // 2. Idempotency Check (Prevent duplicate AI processing)
    if (['QUEUED', 'PROCESSING'].includes(resume.analysisStatus)) {
      throw new ApiError(409, 'Resume is already queued or being processed');
    }

    // 3. Update DB Status
    await resumeAiRepository.updateAnalysisStatus(resumeId, 'QUEUED');

    // 4. Enqueue Job in BullMQ
    await aiQueue.add(
      'resume-analysis',
      { resumeId, userId, fileUrl: resume.fileUrl },
      { 
        attempts: 3, 
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false
      }
    );

    // 5. Notify Client via WebSockets
    notificationService.emitToUser(userId, RESUME_AI_EVENTS.ANALYSIS_QUEUED, { resumeId });

    return { resumeId, status: 'QUEUED' };
  }

  async getAnalysisStatus(resumeId, userId) {
    const resume = await resumeAiRepository.findResumeByIdAndUser(resumeId, userId);
    if (!resume) {
      throw new ApiError(404, 'Resume not found or unauthorized');
    }
    return { resumeId: resume.id, status: resume.analysisStatus };
  }

  async getAnalysisReport(resumeId, userId) {
    const report = await resumeAiRepository.getAnalysisReport(resumeId, userId);
    if (!report) {
      throw new ApiError(404, 'Resume not found or unauthorized');
    }
    if (report.analysisStatus !== 'COMPLETED') {
      throw new ApiError(400, `Report not available. Current status: ${report.analysisStatus}`);
    }
    return report;
  }
}

module.exports = new ResumeAiService();