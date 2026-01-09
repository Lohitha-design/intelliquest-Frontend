// src/utils/storage.js

export const saveToken = (token) => {
  try {
    window.localStorage.setItem("token", token);
    return;
  } catch (e) {
    console.warn("localStorage blocked");
  }

  try {
    window.sessionStorage.setItem("token", token);
    return;
  } catch (e) {
    console.warn("sessionStorage blocked");
  }

  // fallback (optional)
  window.__AUTH_TOKEN__ = token;
};
