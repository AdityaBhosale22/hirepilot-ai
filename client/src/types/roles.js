export const ROLES = {
    CANDIDATE: "CANDIDATE",
    RECRUITER: "RECRUITER",
};

export const ROLE_DASHBOARD_PATHS = {
    [ROLES.CANDIDATE]: "/candidate/dashboard",
    [ROLES.RECRUITER]: "/recruiter/dashboard",
};

export const getDashboardPath = (role) =>
    ROLE_DASHBOARD_PATHS[role] || "/";
