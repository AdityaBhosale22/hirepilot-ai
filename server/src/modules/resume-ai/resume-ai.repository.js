/**
 * @file resume-ai.repository.js
 */
import prisma from "../../lib/prisma.js";

class ResumeAiRepository {
  /**
   * Find a resume owned by the given candidate user.
   * Resume records belong to a candidate profile, so ownership is resolved through the user's candidate profile.
   * @param {string} resumeId
   * @param {string} userId
   */
  async findResumeByIdAndUser(resumeId, userId) {
    return prisma.resume.findFirst({
      where: {
        id: resumeId,
        candidateProfile: {
          userId,
        },
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        parsedText: true,
        analysisStatus: true,
      },
    });
  }

  async findResumeById(resumeId) {
    return prisma.resume.findUnique({
      where: { id: resumeId },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        parsedText: true,
        analysisStatus: true,
      },
    });
  }

  /**
   * Atomically claim a resume for analysis by flipping its status to QUEUED.
   * Returns the updated record, or null when the resume is missing, not owned by
   * the user, or already QUEUED/PROCESSING (in-progress).
   */
  async claimForAnalysis(resumeId, userId) {
    const result = await prisma.resume.updateMany({
      where: {
        id: resumeId,
        candidateProfile: { is: { userId } },
        analysisStatus: { notIn: ["QUEUED", "PROCESSING"] },
      },
      data: { analysisStatus: "QUEUED" },
    });

    if (result.count !== 1) {
      const resume = await this.findResumeByIdAndUser(resumeId, userId);
      return resume && (resume.analysisStatus === "QUEUED" || resume.analysisStatus === "PROCESSING")
        ? resume
        : null;
    }

    return prisma.resume.findUnique({ where: { id: resumeId } });
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
        analysisStatus: "COMPLETED",
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
        extractedSkills: reportData.skills,
      },
    });
  }

  async getAnalysisReport(resumeId, userId) {
    return prisma.resume.findFirst({
      where: {
        id: resumeId,
        candidateProfile: {
          userId,
        },
      },
      select: {
        id: true,
        analysisStatus: true,
        analysisStartedAt: true,
        analysisCompletedAt: true,
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
      },
    });
  }
}

export default new ResumeAiRepository();
