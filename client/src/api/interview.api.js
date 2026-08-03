import api from "./axios";
import { getErrorMessage } from "./auth.api";

const extractData = (response) => response?.data?.data ?? response?.data;

const handleError = (error) => {
    const message = getErrorMessage(error);
    const normalized = new Error(message);
    normalized.status = error?.response?.status;
    throw normalized;
};

export async function getInterviews(params = {}) {
    try {
        const response = await api.get("/interviews", { params });
        const data = extractData(response);
        return {
            interviews: data?.interviews ?? [],
            pagination: data?.pagination ?? {},
        };
    } catch (error) {
        handleError(error);
    }
}

export async function getInterviewById(interviewId) {
    try {
        const response = await api.get(`/interviews/${interviewId}`);
        const data = extractData(response);
        return data?.interview ?? null;
    } catch (error) {
        handleError(error);
    }
}

export default { getInterviews, getInterviewById };
