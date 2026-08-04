import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import authApi from "../api/auth.api";
import { setAccessToken, onAuthFailure, onTokenRefreshed } from "../api/axios";
import { getDashboardPath } from "../types/roles";
import {
    clearAuthStorage,
    getStoredAccessToken,
    hasLoggedOutMarker,
    setLoggedOutMarker,
    clearLoggedOutMarker,
} from "../services/storage.service";
import { queryClient } from "../services/queryClient";

// --- Session restore (module-level single flight) -------------------------
// Restore runs exactly once per page load. React StrictMode double-invokes
// effects in development; the shared promise prevents two simultaneous
// /auth/refresh calls, which would otherwise race the token rotation and
// fail with a spurious 401.

const performRestoreSession = async () => {
    // Do not attempt to restore a session we explicitly destroyed (logout /
    // auth failure). Prevents a logged-out user being bounced back to their
    // dashboard on the next full page load.
    if (hasLoggedOutMarker()) {
        return { authenticated: false, sessionFailed: false };
    }

    try {
        const data = await authApi.refreshToken();
        const token = data?.accessToken;

        if (!token) {
            throw new Error("No access token returned");
        }

        setAccessToken(token);

        const currentUser = await authApi.getCurrentUser();
        return { authenticated: true, token, user: currentUser ?? null };
    } catch (error) {
        const status = error?.status;
        return {
            authenticated: false,
            sessionFailed: status === 401 || status === 403,
        };
    }
};

let restoreSessionPromise = null;

const runRestoreSession = () => {
    if (!restoreSessionPromise) {
        restoreSessionPromise = performRestoreSession();
    }
    return restoreSessionPromise;
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setToken] = useState(() => getStoredAccessToken());
    const [isLoading, setIsLoading] = useState(true);

    // Single source of truth for clearing client-side auth state:
    // access token (axios + storage), user state, and the React Query cache.
    const clearAuth = useCallback(() => {
        setAccessToken(null);
        clearAuthStorage();
        queryClient.clear();
        setToken(null);
        setUser(null);
    }, []);

    // Destroy the session on the server, clear all client state, mark the
    // session as logged out, and land on /login. A full page load guarantees
    // no residual in-memory state survives, and the logged-out marker ensures
    // the session is NOT restored until the user logs in again.
    const endSession = useCallback(() => {
        clearAuth();
        setLoggedOutMarker();
        window.location.assign("/login");
    }, [clearAuth]);

    const handleAuthFailure = useCallback(() => {
        clearAuth();
        setLoggedOutMarker();
        window.location.assign("/login");
    }, [clearAuth]);

    const handleTokenRefreshed = useCallback((token) => {
        clearLoggedOutMarker();
        setToken(token);
    }, []);

    const login = useCallback(async ({ email, password }) => {
        const data = await authApi.login({ email, password });
        const token = data?.accessToken;

        if (token) {
            setAccessToken(token);
            setToken(token);
        }

        if (data?.user) {
            setUser(data.user);
        }

        clearLoggedOutMarker();

        return data;
    }, []);

    const register = useCallback(async ({ fullName, email, password, role }) => {
        const data = await authApi.register({ fullName, email, password, role });
        const token = data?.accessToken;

        if (token) {
            setAccessToken(token);
            setToken(token);
        }

        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Best effort: always clear the local session even if the server
            // call fails. If the server call failed, the logged-out marker
            // keeps the user on /login instead of re-validating the stale
            // refresh cookie.
        } finally {
            endSession();
        }
    }, [endSession]);

    const getCurrentUser = useCallback(async () => {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser ?? null);
        return currentUser;
    }, []);

    const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
        const result = await authApi.changePassword({ currentPassword, newPassword });
        endSession();
        return result;
    }, [endSession]);

    useEffect(() => {
        let active = true;

        onAuthFailure(handleAuthFailure);
        onTokenRefreshed(handleTokenRefreshed);

        runRestoreSession().then((result) => {
            if (!active) {
                return;
            }

            if (result.authenticated) {
                setToken(result.token);
                setUser(result.user);
                clearLoggedOutMarker();
            } else {
                clearAuth();
                if (result.sessionFailed) {
                    setLoggedOutMarker();
                }
            }

            setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [clearAuth, handleAuthFailure, handleTokenRefreshed]);

    const value = useMemo(
        () => ({
            user,
            accessToken,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            getCurrentUser,
            changePassword,
            dashboardPath: getDashboardPath(user?.role),
        }),
        [user, accessToken, isLoading, login, register, logout, getCurrentUser, changePassword]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
