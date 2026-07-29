/**
 * @file resume-ai.repository.js
 */
const prisma = require('../../lib/prisma');

class ResumeAiRepository {
  async findResumeByIdAndUser(resumeId, userId) {
    return prisma.resume.findFirst({
      where: { id: resumeId, userId },
      select: {
        id: true,
        fileUrl: true,
        analysisStatus: true,
      },
    });
  }

  async updateAnalysisStatus(resumeId, status, additionalData = {}) {
    return prisma.resume.update({
      where: { id: resumeId },
      data: {
        analysisStatus: status,
        ...additionalData,
      },
    });
  }

  async saveAnalysisReport(resumeId, reportData, parsedText) {
    return prisma.resume.update({
      where: { id: resumeId },
      data: {
        analysisStatus: 'COMPLETED',
        analysisCompletedAt: new Date(),
        lastAnalyzedAt: new Date(),
        parsedText,
        aiScore: reportData.overallAtsScore,
        summary: reportData.professionalSummary,
        strengths: reportData.strengths,
        weaknesses: reportData.weaknesses,
        missingSkills: reportData.missingSkills,
        recommendedSkills: reportData.recommendedSkills,
        experienceLevel: reportData.experienceSummary,
        atsCompatibility: reportData.atsCompatibility,
        grammarScore: reportData.grammarScore,
        formatScore: reportData.formattingScore,
        keywordScore: reportData.keywordScore,
        jobReadinessScore: reportData.jobReadinessScore,
        careerLevel: reportData.careerLevel,
        industryFit: reportData.industryFit,
      },
    });
  }

  async getAnalysisReport(resumeId, userId) {
    return prisma.resume.findFirst({
      where: { id: resumeId, userId },
      select: {
        id: true,
        analysisStatus: true,
        lastAnalyzedAt: true,
        aiScore: true,
        summary: true,
        strengths: true,
        weaknesses: true,
        missingSkills: true,
        recommendedSkills: true,
        experienceLevel: true,
        atsCompatibility: true,
        grammarScore: true,
        formatScore: true,
        keywordScore: true,
        jobReadinessScore: true,
        careerLevel: true,
        industryFit: true,
      }
    });
  }
}

module.exports = new ResumeAiRepository();