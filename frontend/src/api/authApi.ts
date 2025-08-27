const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`;

export function login(googleAccessToken: string) {
  return fetch(`${AUTH_API_BASE_URL}/google-login/`, {
    method: "POST",
    credentials: "include", // This includes the refresh token cookie with the request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ googleAccessToken: googleAccessToken }),
  });
}

export function logout() {
  return fetch(`${AUTH_API_BASE_URL}/logout/`, {
    method: "POST",
    credentials: "include", // This includes the refresh token cookie with the request
  });
}
    
// Manually attach refreshToken since this will be a cross-origin request
// from the browser extension to the web app.
// credentials: "include" only works for same origin/domain requests.
export function refreshAccessTokenAndUserInfo(currentRefreshTokenValue: string) {
  return fetch(`${AUTH_API_BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${currentRefreshTokenValue}` // manually attach cookie
    },
  });
}
