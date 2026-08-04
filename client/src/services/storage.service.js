const ACCESS_TOKEN_KEY = "hirepilot.auth.accessToken";
const LOGGED_OUT_KEY = "hirepilot.auth.loggedOut";

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

// Session-scoped marker set on explicit logout / auth failure so that a
// subsequent full page load does NOT try to restore the session (which would
// redirect a logged-out user straight back to their dashboard).
export const hasLoggedOutMarker = () => {
	if (!hasWindow) return false;

	try {
		return window.sessionStorage.getItem(LOGGED_OUT_KEY) === "1";
	} catch {
		return false;
	}
};

export const setLoggedOutMarker = () => {
	if (!hasWindow) return;

	try {
		window.sessionStorage.setItem(LOGGED_OUT_KEY, "1");
	} catch {
		// Ignore storage failures.
	}
};

export const clearLoggedOutMarker = () => {
	if (!hasWindow) return;

	try {
		window.sessionStorage.removeItem(LOGGED_OUT_KEY);
	} catch {
		// Ignore storage failures.
	}
};

export const clearAuthStorage = () => {
	setStoredAccessToken(null);

	if (!hasWindow) return;

	try {
		window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
	} catch {
		// Ignore storage failures.
	}
};
