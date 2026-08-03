import api from "./axios";
import { getErrorMessage } from "./auth.api";

const extractData = (response) => response?.data?.data ?? response?.data;

const handleError = (error) => {
    const message = getErrorMessage(error);
    const normalized = new Error(message);
    normalized.status = error?.response?.status;
    throw normalized;
};

export async function applyToJob({ jobId, resumeId }) {
    try {
        const response = await api.post("/applications", { jobId, resumeId });
        return extractData(response);
    } catch (error) {
        handleError(error);
    }
}

export async function getMyApplications(params = {}) {
    try {
        const response = await api.get("/applications/me", { params });
        const data = extractData(response);
        return {
            applications: data?.applications ?? [],
            pagination: data?.pagination ?? {},
        };
    } catch (error) {
        handleError(error);
    }
}

export default { applyToJob, getMyApplications };
