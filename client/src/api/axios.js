import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getStoredAccessToken, setStoredAccessToken } from "../services/storage.service";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken = getStoredAccessToken();
let authFailureHandler = null;

export const setAccessToken = (token) => {
    accessToken = token || null;
    setStoredAccessToken(accessToken);
};

export const getAccessToken = () => accessToken;

export const onAuthFailure = (handler) => {
    authFailureHandler = handler;
};

// Endpoints that must NOT receive the access token (cookie-based or public).
const AUTH_NO_TOKEN_ENDPOINTS = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/resend-verification",
];

// Auth endpoints that must NOT trigger the 401 → refresh flow (a 401 here is terminal).
const AUTH_ENDPOINTS = [...AUTH_NO_TOKEN_ENDPOINTS, "/auth/logout", "/auth/change-password"];

const isNoTokenEndpoint = (url = "") =>
    AUTH_NO_TOKEN_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const isAuthEndpoint = (url = "") =>
    AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

api.interceptors.request.use(
    (config) => {
        if (accessToken && !isNoTokenEndpoint(config.url)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) =>
        token ? resolve(token) : reject(error)
    );
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthEndpoint(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post("/auth/refresh");
            const newToken = data?.data?.accessToken || data?.accessToken;

            if (!newToken) {
                throw new Error("No access token returned");
            }

            setAccessToken(newToken);
            processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            setAccessToken(null);
            if (authFailureHandler) {
                authFailureHandler();
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
