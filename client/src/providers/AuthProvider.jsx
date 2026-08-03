import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import authApi from "../api/auth.api";
import { setAccessToken, onAuthFailure } from "../api/axios";
import { getDashboardPath } from "../types/roles";
import { clearAuthStorage, getStoredAccessToken } from "../services/storage.service";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setToken] = useState(() => getStoredAccessToken());
    const [isLoading, setIsLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setAccessToken(null);
        clearAuthStorage();
        setToken(null);
        setUser(null);
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
            // Best effort: always clear local session even if the server call fails.
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    const getCurrentUser = useCallback(async () => {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser ?? null);
        return currentUser;
    }, []);

    const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
        const result = await authApi.changePassword({ currentPassword, newPassword });
        clearAuth();
        return result;
    }, [clearAuth]);

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            try {
                const data = await authApi.refreshToken();
                const token = data?.accessToken;

                if (!token) {
                    throw new Error("No access token returned");
                }

                setAccessToken(token);
                if (active) {
                    setToken(token);
                }

                const currentUser = await authApi.getCurrentUser();
                if (active) {
                    setUser(currentUser ?? null);
                }
            } catch {
                if (active) {
                    clearAuth();
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        const handleAuthFailure = () => {
            if (active) {
                clearAuth();
            }
            window.location.assign("/login");
        };

        onAuthFailure(handleAuthFailure);
        restoreSession();

        return () => {
            active = false;
        };
    }, [clearAuth]);

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
