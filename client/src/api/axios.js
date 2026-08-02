import axios from "axios";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken = null;
let authFailureHandler = null;

export const setAccessToken = (token) => {
    accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const onAuthFailure = (handler) => {
    authFailureHandler = handler;
};

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

const isAuthEndpoint = (url = "") =>
    AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

api.interceptors.request.use(
    (config) => {
        if (accessToken && !isAuthEndpoint(config.url)) {
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
