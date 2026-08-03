export const USER_ROLE = {
    CANDIDATE: "CANDIDATE",
    RECRUITER: "RECRUITER",
    ADMIN: "ADMIN",
};

export const THEME = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
};

export const QUERY_KEYS = {
    DASHBOARD: ["dashboard"],
    PUBLIC_JOBS: ["publicJobs"],
    JOB_DETAIL: "jobDetail",
    MY_APPLICATIONS: ["myApplications"],
    RESUMES: ["resumes"],
    RESUME_DETAIL: "resumeDetail",
    RESUME_ANALYSIS: "resumeAnalysis",
    MY_MATCHES: ["myMatches"],
    MATCH_REPORT: "matchReport",
    INTERVIEWS: ["interviews"],
    NOTIFICATIONS: ["notifications"],
    UNREAD_COUNT: ["unreadCount"],
};

export const DEFAULT_QUERY_OPTIONS = {
    retry: 1,
    refetchOnWindowFocus: false,
};