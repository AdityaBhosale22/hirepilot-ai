import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import authApi from "../api/auth.api";
import { setAccessToken, onAuthFailure } from "../api/axios";
import { getDashboardPath } from "../types/roles";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setAccessToken(null);
        setToken(null);
        setUser(null);
    }, []);

    const login = useCallback(async ({ email, password }) => {
        const data = await authApi.login({ email, password });
        const token = data?.accessToken;

        if (token) {
            setAccessToken(token);
        }
        setToken(token || null);
        setUser(data?.user ?? null);

        return data?.user;
    }, []);

    const register = useCallback(
        async ({ fullName, email, password, role }) => {
            await authApi.register({ fullName, email, password, role });

            const data = await authApi.login({ email, password });
            const token = data?.accessToken;

            if (token) {
                setAccessToken(token);
            }
            setToken(token || null);
            setUser(data?.user ?? null);

            return data?.user;
        },
        []
    );

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
            dashboardPath: getDashboardPath(user?.role),
        }),
        [user, accessToken, isLoading, login, register, logout, getCurrentUser]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
