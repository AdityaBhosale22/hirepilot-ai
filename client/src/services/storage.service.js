const ACCESS_TOKEN_KEY = "hirepilot.auth.accessToken";

const hasWindow = typeof window !== "undefined";

export const getStoredAccessToken = () => {
	if (!hasWindow) return null;

	try {
		return window.localStorage.getItem(ACCESS_TOKEN_KEY);
	} catch {
		return null;
	}
};

export const setStoredAccessToken = (token) => {
	if (!hasWindow) return;

	try {
		if (token) {
			window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
		} else {
			window.localStorage.removeItem(ACCESS_TOKEN_KEY);
		}
	} catch {
		// Ignore storage failures and keep auth functional in memory.
	}
};

export const clearAuthStorage = () => {
	setStoredAccessToken(null);
};

