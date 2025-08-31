import * as authApi from "./api/authApi";
import { getLinkedInJobUrl } from "./utils/linkedin";

import type { User } from "./types/user";

const WEB_APP_DOMAIN = import.meta.env.VITE_WEB_APP_DOMAIN;

function getDomainCookie(domain: string, cookieName: string)
  : Promise<chrome.cookies.Cookie | undefined> {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain }, (cookies) => {
      const matchCookie = cookies.find((cookie) => cookie.name === cookieName);
      resolve(matchCookie);
    });
  });
}

// Refresh accessToken and userInfo using web app refreshToken cookie 
async function refreshLogin() {
  const refreshTokenCookie = await getDomainCookie(WEB_APP_DOMAIN, "refreshToken");
  if (!refreshTokenCookie) return null;

  const response = await authApi.refreshAccessTokenAndUserInfo(refreshTokenCookie.value);
  if (!response.ok) return null;

  // Store accessToken and userInfo in Chrome local storage
  const accessTokenAndUser = await response.json();
  await chrome.storage.local.set({
    accessToken: accessTokenAndUser.accessToken,
    userInfo: accessTokenAndUser.userInfo,
  });

  return accessTokenAndUser;
}

// Chrome extension message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "AUTHENTICATE_USER") {
    (async () => {
      try {
        // Retrieve accessToken and userInfo from Chrome local storage
        const result = await new Promise<{ accessToken?: string, userInfo?: User }>
          ((resolve) => {
            chrome.storage.local.get(["accessToken", "userInfo"], (result) => {
              resolve(result);
            });
          });

        // If accessToken and userInfo are both available in 
        // local storage, implicitly authenticate the user. 
        // NOTE: accessToken may be invalid/expired.
        if (result.accessToken && result.userInfo) {
          sendResponse({ isAuthenticated: true });
          return;
        }

        // Refresh accessToken and userInfo via web app refreshToken
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

  // Logout removes all items from Chrome local storage
  // and calls the web server logout endpoint (to delete refresh token)
  if (message.type === "LOGOUT") {
    (async () => {
      await chrome.storage.local.clear();
      authApi.logout();
      sendResponse();
    })();

    // Important: keep message channel open for async sendResponse
    return true;
  }

  if (message.type === "GET_USER_INFO") {
    (async () => {
      // Retrieve userInfo from Chrome local storage
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

  if (message.type === "GET_LINKED_IN_JOB_URL") {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); 
      if (tab?.url) {
        sendResponse(getLinkedInJobUrl(tab.url));
      }

      return null;
    })();

    // Important: keep message channel open for async sendResponse
    return true;
  }
});