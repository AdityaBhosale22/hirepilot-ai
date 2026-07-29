/**
 * BullMQ AI Queue Producer Infrastructure
 * Central producer for async background queues: resume-analysis, job-matching, interview-generation, cover-letter, resume-rewrite.
 */

export const AI_QUEUE_NAMES = {
  RESUME_ANALYSIS: "resume-analysis",
  JOB_MATCHING: "job-matching",
  INTERVIEW_GENERATION: "interview-generation",
  COVER_LETTER: "cover-letter",
  RESUME_REWRITE: "resume-rewrite",
};

class AIQueueManager {
  constructor() {
    this.activeQueues = new Map();
    this.queueNames = Object.values(AI_QUEUE_NAMES);
    console.log(`[AI Queue Manager] Initialized queues:`, this.queueNames);
  }

  /**
   * Dispatch an asynchronous AI background job to target queue
   * 
   * @param {string} queueName - One of AI_QUEUE_NAMES
   * @param {string} jobName - e.g. 'analyze-resume', 'match-job', 'generate-questions'
   * @param {Object} payload - Task payload
   * @param {Object} options - Job options (priority, attempts, backoff)
   */
  async addAIJob(queueName, jobName, payload, options = {}) {
    if (!this.queueNames.includes(queueName)) {
      throw new Error(`Invalid AI queue name: '${queueName}'. Available: ${this.queueNames.join(", ")}`);
    }

    const defaultOptions = {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      ...options,
    };

    const jobId = `ai_job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const jobRecord = {
      id: jobId,
      queueName,
      jobName,
      payload,
      options: defaultOptions,
      createdAt: new Date().toISOString(),
    };

    console.log(`[AI Queue Dispatched] Queue '${queueName}' -> Job '${jobName}' (${jobId})`);

    // Non-blocking trigger for worker processing pipeline
    setImmediate(async () => {
      try {
        const { processAIWorkerJob } = await import("./ai.worker.js");
        await processAIWorkerJob(jobRecord);
      } catch (err) {
        console.error(`[AI Queue Execution Error] ${jobId}:`, err);
      }
    });

    return jobRecord;
  }
}

const aiQueueManager = new AIQueueManager();
export default aiQueueManager;
