import { refreshToken } from "./api/authApi";

import type { User } from "./types/user";

function getDomainCookie(domain: string, cookieName: string)
  : Promise<chrome.cookies.Cookie | undefined> {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain }, (cookies) => {
      const matchCookie = cookies.find((cookie) => cookie.name === cookieName);
      resolve(matchCookie);
    });
  });
}

async function refreshLogin() {
  const refreshTokenCookie = await getDomainCookie("localhost", "refreshToken");
  if (!refreshTokenCookie) return null;

  const response = await refreshToken(refreshTokenCookie.value);
  if (!response.ok) return null;

  const accessTokenAndUser = await response.json();
  await chrome.storage.local.set({
    accessToken: accessTokenAndUser.accessToken,
    userInfo: accessTokenAndUser.userInfo,
  });

  return accessTokenAndUser;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "AUTHENTICATE_USER") {
    (async () => {
      try {
        const result = await new Promise<{ accessToken?: string }>((resolve) => {
          chrome.storage.local.get(["accessToken"], (result) => {
            resolve(result);
          });
        });

        if (result.accessToken) {
          sendResponse({ isAuthenticated: true });
          return;
        }

        const accessTokenAndUser = await refreshLogin();

        if (accessTokenAndUser) {
          sendResponse({ isAuthenticated: true });
          return;
        }

        sendResponse({ isAuthenticated: false });
      } catch (err) {
        console.error("Authentication error:", err);
        sendResponse({ isAuthenticated: false, error: String(err) });
      }
    })();

    // Important: keep message channel open for async sendResponse
    return true;
  }

  if (message.type === "GET_USER_INFO") {
    (async () => {
      const result = await new Promise<{ userInfo?: User }>((resolve) => {
        chrome.storage.local.get(["userInfo"], (result) => {
          resolve(result);
        });
      });

      if (result.userInfo) {
        sendResponse(result.userInfo);
        return;
      }

      return null;
    })();

    // Important: keep message channel open for async sendResponse
    return true;
  }
});
