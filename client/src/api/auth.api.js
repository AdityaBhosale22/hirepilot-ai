import api from "./axios";

const extractData = (response) => response?.data?.data ?? response?.data;

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

const handleError = (error) => {
    const message = getErrorMessage(error);
    const normalized = new Error(message);
    normalized.status = error?.response?.status;
    throw normalized;
};

export async function login({ email, password }) {
    try {
        const response = await api.post("/auth/login", { email, password });
        return extractData(response);
    } catch (error) {
        handleError(error);
    }
}

export async function register({ fullName, email, password, role }) {
    try {
        const response = await api.post("/auth/register", {
            fullName,
            email,
            password,
            role,
        });
        return extractData(response);
    } catch (error) {
        handleError(error);
    }
}

export async function logout() {
    try {
        const response = await api.post("/auth/logout");
        return extractData(response);
    } catch (error) {
        handleError(error);
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get("/auth/me");
        const payload = extractData(response);
        return payload?.user ?? payload;
    } catch (error) {
        handleError(error);
    }
}

export async function refreshToken() {
    try {
        const response = await api.post("/auth/refresh");
        return extractData(response);
    } catch (error) {
        handleError(error);
    }
}

export { getErrorMessage };

export default { login, register, logout, getCurrentUser, refreshToken };
