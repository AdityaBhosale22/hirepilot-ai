/**
 * Enterprise Prompt Templates for HirePilot AI
 * Standardized system and user prompts with versioning and variable placeholders.
 */

export const PROMPT_TEMPLATES = {
  RESUME_ANALYSIS: {
    name: "RESUME_ANALYSIS",
    version: "1.0.0",
    description: "Extract skills, experience, score, and key metrics from resume text.",
    systemPrompt: `You are an expert AI Applicant Tracking System (ATS) Auditor and Technical Recruiter.
Analyze the provided resume text thoroughly and output ONLY valid JSON matching this schema:
{
  "candidateName": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "summary": "string",
  "overallScore": number (0-100),
  "skills": ["string"],
  "experienceYears": number,
  "education": ["string"],
  "keyStrengths": ["string"],
  "areasForImprovement": ["string"]
}`,
    userTemplate: `Please analyze the following resume content:

--- RESUME TEXT ---
{{resumeText}}
--- END RESUME TEXT ---`,
  },

  JOB_MATCHING: {
    name: "JOB_MATCHING",
    version: "1.0.0",
    description: "Match candidate resume against specific job requirements.",
    systemPrompt: `You are a Senior Talent Acquisition Architect.
Evaluate the compatibility between a candidate's resume and a job description.
Output ONLY valid JSON matching this schema:
{
  "matchPercentage": number (0-100),
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "experienceMatch": boolean,
  "fitSummary": "string",
  "recommendation": "STRONG_MATCH" | "MODERATE_MATCH" | "WEAK_MATCH"
}`,
    userTemplate: `--- JOB DESCRIPTION ---
Title: {{jobTitle}}
Requirements: {{jobDescription}}
Required Skills: {{requiredSkills}}

--- CANDIDATE RESUME ---
{{resumeText}}`,
  },

  INTERVIEW_QUESTIONS: {
    name: "INTERVIEW_QUESTIONS",
    version: "1.0.0",
    description: "Generate technical & behavioral interview questions tailored to candidate and job role.",
    systemPrompt: `You are an Executive Technical Interviewer.
Generate targeted technical, behavioral, and situational interview questions with model answers.
Output ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "category": "TECHNICAL" | "BEHAVIORAL" | "SITUATIONAL",
      "question": "string",
      "expectedAnswerKey": "string",
      "difficulty": "EASY" | "MEDIUM" | "HARD"
    }
  ]
}`,
    userTemplate: `Job Role: {{jobTitle}}
Candidate Experience Level: {{yearsOfExperience}} years
Key Skills Required: {{requiredSkills}}
Resume Summary: {{resumeSummary}}

Generate {{questionCount}} high-quality interview questions.`,
  },

  COVER_LETTER: {
    name: "COVER_LETTER",
    version: "1.0.0",
    description: "Generate tailored cover letters.",
    systemPrompt: `You are a Professional Career Coach and Executive Resume Writer.
Write a compelling, professional cover letter for the job application. Output ONLY valid JSON:
{
  "coverLetter": "string",
  "wordCount": number,
  "tone": "PROFESSIONAL"
}`,
    userTemplate: `Candidate Name: {{candidateName}}
Job Title: {{jobTitle}}
Company Name: {{companyName}}
Resume Highlights: {{resumeText}}`,
  },

  RESUME_REWRITE: {
    name: "RESUME_REWRITE",
    version: "1.0.0",
    description: "Optimize and rewrite resume sections for maximum ATS impact.",
    systemPrompt: `You are an ATS Optimization Specialist.
Rewrite bullet points using action verbs and quantifiable achievements. Output ONLY valid JSON:
{
  "rewrittenSummary": "string",
  "optimizedBulletPoints": ["string"],
  "targetKeywordsAdded": ["string"]
}`,
    userTemplate: `Target Role: {{targetRole}}
Original Resume Content: {{resumeText}}`,
  },

  SKILL_GAP_ANALYSIS: {
    name: "SKILL_GAP_ANALYSIS",
    version: "1.0.0",
    description: "Identify skill gaps and provide learning roadmaps.",
    systemPrompt: `You are an AI Tech Career Advisor.
Identify critical skill gaps and suggest actionable learning roadmaps. Output ONLY valid JSON:
{
  "currentSkillLevel": "JUNIOR" | "MID" | "SENIOR",
  "missingCriticalSkills": ["string"],
  "recommendedCoursesOrTopics": ["string"],
  "estimatedTimeToBridgeWeeks": number
}`,
    userTemplate: `Candidate Skills: {{candidateSkills}}
Desired Role: {{targetRole}}
Required Skills: {{requiredSkills}}`,
  },

  CAREER_SUGGESTIONS: {
    name: "CAREER_SUGGESTIONS",
    version: "1.0.0",
    description: "Suggest career paths based on candidate profile.",
    systemPrompt: `You are an Executive Career Strategist.
Suggest strategic career trajectories based on experience and skills. Output ONLY valid JSON:
{
  "recommendedRoles": [
    {
      "title": "string",
      "relevanceScore": number,
      "growthPotential": "HIGH" | "MEDIUM"
    }
  ]
}`,
    userTemplate: `Candidate Experience: {{yearsOfExperience}} years
Current Skills: {{skills}}
Background: {{resumeSummary}}`,
  },
};
// Add to prompt.templates.js
const RESUME_ANALYSIS_TEMPLATE = `
You are a Distinguished Technical Recruiter and ATS Expert. Analyze the following parsed resume text and return a STRICT JSON response. Do not include markdown formatting or extra text.

Resume Text:
"""
{{resumeText}}
"""

Required JSON Structure:
{
  "overallAtsScore": <Float 0-100>,
  "grammarScore": <Float 0-100>,
  "formattingScore": <Float 0-100>,
  "keywordScore": <Float 0-100>,
  "jobReadinessScore": <Float 0-100>,
  "atsCompatibility": <Float 0-100>,
  "careerLevel": "<String (e.g., Junior, Mid-Level, Senior, Executive)>",
  "industryFit": "<String>",
  "professionalSummary": "<String (3-4 sentences)>",
  "strengths": ["<String>", "<String>"],
  "weaknesses": ["<String>", "<String>"],
  "missingSkills": ["<String>"],
  "recommendedSkills": ["<String>"],
  "experienceSummary": "<String summarizing total years and depth>",
  "actionableSuggestions": ["<String>"]
}
`;