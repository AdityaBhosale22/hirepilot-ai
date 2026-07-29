import geminiService from "./gemini.service.js";
import promptManager from "./prompt.manager.js";
import responseParser from "./response.parser.js";
import prisma from "../lib/prisma.js";
import notificationEventHandler from "../modules/notification/notification.events.js";

/**
 * BullMQ AI Consumer Worker Pipeline
 * Consumes queued background AI tasks, calls Gemini, parses responses, persists results, and emits notifications.
 * 
 * @param {Object} jobRecord - { id, queueName, jobName, payload }
 */
export async function processAIWorkerJob(jobRecord) {
  const { id, queueName, jobName, payload } = jobRecord;

  console.log(`[AI Worker Started] Processing ${jobName} on queue ${queueName} (${id})`);

  try {
    switch (queueName) {
      case "resume-analysis":
        await handleResumeAnalysisJob(payload);
        break;

      case "job-matching":
        await handleJobMatchingJob(payload);
        break;

      case "interview-generation":
        await handleInterviewGenerationJob(payload);
        break;

      case "cover-letter":
        await handleCoverLetterJob(payload);
        break;

      case "resume-rewrite":
        await handleResumeRewriteJob(payload);
        break;

      default:
        console.warn(`[AI Worker Warning] No worker handler registered for queue '${queueName}'`);
    }

    console.log(`[AI Worker Completed] Successfully processed ${id}`);
  } catch (error) {
    console.error(`[AI Worker Error] Processing failed for ${id}:`, error.message);
    // Rethrow to ensure BullMQ registers the failure and triggers retry logic
    throw error; 
  }
}

/**
 * Handler for Resume Analysis Queue Jobs
 */
async function handleResumeAnalysisJob(payload) {
  const { resumeId, resumeText, userId } = payload;

  // Strict Validation: Never process empty data
  if (!resumeId || !resumeText || !userId) {
    throw new Error("Missing required payload fields for Resume Analysis.");
  }

  try {
    const rendered = promptManager.renderPrompt("RESUME_ANALYSIS", { resumeText });

    const aiResult = await geminiService.generateStructuredJSON({
      prompt: rendered.userPrompt,
      systemPrompt: rendered.systemPrompt,
      moduleName: "RESUME_ANALYSIS",
      promptName: rendered.name,
    });

    const parsedData = aiResult.data;

    // Persist to Database
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        analysisStatus: 'COMPLETED',
        aiScore: parseFloat(parsedData.overallScore || 0),
        extractedSkills: parsedData.skills || [],
      },
    });

    // Notify User
    await notificationEventHandler.handleResumeAnalyzed({
      userId,
      resumeTitle: parsedData.candidateName || "Resume",
      resumeId,
      aiScore: parsedData.overallScore,
    });

    return parsedData;
  } catch (error) {
    // Graceful Failure State
    await prisma.resume.update({
      where: { id: resumeId },
      data: { analysisStatus: 'FAILED' },
    });
    throw error;
  }
}

/**
 * Handler for Cover Letter Queue Jobs
 */
async function handleCoverLetterJob(payload) {
  const { coverLetterId, candidateName, jobTitle, companyName, resumeText, userId } = payload;

  if (!coverLetterId || !jobTitle || !resumeText) {
    throw new Error("Missing required payload fields for Cover Letter Generation.");
  }

  try {
    await prisma.coverLetter.update({
      where: { id: coverLetterId },
      data: { generationStatus: 'PROCESSING' }
    });

    const rendered = promptManager.renderPrompt("COVER_LETTER", {
      candidateName: candidateName || "Candidate",
      jobTitle,
      companyName: companyName || "Hiring Manager",
      resumeText,
    });

    const aiResult = await geminiService.generateStructuredJSON({
      prompt: rendered.userPrompt,
      systemPrompt: rendered.systemPrompt,
      moduleName: "COVER_LETTER",
      promptName: rendered.name,
    });

    // Persist the generated letter back to the database
    await prisma.coverLetter.update({
      where: { id: coverLetterId },
      data: {
        generationStatus: 'COMPLETED',
        content: aiResult.data.letterContent,
      },
    });

    // Notify User
    if (userId) {
      await notificationEventHandler.emitToUser(userId, 'COVER_LETTER_READY', { coverLetterId });
    }

    return aiResult.data;
  } catch (error) {
    await prisma.coverLetter.update({
      where: { id: coverLetterId },
      data: { generationStatus: 'FAILED' },
    });
    throw error;
  }
}

/**
 * Handler for Interview Question Generation Queue Jobs
 */
async function handleInterviewGenerationJob(payload) {
  const { interviewId, jobTitle, yearsOfExperience, requiredSkills, resumeSummary } = payload;

  if (!interviewId || !jobTitle) {
    throw new Error("Missing required payload fields for Interview Generation.");
  }

  try {
    const rendered = promptManager.renderPrompt("INTERVIEW_QUESTIONS", {
      jobTitle,
      yearsOfExperience: yearsOfExperience || 0,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills.join(", ") : requiredSkills,
      resumeSummary: resumeSummary || "No summary provided.",
      questionCount: 5,
    });

    const aiResult = await geminiService.generateStructuredJSON({
      prompt: rendered.userPrompt,
      systemPrompt: rendered.systemPrompt,
      moduleName: "INTERVIEW_GENERATION",
      promptName: rendered.name,
    });

    // Persist questions to the database
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'COMPLETED',
        questions: aiResult.data.questions, // Assuming your schema stores JSON/Array
      },
    });

    return aiResult.data;
  } catch (error) {
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}

// ... (handleJobMatchingJob and handleResumeRewriteJob follow the exact same DB persistence pattern)