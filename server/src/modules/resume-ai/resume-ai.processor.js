/**
 * @file resume-ai.processor.js
 * @description BullMQ processor logic for the AI Worker
 */
const resumeAiRepository = require('./resume-ai.repository');
const pdfExtractor = require('../../ai/pdf.extractor');
const promptManager = require('../../ai/prompt.manager');
const geminiService = require('../../ai/gemini.service');
const responseParser = require('../../ai/response.parser');
const aiLogger = require('../../ai/ai.logger');
const notificationService = require('../notification/notification.service');
const { RESUME_AI_EVENTS } = require('./resume-ai.events');

async function processResumeAnalysis(job) {
  const { resumeId, userId, fileUrl } = job.data;
  aiLogger.info(`Starting resume analysis for ID: ${resumeId}`);

  try {
    // 1. Mark as Processing
    await resumeAiRepository.updateAnalysisStatus(resumeId, 'PROCESSING', {
      analysisStartedAt: new Date()
    });
    notificationService.emitToUser(userId, RESUME_AI_EVENTS.ANALYSIS_STARTED, { resumeId });

    // 2. Extract Text from PDF
    const parsedText = await pdfExtractor.extract(fileUrl);
    if (!parsedText || parsedText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from the PDF.');
    }

    // 3. Build Prompt from Prompt Templates
    const prompt = promptManager.build('RESUME_ANALYSIS_TEMPLATE', {
      resumeText: parsedText
    });

    // 4. Generate AI Response (Gemini)
    const geminiResponse = await geminiService.generate(prompt, {
      temperature: 0.2, // Low temp for highly structured, analytical output
      maxOutputTokens: 2048
    });

    // 5. Parse and Validate JSON Response
    const reportData = responseParser.parseJSON(geminiResponse, {
      requiredKeys: [
        'overallAtsScore', 'professionalSummary', 'strengths', 
        'weaknesses', 'missingSkills', 'industryFit'
      ]
    });

    // 6. Save to Database
    await resumeAiRepository.saveAnalysisReport(resumeId, reportData, parsedText);

    // 7. Notify Success
    notificationService.emitToUser(userId, RESUME_AI_EVENTS.ANALYSIS_COMPLETED, { resumeId });
    aiLogger.info(`Successfully completed resume analysis for ID: ${resumeId}`);

    return { success: true, resumeId };

  } catch (error) {
    aiLogger.error(`Failed resume analysis for ID: ${resumeId}`, error);
    
    // Fallback: Mark as Failed
    await resumeAiRepository.updateAnalysisStatus(resumeId, 'FAILED', {
      analysisCompletedAt: new Date() // Record when it failed
    });
    
    // Notify Failure
    notificationService.emitToUser(userId, RESUME_AI_EVENTS.ANALYSIS_FAILED, { 
      resumeId, 
      error: error.message 
    });

    throw error; // Let BullMQ Retry Strategy handle it based on attempt count
  }
}

module.exports = { processResumeAnalysis };